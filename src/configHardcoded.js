// Limits to the coordinates users can view (around Bulgaria's borders)
const southBound = 40.749972;
const westBound = 22.118564;
const northBound = 44.361463;
const eastBound = 29.123858;

// Pass coordinate arrays directly
const bounds = L.latLngBounds(
  [southBound, westBound],
  [northBound, eastBound]
);

const map = L.map('map', {
  //center on Sofia center
  center: [
    42.685534, 
    23.319048
  ],
  zoom: 13,
  zoomControl: false,
  minZoom: 8,
  maxZoom: 19,
  maxBounds: bounds,
  maxBoundsViscosity: 0.5
});

const baseLayerConfig = [
  {
    name: 'libre',
    icon: '/attachments/tile_icons/tile_osm.png',
    alt: 'Maplibre',
    render: 'maplibre',
    style: '/src/styles/bright/style.json',
    attribution: '&copy; OpenFreemap, Maplibre'
  }
];

// Mapping of relevant styles from Google My Maps to Material Symbols icon names
const iconMapping = {
    '1589': 'fitness_center',
    '1877': 'stairs_2',
    '1833': 'directions_walk',
    '1718': 'tram',
    '1716': 'train',
    '1703': 'water_bottle',
    '959': 'car_crash',
    '1532': 'directions_bus',
    '1634': 'landscape',
    '1644': 'local_parking',
};

const overlaysConfig = {
    "primary": [
        {
            "url": "/overlays/separated/velosofize_bikelanes.kml",
            "label": "Велоалеи / Bike lanes",
            "icon": "bike_lane",
            "enabledByDefault": true,
            "disabled": false
        },
        {
            "url": "/overlays/separated/velosofize_routes.kml",
            "label": "Отсечки от Velosofize (по субективни критерии) / Routes from Velosofize (subjective)",
            "icon": "directions_bike",
            "enabledByDefault": true,
            "disabled": false
        },
    ],
    "external": [
        {
            "url": "/overlays/chernapista/chernapista_condensed.kml",
            "label": "ПТП с участие на велосипедисти от chernapista.com",
            "icon": "car_crash",
            "disabled": false
        },
    ]
};
