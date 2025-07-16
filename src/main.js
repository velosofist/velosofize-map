const southWest = L.latLng(40.749972, 22.118564);
const northEast = L.latLng(44.361463, 29.123858);
const bounds = L.latLngBounds(southWest, northEast);

const map = L.map('map', {
  center: [42.685534, 23.319048], //center on Sofia
  zoom: 13,
  zoomControl: false,
  minZoom: 9,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0      // prevent moving outside bounds
});

const initialMaplibreLayer = L.maplibreGL({
  style: '/src/styles/maplibre-bright-fork/style.json',
  attribution: '&copy; OpenFreemap, Maplibre'
}).addTo(map);

let currentBaseLayer = initialMaplibreLayer;

document.getElementById('legend-button').onclick = function() {
  document.getElementById('legend-overlay').style.display = 'flex';
};
document.getElementById('close-legend').onclick = function() {
  document.getElementById('legend-overlay').style.display = 'none';
};
document.getElementById('switch-language-legend').onclick = function() {
  const iframe = document.getElementById('legend-iframe');
  if (iframe.src.includes('/legend/bg/cyclosm_legend.html')) {
    iframe.src = '/legend/en/cyclosm_legend.html';
  } else {
    iframe.src = '/legend/bg/cyclosm_legend.html';
  }
};

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

const layerOrder = [
  {
    name: 'libre',
    icon: '/attachments/tile_icons/tile_osm.png',
    alt: 'Maplibre',
    source: L.maplibreGL('/src/styles/maplibre-bright-fork/style.json'),
  },
  {
    name: 'cyclosm',
    icon: '/attachments/tile_icons/tile_cyclosm.png',
    alt: 'CyclOSM',
    source: L.maplibreGL('/src/styles/cyclosm/style.json'),
  },
  { 
    name: 'satellite',
    icon: '/attachments/tile_icons/tile_sat.png',
    alt: 'Satellite',
    source: L.maplibreGL('/src/styles/satellite/style.json'),
  }
];

let currentLayerIdx = 0;

function updateLayerIcon() {
  const { icon, alt } = layerOrder[currentLayerIdx];
  document.getElementById('layer-icon-img').src = icon;
  document.getElementById('layer-icon-img').alt = alt;
}

document.getElementById('layer-icon-btn').onclick = function() {
  currentLayerIdx = (currentLayerIdx + 1) % layerOrder.length;
  setBaseLayer(layerOrder[currentLayerIdx].name);
  updateLayerIcon();
};

// Ensure icon matches current layer on load
updateLayerIcon();

function flashLayerName(layerKey) {
  const flashDiv = document.getElementById('layer-name-flash');

  const layer = layerOrder.find(l => l.name === layerKey);

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
  // Remove MapLibre GL if it's still present
  if (map.hasLayer(initialMaplibreLayer)) {
    map.removeLayer(initialMaplibreLayer);
  }
  // Remove current base layer if present and not MapLibre GL
  if (currentBaseLayer && map.hasLayer(currentBaseLayer) && currentBaseLayer !== initialMaplibreLayer) {
    map.removeLayer(currentBaseLayer);
  }
  // Add the new base layer
  currentBaseLayer = layerOrder.find(layer => layer.name === layerName)?.source;
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

let userLayer = null;

document.getElementById('upload-layer-button').onclick = function() {
  document.getElementById('upload-layer').click();
};

document.getElementById('upload-layer').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Remove previous user layer if present
  if (userLayer) {
    map.removeLayer(userLayer);
    userLayer = null;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      let ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'geojson' || ext === 'json') {
        userLayer = omnivore.geojson.parse(e.target.result);
      } else if (ext === 'gpx') {
        userLayer = omnivore.gpx.parse(e.target.result);
      } else if (ext === 'kml') {
        userLayer = omnivore.kml.parse(e.target.result);
      } else {
        alert('Unsupported file type.');
        return;
      }
      userLayer.addTo(map);
      try {
        map.fitBounds(userLayer.getBounds());
      } catch (err) {
        // If no bounds (empty file), do nothing
      }
    } catch (err) {
      alert('Invalid file.');
    }
  };
  reader.readAsText(file);
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