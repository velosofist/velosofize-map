
const markers = [];
let line = null;
let popup = null;

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

  // Place the tooltip at the top right of the pin
  marker.bindTooltip(label, {
    permanent: true,
    direction: 'right',
    offset: [0, -32], // right and up from the pin
    className: 'marker-label-tooltip'
  }).openTooltip();

  // Remove marker on click
  marker.on('click', () => {
      map.removeLayer(marker);
      const index = markers.indexOf(marker);
      if (index !== -1) {
        markers.splice(index, 1);
        updateLabels();
        updateNavConnectingLine();
      }
  });

  marker.on('drag', updateNavConnectingLine); // update line if marker moves

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
// Remove existing line and popup
if (line) {
    map.removeLayer(line);
    line = null;
}
if (popup) {
    map.removeLayer(popup);
    popup = null;
}

if (markers.length === 2) {
    const latlngs = [markers[0].getLatLng(), markers[1].getLatLng()];
    line = L.polyline(latlngs, { color: 'blue', weight: 3, dashArray: '5, 10' }).addTo(map);

    const midLat = (latlngs[0].lat + latlngs[1].lat) / 2;
    const midLng = (latlngs[0].lng + latlngs[1].lng) / 2;
    const midpoint = L.latLng(midLat, midLng);

    // const gmapsIcon = 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg';
    const gmapsIcon = 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://maps.google.com';
    const urlGmapsAB = `https://www.google.com/maps/dir/?api=1&origin=${latlngs[0].lat},${latlngs[0].lng}&destination=${latlngs[1].lat},${latlngs[1].lng}&travelmode=walking`;
    const urlGmapsBA = `https://www.google.com/maps/dir/?api=1&origin=${latlngs[1].lat},${latlngs[1].lng}&destination=${latlngs[0].lat},${latlngs[0].lng}&travelmode=walking`;
    
    // const moovitIcon = 'https://play-lh.googleusercontent.com/xsU7mWsfvM6ZFRWi6R3FSukXBRDRaOeKJH-_Y1uPyZvGPM6O2_azLBCh2Ymc4qV4MVg'; 
    const moovitIcon = 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://moovitapp.com/'; 
    const urlMoovitAB = `https://moovitapp.com/tripplan/sofia_%D1%81%D0%BE%D1%84%D0%B8%D1%8F-3501/en?ref=12&lang=en&fll=${latlngs[0].lat}_${latlngs[0].lng}&tll=${latlngs[1].lat}_${latlngs[1].lng}`;
    const urlMoovitBA = `https://moovitapp.com/tripplan/sofia_%D1%81%D0%BE%D1%84%D0%B8%D1%8F-3501/en?ref=12&lang=en&fll=${latlngs[1].lat}_${latlngs[1].lng}&tll=${latlngs[0].lat}_${latlngs[0].lng}`;
    
    const orsIcon = 'https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://cyclosm.org/';
    const urlOrsAB = `https://maps.openrouteservice.org/directions?n1=${latlngs[0].lat}&n2=${latlngs[0].lng}&n3=14&a=${latlngs[0].lat},${latlngs[0].lng},${latlngs[1].lat},${latlngs[1].lng}&b=1&c=0&k1=en-US&k2=km`;
    const urlOrsBA = `https://maps.openrouteservice.org/directions?n1=${latlngs[1].lat}&n2=${latlngs[1].lng}&n3=14&a=${latlngs[1].lat},${latlngs[1].lng},${latlngs[0].lat},${latlngs[0].lng}&b=1&c=0&k1=en-US&k2=km`;

    const navPopupHtml = `
    <div style="text-align:center;">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        <a style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left; font-weight:bold; color:black;">
        Moovit
        </a>
        <a href="${urlMoovitAB}" target="_blank" style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left;">
        <img src="${moovitIcon}" style="width:16px;">
        A → B
        </a>
        <a href="${urlMoovitBA}" target="_blank" style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left;">
        <img src="${moovitIcon}" style="width:16px;">
        B → A
        </a>
        
        <a style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left; font-weight:bold; color:black;">
        OpenRouteService
        </a>
        <a href="${urlOrsAB}" target="_blank" style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left;">
        <img src="${orsIcon}" style="width:16px;">
        A → B
        </a>
        <a href="${urlOrsBA}" target="_blank" style="text-decoration:none; display:flex; align-items:left; gap:6px; margin:4px; justify-content:left;">
        <img src="${orsIcon}" style="width:16px;">
        B → A
        </a>
    </div>
    `;

    popup = L.popup({ closeButton: false, autoClose: false })
    .setLatLng(midpoint)
    .setContent(navPopupHtml)
    .addTo(map);
}
}

map.on('contextmenu', e => addLabeledMarker(e.latlng));