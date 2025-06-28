
function setupZoomControls() {
  const secondaryDiv = document.getElementById('overlay-zoom');
  if (!secondaryDiv) return;

  const zoomInBtn = createStyledButton('Zoom in', 'add', () => map.zoomIn());
  const zoomOutBtn = createStyledButton('Zoom out', 'remove', () => map.zoomOut());

  const zoomBtnContainer = document.createElement('div');
  zoomBtnContainer.style.display = 'flex';
  zoomBtnContainer.style.flexDirection = 'column';
  zoomBtnContainer.style.alignItems = 'center';
  zoomBtnContainer.style.gap = '8px';

  zoomBtnContainer.appendChild(zoomInBtn);
  zoomBtnContainer.appendChild(zoomOutBtn);

  secondaryDiv.appendChild(zoomBtnContainer);
}


window.addEventListener('DOMContentLoaded', () => {
  setupZoomControls();
  setupCurrentLocationButton();
});

map.on('zoomend', function() {
    const zoom = map.getZoom();
    window.allCustomMarkers.forEach(marker => {
        if (zoom <= 7) {
            // Show as small dot
            marker.setIcon(L.divIcon({
                className: 'small-dot-marker',
                iconSize: [10, 10],
                iconAnchor: [5, 5]
            }));
        } else {
            // Restore original icon
            if (marker._originalIcon) {
                marker.setIcon(marker._originalIcon);
            }
        }
    });
});

function setupCurrentLocationButton() {
  const secondaryDiv = document.getElementById('overlay-zoom');
  if (!secondaryDiv) return;

  let userLocationMarker = null;
  const locateBtn = createStyledButton('Show my location', 'my_location', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    locateBtn.disabled = true;
    locateBtn.style.opacity = 0.6;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Remove previous location marker if it exists
        if (userLocationMarker) {
          map.removeLayer(userLocationMarker);
        }
        userLocationMarker = L.marker([latitude, longitude], {
          title: "Your location",
          icon: L.icon({
            iconUrl: "/attachments/misc_icons/pin_my_location.svg",
            iconSize: [36, 36],
            iconAnchor: [18, 36]
          })
        }).addTo(map);
        map.setView([latitude, longitude], 16);
        locateBtn.disabled = false;
        locateBtn.style.opacity = 1;
      },
      (err) => {
        alert('Unable to retrieve your location.');
        locateBtn.disabled = false;
        locateBtn.style.opacity = 1;
      }
    );
  });

  // Add the button below the zoom controls
  let zoomBtnContainer = secondaryDiv.querySelector('.zoom-btn-container');
  if (!zoomBtnContainer) {
    zoomBtnContainer = document.createElement('div');
    zoomBtnContainer.className = 'zoom-btn-container';
    zoomBtnContainer.style.display = 'flex';
    zoomBtnContainer.style.flexDirection = 'column';
    zoomBtnContainer.style.alignItems = 'center';
    zoomBtnContainer.style.gap = '8px';
    secondaryDiv.appendChild(zoomBtnContainer);
  }
  zoomBtnContainer.appendChild(locateBtn);
}