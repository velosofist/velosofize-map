// Dynamically create and append overlay control buttons to the correct container pod
function miscButtons() {
  // Find the container pod for the right upper controls
  const rightUpperPod = document.querySelector('#container-misc-buttons .button-container-pod');
  if (!rightUpperPod) return;

  // --- Fullscreen Button ---
  const fullscreenBtn = createStyledButton(
    'Full screen',
    'fullscreen',
    function() {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          alert(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  );
  fullscreenBtn.id = 'fullscreen-button';
  rightUpperPod.appendChild(fullscreenBtn);

  // --- Legend Button ---
  const legendBtn = createStyledButton(
    'Legend',
    'help',
    function() {
      document.getElementById('legend-overlay').style.display = 'flex';
    }
  );
  legendBtn.id = 'legend-button';
  rightUpperPod.appendChild(legendBtn);

  // --- Upload Layer Button ---
  // Create a hidden file input for uploading
  let uploadInput = document.getElementById('upload-layer-input');
  if (!uploadInput) {
    uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.id = 'upload-layer-input';
    uploadInput.style.display = 'none';
    document.body.appendChild(uploadInput);
  }

  const uploadBtn = createStyledButton(
    'Add custom layer',
    'upload_file',
    function() {
      uploadInput.click();
    }
  );
  uploadBtn.id = 'upload-layer';
  rightUpperPod.appendChild(uploadBtn);
}

let userLayer = null;

document.addEventListener('DOMContentLoaded', function() {
  const uploadInput = document.getElementById('upload-layer-input');
  if (!uploadInput) return;

  uploadInput.addEventListener('change', function(event) {
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
});