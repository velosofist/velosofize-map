function createStyledButton(label, icon, onClick) {
  const btn = document.createElement('button');
  btn.title = label;
  btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 24px;">${icon}</span>`;
  btn.style.padding = '6px 6px';
  btn.style.fontSize = '12px';
  btn.style.cursor = 'pointer';
  btn.style.border = "2px solid rgba(0, 0, 0, 0.4)";
  btn.style.background = '#eee8d5';
  btn.style.color = '#08103b';
  btn.style.borderRadius = '50%';
  btn.dataset.active = 'false';
  btn.onclick = onClick;
  return btn;
}
const controlButtonsContainer = document.querySelector('#container-control-buttons .button-container-pod');

function addZoomControls() {
  if (!controlButtonsContainer) return;

  const zoomInBtn = createStyledButton('Zoom in', 'add', () => map.zoomIn());
  const zoomOutBtn = createStyledButton('Zoom out', 'remove', () => map.zoomOut());

  controlButtonsContainer.appendChild(zoomInBtn);
  controlButtonsContainer.appendChild(zoomOutBtn);
}

function addCurrentLocationButton() {
  if (!controlButtonsContainer) return;

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

  controlButtonsContainer.appendChild(locateBtn);
}

function addHideExternalOverlaysButton() {
  const containerExternalOverlaysButtons = document.getElementById('container-overlays-external-buttons');
  const containerPrimaryOverlaysButtons = document.getElementById('container-overlays-buttons');
  if (!containerExternalOverlaysButtons || !containerPrimaryOverlaysButtons || !controlButtonsContainer) return;

  // Add fade effect styles
  [containerExternalOverlaysButtons, containerPrimaryOverlaysButtons].forEach(container => {
    container.style.transition = 'opacity 0.5s ease';
    container.style.opacity = '1';
    container.style.visibility = 'visible';
  });

  // Create the toggle button
  let isHidden = false;
  const toggleBtn = createStyledButton('Hide/show overlays', 'layers_clear', () => {
    isHidden = !isHidden;
    if (isHidden) {
      [containerExternalOverlaysButtons, containerPrimaryOverlaysButtons].forEach(container => {
        container.style.opacity = '0';
        setTimeout(() => {
          container.style.visibility = 'hidden';
        }, 500); // Match the transition duration (0.5s)
      });
      toggleBtn.querySelector('.material-symbols-outlined').textContent = 'layers';
    } else {
      [containerExternalOverlaysButtons, containerPrimaryOverlaysButtons].forEach(container => {
        container.style.visibility = 'visible';
        container.style.opacity = '1';
      });
      toggleBtn.querySelector('.material-symbols-outlined').textContent = 'layers_clear';
    }
  });

  controlButtonsContainer.appendChild(toggleBtn);
}