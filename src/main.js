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

window.addEventListener('resize', () => {
  document.getElementById('map').style.height = window.innerHeight + 'px';
  document.getElementById('map').style.width = window.innerWidth + 'px';
  if (map && map.invalidateSize) {
    map.invalidateSize();
  }
});

window.onload = function() {
  console.log('Window onload event fired');
  
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

  addCyclosmLiteButton()
  addPrimaryOverlayButtons()
  addExternalOverlayButtons()

  addHideExternalOverlaysButton();
  addZoomControls();
  addCurrentLocationButton();

  miscButtons()
};

document.getElementById('map').style.height = window.innerHeight + 'px';
document.getElementById('map').style.width = window.innerWidth + 'px';