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
        'source': 'air-pollution',  // data source: 
        'paint': {
            'fill-color': [
                'case',
                ['==', ['get', 'Average PM2.5 concentration'], null], "#9C9C9C",
                ['step',
                    ['get', 'Average PM2.5 concentration'],

                    '#FEF0D9',
                    5.739241, '#FDCC8A',
                    6.038870, '#FC8D59',
                    6.238142, '#E34A33',
                    6.789689, '#B30000']

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