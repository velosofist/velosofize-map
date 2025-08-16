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

function setupHideExternalOverlaysButton() {
  const containerExternal = document.getElementById('container-overlays-external-buttons');
  const containerPrimary = document.getElementById('container-overlays-buttons');
  const secondaryDiv = document.getElementById('overlay-zoom');
  if (!containerExternal || !containerPrimary || !secondaryDiv) return;

  // Add fade effect styles
  [containerExternal, containerPrimary].forEach(container => {
    container.style.transition = 'opacity 0.5s ease';
    container.style.opacity = '1';
    container.style.visibility = 'visible';
  });

  // Create the toggle button
  let isHidden = false;
  const toggleBtn = createStyledButton('Hide/show overlays', 'layers_clear', () => {
    isHidden = !isHidden;
    if (isHidden) {
      [containerExternal, containerPrimary].forEach(container => {
        container.style.opacity = '0';
        setTimeout(() => {
          container.style.visibility = 'hidden';
        }, 500); // Match the transition duration (0.5s)
      });
      toggleBtn.querySelector('.material-symbols-outlined').textContent = 'layers';
    } else {
      [containerExternal, containerPrimary].forEach(container => {
        container.style.visibility = 'visible';
        container.style.opacity = '1';
      });
      toggleBtn.querySelector('.material-symbols-outlined').textContent = 'layers_clear';
    }
  });

  // Use the same styling and container as the zoom/location buttons
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

  zoomBtnContainer.insertBefore(toggleBtn, zoomBtnContainer.firstChild);
}