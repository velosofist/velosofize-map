// Limits to the coordinates users can view (around Bulgaria's borders)
const southWest = L.latLng(
  40.749972, 
  22.118564
);
const northEast = L.latLng(
  44.361463, 
  29.123858
);
const bounds = L.latLngBounds(southWest, northEast);

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
  },
  {
    name: 'cyclosm',
    icon: '/attachments/tile_icons/tile_cyclosm.png',
    alt: 'CyclOSM',
    render: 'maplibre',
    style: '/src/styles/cyclosm/style.json',
    attribution: '&copy; CyclOSM, OpenStreetMap contributors'
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

const overlaysData = {
    "primary": [
        {
            "url": "/overlays/separated/velosofize_bikelanes.kml",
            "label": "Велоалеи / Bike lanes",
            "icon": "bike_lane",
            "disabled": false
        },
        {
            "url": "/overlays/separated/velosofize_routes.kml",
            "label": "Отсечки от Velosofize (по субективни критерии) / Routes from Velosofize (subjective)",
            "icon": "directions_bike",
            "disabled": false
        },
    ],
    "secondary": [

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
