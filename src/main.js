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
    style: '/src/styles/maplibre-bright-fork/style.json',
    attribution: '&copy; OpenFreemap, Maplibre'
  },
  {
    name: 'cyclosm',
    icon: '/attachments/tile_icons/tile_cyclosm.png',
    alt: 'CyclOSM',
    style: '/src/styles/cyclosm/style.json',
    attribution: '&copy; OpenFreemap, Maplibre'
  },
  { 
    name: 'satellite',
    icon: '/attachments/tile_icons/tile_sat.png',
    alt: 'Satellite',
    style: '/src/styles/satellite/style.json',
    attribution: '&copy; OpenFreemap, Maplibre'
  }
];

function sourceFromMapLibre(key) {
  return L.maplibreGL({
    style: baseLayerConfig.find(layer => layer.name === key)?.style,
    attribution: baseLayerConfig.find(layer => layer.name === key)?.attribution
  })
};

const layers = {
  libre: sourceFromMapLibre('libre'),
  cyclosm: sourceFromMapLibre('cyclosm'),
  satellite: sourceFromMapLibre('satellite')
}; 

const defaultBaseLayer = layers['libre']

defaultBaseLayer.addTo(map);

let currentBaseLayer = defaultBaseLayer;

function createStyledButton(label, icon, onClick) {
  const btn = document.createElement('button');
  btn.title = label;
  btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 28px;">${icon}</span>`;
  btn.style.padding = '4px 4px';
  btn.style.fontSize = '14px';
  btn.style.cursor = 'pointer';
  btn.style.border = "2px solid rgba(0, 0, 0, 0.4)";
  btn.style.background = '#eee8d5';
  btn.style.color = '#08103b';
  btn.style.borderRadius = '50%';
  btn.dataset.active = 'false';
  btn.onclick = onClick;
  return btn;
}

document.getElementById('fullscreen-button').onclick = function() {
  const elem = document.documentElement; // or document.getElementById('map') for just the map
  if (!document.fullscreenElement) {
    elem.requestFullscreen().catch(err => {
      alert(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
};

let currentLayerIdx = 0;

function updateLayerIcon() {
  const { icon, alt } = baseLayerConfig[currentLayerIdx];
  document.getElementById('layer-icon-img').src = icon;
  document.getElementById('layer-icon-img').alt = alt;
}

document.getElementById('layer-icon-btn').onclick = function() {
  currentLayerIdx = (currentLayerIdx + 1) % baseLayerConfig.length;
  setBaseLayer(baseLayerConfig[currentLayerIdx].name);
  updateLayerIcon();
};

// Ensure icon matches current layer on load
updateLayerIcon();

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

window.addEventListener('resize', () => {
  document.getElementById('map').style.height = window.innerHeight + 'px';
  document.getElementById('map').style.width = window.innerWidth + 'px';
  if (window.map && window.map.invalidateSize) {
    window.map.invalidateSize();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const projectHeader = document.getElementById('project-header');
  const linkButtons = document.getElementById('link-buttons');

  projectHeader.onclick = function(e) {
    // Only toggle if not clicking a link inside the dropdown
    if (e.target.closest('#link-buttons')) return;
    linkButtons.style.display = (linkButtons.style.display === 'flex') ? 'none' : 'flex';
  };

  // Optional: Hide dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!projectHeader.contains(e.target)) {
      linkButtons.style.display = 'none';
    }
  });
});

document.getElementById('map').style.height = window.innerHeight + 'px';
document.getElementById('map').style.width = window.innerWidth + 'px';