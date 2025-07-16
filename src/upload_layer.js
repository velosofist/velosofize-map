
document.getElementById('upload-layer-button').onclick = function() {
  document.getElementById('upload-layer').click();
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
