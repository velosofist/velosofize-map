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
