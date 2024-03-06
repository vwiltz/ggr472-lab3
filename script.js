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
        'id': 'polygon-fill', //  unique layer ID
        'type': 'fill',
        'source': 'air-pollution',  // data source: 
        'paint': {
            'fill-color': [
                'step',
                ['get', 'Average PM2.5 concentration'],
                '#FEF0D9',
                5.739241, '#FDCC8A',
                6.038870, '#FC8D59',
                6.238142, '#E34A33',
                6.789689, '#B30000',
                '#9C9C9C'
            ]
        }
    });

    map.addLayer({
        'id': 'polygon-borders', // unique layer ID
        'type': 'line',
        'source': 'air-pollution', // 
        'paint': {
            'line-color': 'black',
            'line-width': 1
        }
    });

    /*   map.addLayer({
           'id': 'brownfield-points', // unique layer ID
           'type': 'circle',
           'source': 'brownfields', // data source: brownfields/contaminated sites
           'paint': {
               'circle-radius': 2,
               'circle-color': '#362c22'
           }
       }); */

    map.on('click', 'polygon-fill', (e) => {

        console.log

    })


});