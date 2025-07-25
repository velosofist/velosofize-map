function getThunderforestApiKey() {
  return firebase.firestore()
    .collection(firebase_collection)
    .doc(firebase_document)
    .get()
    .then(doc => {
      if (doc.exists && doc.data().apiKey) {
        return doc.data().apiKey;
      } else {
        throw new Error('Thunderforest API key not found in Firestore');
      }
    });
}

function renderWithMapLibre(key) {
    return L.maplibreGL({
        style: baseLayerConfig.find(layer => layer.name === key)?.style,
        attribution: baseLayerConfig.find(layer => layer.name === key)?.attribution
    })
}


function renderWithLeaflet(key) {
  const layerConfig = baseLayerConfig.find(layer => layer.name === key);
    return L.tileLayer(
        baseLayerConfig.find(layer => layer.name === key)?.style, {
        attribution: baseLayerConfig.find(layer => layer.name === key)?.attribution
    })
}

function renderWithLeafletAuth(key) {
  const layerConfig = baseLayerConfig.find(layer => layer.name === key);
  return getThunderforestApiKey().then(apiKey => {
    const url = baseLayerConfig.find(layer => layer.name === key)?.style + `?apikey=${apiKey}`;
    return L.tileLayer(url, {
      attribution: layerConfig.attribution
    });
  });
}

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

async function setBaseLayer(layerName) {
  // Remove default base layer if it's still present
  if (map.hasLayer(defaultBaseLayer)) {
    map.removeLayer(defaultBaseLayer);
  }
  // Remove current base layer if present and not the default
  if (currentBaseLayer && map.hasLayer(currentBaseLayer) && currentBaseLayer !== defaultBaseLayer) {
    map.removeLayer(currentBaseLayer);
  }
  let newLayer = layers[layerName];
  if (newLayer instanceof Promise) {
    newLayer = await newLayer;
    layers[layerName] = newLayer; // cache resolved layer
  }
  // Add the new base layer
  currentBaseLayer = layers[layerName];
  currentBaseLayer.addTo(map);
  flashLayerName(layerName);
}