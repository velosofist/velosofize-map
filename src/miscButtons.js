

// Dynamically create and append overlay control buttons to the correct container pod
function miscButtons() {
  // Find the container pod for the right upper controls
  const rightUpperPod = document.querySelector('#container-misc-buttons .button-container-pod');
  if (!rightUpperPod) return;

  
  // --- Fullscreen Button ---
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.id = 'fullscreen-button';
  fullscreenBtn.className = 'overlay-toggle-button';
  fullscreenBtn.title = 'Full screen';
  fullscreenBtn.innerHTML = '<span class="material-symbols-outlined">fullscreen</span>';
  fullscreenBtn.onclick = function() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  rightUpperPod.appendChild(fullscreenBtn);
  
  // --- Legend Button ---
  const legendBtn = document.createElement('button');
  legendBtn.id = 'legend-button';
  legendBtn.className = 'overlay-toggle-button';
  legendBtn.title = 'Legend';
  legendBtn.innerHTML = '<span class="material-symbols-outlined">help</span>';
  legendBtn.onclick = function() {
    document.getElementById('legend-overlay').style.display = 'flex';
  };
  rightUpperPod.appendChild(legendBtn);

  // --- Upload Layer Button ---
  const uploadBtn = document.createElement('button');
  uploadBtn.id = 'upload-layer';
  uploadBtn.className = 'overlay-toggle-button';
  uploadBtn.title = 'Add custom layer';
  uploadBtn.innerHTML = '<span class="material-symbols-outlined">upload_file</span>';
  uploadBtn.onclick = function() {
    document.getElementById('upload-layer').click();
  };
  rightUpperPod.appendChild(uploadBtn);
};

let userLayer = null;

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