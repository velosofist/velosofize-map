defaultBaseLayer.addTo(map);
let currentBaseLayer = defaultBaseLayer;
let currentBaseLayerId = 0;
updateLayerIcon();

document.getElementById('layer-icon-btn').onclick = function() {
  currentBaseLayerId = (currentBaseLayerId + 1) % baseLayerConfig.length;
  setBaseLayer(baseLayerConfig[currentBaseLayerId].name);
  updateLayerIcon();
};

map.getContainer().addEventListener('contextmenu', e => e.preventDefault());

map.on('contextmenu', function (e) {
  addLabeledMarker(e.latlng);
});

setupDirectionToggleButton();

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