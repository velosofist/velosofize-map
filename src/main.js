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

const layers = {
  cyclosm: L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      attribution: '&copy; CyclOSM, OpenStreetMap contributors'
  }),
  osm: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
  }),
  esri: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri, Earthstar Geographics'
  })
};

const layerOrder = [
  { name: 'cyclosm', icon: '/attachments/tile_icons/tile_cyclosm.png', alt: 'CyclOSM' },
  { name: 'osm',     icon: '/attachments/tile_icons/tile_osm.png',     alt: 'OpenStreetMap' },
  { name: 'esri',    icon: '/attachments/tile_icons/tile_sat.png',     alt: 'Satellite' }
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

// Default base layer
layers.cyclosm.addTo(map);
let currentBaseLayer = layers.cyclosm;

const layerFlashNames = {
  cyclosm: "CyclOSM",
  osm: "OpenStreetMap",
  esri: "Satellite"
};

function flashLayerName(layerKey) {
  const flashDiv = document.getElementById('layer-name-flash');
  flashDiv.textContent = layerFlashNames[layerKey] || '';
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
  if (layers[layerName] && currentBaseLayer !== layers[layerName]) {
      map.removeLayer(currentBaseLayer);
      map.addLayer(layers[layerName]);
      currentBaseLayer = layers[layerName];
      flashLayerName(layerName);
  }
}

window.addEventListener('resize', () => {
  document.getElementById('map').style.height = window.innerHeight + 'px';
  document.getElementById('map').style.width = window.innerWidth + 'px';
  if (window.map && window.map.invalidateSize) {
    window.map.invalidateSize();
  }
});

document.getElementById('map').style.height = window.innerHeight + 'px';
document.getElementById('map').style.width = window.innerWidth + 'px';