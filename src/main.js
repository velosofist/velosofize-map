const map = L.map('map', {
center: [42.685534, 23.319048],
zoom: 13,
zoomControl: false
});

document.getElementById('legend-btn').onclick = function() {
document.getElementById('legend-overlay').style.display = 'flex';
};
document.getElementById('close-legend').onclick = function() {
document.getElementById('legend-overlay').style.display = 'none';
};
document.getElementById('switch-language-legend').onclick = function() {
  const iframe = document.getElementById('legend-iframe');
  iframe.src = iframe.src.endsWith('cyclosm_legend.html')
    ? './cyclosm_legend_en.html'
    : './cyclosm_legend.html';
};
document.getElementById('legend-overlay').onclick = function(e) {
if (e.target === this) this.style.display = 'none';
};

// ...existing code...

// Place custom zoom buttons inside your overlay-toggle-secondary div
function createStyledButton(label, icon, onClick) {
  const btn = document.createElement('button');
  btn.title = label;
  btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 28px;">${icon}</span>`;
  btn.style.margin = '0 4px';
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

window.addEventListener('DOMContentLoaded', () => {
  // Find the overlay-toggle-secondary div
  const secondaryDiv = document.getElementById('overlay-zoom');
  if (secondaryDiv) {
    // Create zoom in/out buttons
    const zoomInBtn = createStyledButton('Zoom in', 'add', () => map.zoomIn());
    const zoomOutBtn = createStyledButton('Zoom out', 'remove', () => map.zoomOut());

    // Stack buttons vertically
    const zoomBtnContainer = document.createElement('div');
    zoomBtnContainer.style.display = 'flex';
    zoomBtnContainer.style.flexDirection = 'column';
    zoomBtnContainer.style.alignItems = 'center';
    zoomBtnContainer.style.gap = '8px';

    zoomBtnContainer.appendChild(zoomInBtn);
    zoomBtnContainer.appendChild(zoomOutBtn);

    // Add to the overlay-toggle-secondary div
    secondaryDiv.appendChild(zoomBtnContainer);
  }
});

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
{ name: 'cyclosm', icon: 'tile_icons/tile_cyclosm.png', alt: 'CyclOSM' },
{ name: 'osm',     icon: 'tile_icons/tile_osm.png',     alt: 'OpenStreetMap' },
{ name: 'esri',    icon: 'tile_icons/tile_sat.png',     alt: 'Satellite' }
];
let currentLayerIdx = 0;

function updateLayerIcon() {
const { icon, alt } = layerOrder[currentLayerIdx];
document.getElementById('layer-icon-img').src = icon;
document.getElementById('layer-icon-img').alt = alt;
}

document.getElementById('layer-icon-btn').onclick = function() {
// Cycle to next layer
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
}, 500); // Show for 0.7s before starting fade out
}

// Example: Call this in your setBaseLayer function
function setBaseLayer(layerName) {
if (layers[layerName] && currentBaseLayer !== layers[layerName]) {
    map.removeLayer(currentBaseLayer);
    map.addLayer(layers[layerName]);
    currentBaseLayer = layers[layerName];
    flashLayerName(layerName);
}
}