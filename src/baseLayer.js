function renderWithMapLibre(key) {
  const  layerConfig = baseLayerConfig.find(layer => layer.name === key);
    return L.maplibreGL({
        style: layerConfig?.style,
        attribution: layerConfig?.attribution
    })
}


function renderWithLeaflet(key) {
  const layerConfig = baseLayerConfig.find(layer => layer.name === key);
    return L.tileLayer(
        layerConfig?.style, {
        attribution: layerConfig?.attribution
    })
}

function fillBaseLayerList() {
  const layers = {};

  for (const layer of baseLayerConfig) {
    if (layer.render === 'maplibre') {
      layers[layer.name] = renderWithMapLibre(layer.name);
    } else if (layer.render === 'leaflet') {
      layers[layer.name] = renderWithLeaflet(layer.name);
    } else if (layer.render === 'leaflet_auth') {
      layers[layer.name] = renderWithLeafletAuth(layer.name);
    } else {
      console.warn(`Unknown render method for layer: ${layer.name}`);
    }
  }

  return layers;
};

layersList = fillBaseLayerList();
const defaultBaseLayer = layersList['libre'];

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

async function setBaseLayer(layerName) {
  // Remove default base layer if it's still present
  if (map.hasLayer(defaultBaseLayer)) {
    map.removeLayer(defaultBaseLayer);
  }
  // Remove current base layer if present and not the default
  if (currentBaseLayer && map.hasLayer(currentBaseLayer) && currentBaseLayer !== defaultBaseLayer) {
    map.removeLayer(currentBaseLayer);
  }
  let newLayer = layersList[layerName];
  if (newLayer instanceof Promise) {
    newLayer = await newLayer;
    layersList[layerName] = newLayer; // cache resolved layer
  }
  // Add the new base layer
  currentBaseLayer = layersList[layerName];
  currentBaseLayer.addTo(map);
  flashLayerName(layerName);
}