// default mapbox public access token
mapboxgl.accessToken = 'pk.eyJ1IjoidndpbHR6IiwiYSI6ImNscmZ0N3liOTA1Mmkybm8xeGU0cmZuOW8ifQ.EpQc24rhxsadjwWf3mvoiQ';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    center: [-79.365, 43.725],
    zoom: 10.5,
});

// add a data source from geojson
map.on('load', () => {
    // add data sources containing GeoJSON data
    map.addSource('brownfields', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/vwiltz/ggr472-lab3/main/data/brownfields.geojson'
    });

    map.addSource('air-pollution', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/vwiltz/ggr472-lab3/main/data/airpollution.geojson'
    });


    map.addLayer({
        'id': 'brownfield-points', // unique layer ID
        'type': 'circle',
        'source': 'brownfields', // data source: brownfields/contaminated sites
        'paint': {
            'circle-radius': 2,
            'circle-color': '#362c22'
        }
    });
});