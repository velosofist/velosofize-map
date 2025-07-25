const services = [
  {
    name: "Moovit",
    icon: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://moovitapp.com/",
    getUrl: (from, to) =>
      `https://moovitapp.com/tripplan/sofia_%D1%81%D0%BE%D1%84%D0%B8%D1%8F-3501/en?ref=12&lang=en&fll=${from.lat}_${from.lng}&tll=${to.lat}_${to.lng}`
  },
  {
    name: "Google Maps",
    icon: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://maps.google.com",
    getUrl: (from, to) =>
      `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=walking`
  },
  {
    name: "OpenRouteService",
    icon: "https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://cyclosm.org/",
    getUrl: (from, to) =>
      `https://maps.openrouteservice.org/directions?n1=${from.lat}&n2=${from.lng}&n3=14&a=${from.lat},${from.lng},${to.lat},${to.lng}&b=1&c=0&k1=en-US&k2=km`
  }
];

let directionReversed = false;
const markers = [];
let line = null;
let popup = null;

// Build navigation links
const getMarkerLatLngs = () => {
  if (markers.length !== 2) return null;
  return [markers[0].getLatLng(), markers[1].getLatLng()];
};

const buildServiceLinks = () => {
  const latlngs = getMarkerLatLngs();
  if (!latlngs) return '<div>No route available</div>';

  const [from, to] = directionReversed ? [latlngs[1], latlngs[0]] : latlngs;

  return services.map(service => `
    <a href="${service.getUrl(from, to)}" target="_blank" class="nav-link" style="display:flex; align-items:center; gap:6px; text-decoration:none; color:black; margin:6px 0;">
      <img src="${service.icon}" style="width:16px;" alt=""> ${service.name}
    </a>
  `).join('');
};

function generateNavPopupHtml() {
  return `
    <div style="text-align: left;">
      <div id="nav-links">
        ${buildServiceLinks()}
      </div>
    </div>
  `;
}

// Marker logic
function addLabeledMarker(latlng) {
  if (markers.length >= 2) return;

  const label = markers.length === 0 ? 'A' : 'B';

  const marker = L.marker(latlng, {
    draggable: true,
    title: label,
    icon: L.icon({
      iconUrl: "attachments/misc_icons/pin_navigation.svg",
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    })
  }).addTo(map);

  marker.bindTooltip(label, {
    permanent: true,
    direction: 'right',
    offset: [0, -32],
    className: 'marker-label-tooltip'
  }).openTooltip();

  marker.on('click', () => {
    map.removeLayer(marker);
    const index = markers.indexOf(marker);
    if (index !== -1) {
      markers.splice(index, 1);
      updateLabels();
      updateNavConnectingLine();
    }
  });

  marker.on('drag', updateNavConnectingLine);

  markers.push(marker);
  updateNavConnectingLine();
}

function updateLabels() {
  markers.forEach((marker, idx) => {
    const newLabel = idx === 0 ? 'A' : 'B';
    marker.setTooltipContent(newLabel);
  });
}

function updateNavConnectingLine() {
  if (line) map.removeLayer(line);
  if (popup) map.removeLayer(popup);

  if (markers.length === 2) {
    const latlngs = [markers[0].getLatLng(), markers[1].getLatLng()];
    line = L.polyline(latlngs, { color: 'blue', weight: 3, dashArray: '5, 10' }).addTo(map);

    const midLat = (latlngs[0].lat + latlngs[1].lat) / 2;
    const midLng = (latlngs[0].lng + latlngs[1].lng) / 2;
    const midpoint = L.latLng(midLat, midLng);

    popup = L.popup({ closeButton: false, autoClose: false })
      .setLatLng(midpoint)
      .setContent(generateNavPopupHtml())
      .addTo(map);
  }
}