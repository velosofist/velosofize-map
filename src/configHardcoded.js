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
  minZoom: 9,
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
            "url": "/export_formats/separated/velosofize_export_bikelanes.kml",
            "label": "Велоалеи / Bike lanes",
            "icon": "bike_lane",
            "disabled": false
        },
        {
            "url": "/export_formats/separated/velosofize_export_others.kml",
            "label": "",
            "icon": "directions_bike",
            "disabled": false
        },
        {
            "url": "/export_formats/external_sources/sofenhagen_routes.kml",
            "label": "Отсечки в София от Sofenhagen.com / Routes in Sofia from Sofenhagen.com",
            "icon": "/attachments/misc_icons/logo_sofen.png",
            "disabled": false
        }
    ],
    "secondary": [
        {
            "url": "/export_formats/misc_layers/crossings.kml",
            "label": "Пресичания / Crossings",
            "icon": "directions_walk",
            "disabled": false
        },
        {
            "url": "/export_formats/misc_layers/transport.kml",
            "label": "Транспорт / Transport",
            "icon": "train",
            "disabled": false
        },
        {
            "url": "/export_formats/misc_layers/slow_zones.kml",
            "label": "Бавни зони / Slow zones",
            "icon": "30fps",
            "disabled": true
        },
        {
            "url": "/export_formats/misc_layers/others.kml",
            "label": "Други / Others",
            "icon": "quiz",
            "disabled": true
        },
        {
            "url": "/export_formats/external_sources/bike_parking.kml",
            "label": "Велопаркинги / Bicycle parking (© OpenStreetMap contributors)",
            "icon": "local_parking",
            "disabled": false
        }
    ],
    "external": [
        {
            "url": "/export_formats/external_sources/mtb_bg.kml",
            "label": "Маршрути от MTB-BG.com / Routes from MTB-BG.com",
            "icon": "https://mtb-bg.com/wp-content/uploads/2020/04/cropped-favicon-mtb-1-32x32.png",
            "disabled": false
        },
        {
            "url": "/export_formats/external_sources/alabak.kml",
            "label": "Планински маршрути в местност Алабак / Mountain routes from Alabak.info",
            "icon": "https://alabak.info/favicon.ico",
            "disabled": false
        },
        {
            "url": "/export_formats/chernapista_condensed/chernapista_condensed.kml",
            "label": "ПТП с участие на велосипедисти от chernapista.com",
            "icon": "car_crash",
            "disabled": false
        },
    ]
};
