// default mapbox public access token
mapboxgl.accessToken = 'pk.eyJ1IjoidndpbHR6IiwiYSI6ImNscmZ0N3liOTA1Mmkybm8xeGU0cmZuOW8ifQ.EpQc24rhxsadjwWf3mvoiQ';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-79.365, 43.725],
    zoom: 10.5,
});

// event listener waits for map to finish loading before executing code
map.on('load', () => {
    // add data sources containing GeoJSON data
    map.addSource('brownfields', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/vwiltz/ggr472-lab3/main/data/brownfields.geojson',
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50
    });

    map.addSource('air-pollution', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/vwiltz/ggr472-lab3/main/data/airpollution.geojson'
    });

    map.addLayer({
        'id': 'polygon-fill', //  unique layer ID
        'type': 'fill',
        'source': 'air-pollution',
        'paint': {
            'fill-color': [
                'case', // expression
                ['==', ['get', 'Average PM2.5 concentration'], null], "#9C9C9C", // check if pm2.5 data is null, assign grey colour if true
                ['step', // expression
                    ['get', 'Average PM2.5 concentration'],

                    '#FEF0D9',
                    5.739241, '#FDCC8A',
                    6.038870, '#FC8D59',
                    6.238142, '#E34A33',
                    6.789689, '#B30000']

            ],
            'fill-opacity': [
                'case', // expression
                ['boolean', ['feature-state', 'hover'], false],
                1,
                0.7
            ],
            'fill-outline-color': 'white',
        }
    });

    map.addLayer({
        'id': 'polygon-borders', // unique layer ID
        'type': 'line',
        'source': 'air-pollution', // 
        'paint': {
            'line-color': 'black',
            'line-width': 0.7
        }
    });

    map.addLayer({
        'id': 'clusters',
        'type': 'circle',
        'source': 'brownfields',
        'filter': ['has', 'point_count'],
        'paint': {
            'circle-color': [
                'step',
                ['get', 'point_count'],
                '#51bbd6',
                50,
                '#f1f075',
                100,
                '#ff0000'
            ],
            'circle-radius': [
                'step',
                ['get', 'point_count'],
                20,
                50,
                30,
                100,
                40
            ]
        }
    });

    map.addLayer({
        'id': 'cluster-count',
        'type': 'symbol',
        'source': 'brownfields',
        'filter': ['has', 'point_count'],
        'layout': {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
        }
    });

    map.addLayer({
        'id': 'unclustered-point',
        'type': 'circle',
        'source': 'brownfields',
        'filter': ['!', ['has', 'point_count']],
        'paint': {
            'circle-color': '#11b4da',
            'circle-radius': 4,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#fff'
        }
    });
    let polygonID = null; // initialize polygon ID variable as null; keep track of ID of currently hovered polygon

    map.on('mousemove', 'polygon-fill', (e) => { // event listener for mousemove event
        if (e.features.length > 0) { // check if there are any features under mouse cursor
            if (polygonID !== null) { // If polygonID IS NOT NULL set hover feature state back to false to remove opacity from previous highlighted polygon
                map.setFeatureState(
                    { source: 'air-pollution', id: polygonID },
                    { hover: false }
                );
            }
            polygonID = e.features[0].id; // Update polygonID to featureID
            map.setFeatureState(
                { source: 'air-pollution', id: polygonID },
                { hover: true } // Update hover feature state to TRUE to change opacity of layer to 1
            );
        }
    });

    map.on('mouseleave', 'polygon-fill', () => { // If mouse leaves the GeoJSON layer, set all hover states to false and polygonID variable back to null
        if (polygonID !== null) {
            map.setFeatureState(
                { source: 'air-pollution', id: polygonID },
                { hover: false }
            );
        }
        polygonID = null;
    });

    const popup = new mapboxgl.Popup({
        closeButton: false, // disable close button
        closeOnClick: false // disable close on click
    });

    map.on('mousemove', 'polygon-fill', (e) => {
        const features = e.features;
        if (features && features.length > 0) { // check if both conditions are true
            // Change the cursor style as a UI indicator that you can interact w/ feature
            map.getCanvas().style.cursor = 'pointer';

            const feature = features[0]; // Get the first feature that the mouse moved over
            const centroid = turf.centroid(feature); // calculate centroid of the feature
            const coordinates = centroid.geometry.coordinates; // coordinates of centroid
            const subdivisionName = feature.properties.CSDNAME; //get name of census subdivision from feature properties
            const pollution = feature.properties['Average PM2.5 concentration']; // get PM2.5 value from feature properties 

            // now create HTML popup using selected properties 
            const popupContent = `<h2>${subdivisionName}</h2>
            <p>Average PM2.5 concentration: ${pollution}</p>`;

            popup.setLngLat(coordinates).setHTML(popupContent).addTo(map); // set coordinates/HTML content for popup; add to map
        } else {
            map.getCanvas().style.cursor = ''; // reset cursor style if no features present
            popup.remove(); // remove popup if no features present
        }
    });

    map.on('mouseleave', 'polygon-fill', () => {
        map.getCanvas().style.cursor = ''; // reset cursor style to default when mouse leaves the layer
        popup.remove(); // remove popup
    });

    const nav = new mapboxgl.NavigationControl({
        visualizePitch: true
    });
    map.addControl(nav, 'bottom-right');

});