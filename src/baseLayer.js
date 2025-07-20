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
  },
  { 
    name: 'satellite',
    icon: '/attachments/tile_icons/tile_sat.png',
    alt: 'Satellite',
    render: 'maplibre',
    style: '/src/styles/satellite/style.json',
    attribution: '&copy; Esri, Earthstar Geographics'
  }
];

function renderWithMapLibre(key) {
    return L.maplibreGL({
        style: baseLayerConfig.find(layer => layer.name === key)?.style,
        attribution: baseLayerConfig.find(layer => layer.name === key)?.attribution
    })
}

function renderWithLeaflet(key) {
    return L.tileLayer(
        baseLayerConfig.find(layer => layer.name === key)?.style, {
        attribution: baseLayerConfig.find(layer => layer.name === key)?.attribution
    })
}

const layers = {};

for (const layer of baseLayerConfig) {
  if (layer.render === 'maplibre') {
    layers[layer.name] = renderWithMapLibre(layer.name);
  } else if (layer.render === 'leaflet') {
    layers[layer.name] = renderWithLeaflet(layer.name);
  } else {
    console.warn(`Unknown render method for layer: ${layer.name}`);
  }
}

const defaultBaseLayer = layers['libre'];

function updateLayerIcon() {
  const { icon, alt } = baseLayerConfig[currentBaseLayerId];
  document.getElementById('layer-icon-img').src = icon;
  document.getElementById('layer-icon-img').alt = alt;
}

function flashLayerName(layerKey) {
  const flashDiv = document.getElementById('layer-name-flash');

  const layer = baseLayerConfig.find(l => l.name === layerKey);

  // Use the 'alt' property as the display name
  flashDiv.textContent = layer ? layer.alt : '';
  flashDiv.style.display = 'block';
  flashDiv.style.opacity = '0.8';

  // Force reflow to restart the transition if called rapidly
  void flashDiv.offsetWidth;

  setTimeout(() => {
    flashDiv.style.opacity = '0';
    setTimeout(() => {
      flashDiv.style.display = 'none';
    }, 500); // Hide after fade out
  }, 500); // Show for x ms before starting fade out
}

function setBaseLayer(layerName) {
  // Remove default base layer if it's still present
  if (map.hasLayer(defaultBaseLayer)) {
    map.removeLayer(defaultBaseLayer);
  }
  // Remove current base layer if present and not the default
  if (currentBaseLayer && map.hasLayer(currentBaseLayer) && currentBaseLayer !== defaultBaseLayer) {
    map.removeLayer(currentBaseLayer);
  }
  // Add the new base layer
  currentBaseLayer = layers[layerName];
  currentBaseLayer.addTo(map);
  flashLayerName(layerName);
}