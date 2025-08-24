window.allCustomMarkers = window.allCustomMarkers || [];
const data = overlaysConfig;

const primaryToggleDiv = document.getElementById('overlay-toggle-primary');
const externalToggleDiv = document.getElementById('overlay-toggle-external');

function showOverlayLabelPopup(label, event) {
    // Remove any existing popup
    const existing = document.getElementById('overlay-button-label-popup');
    if (existing) existing.remove();

    const popupDiv = document.createElement('div');
    popupDiv.id = 'overlay-button-label-popup';
    popupDiv.textContent = label;
    popupDiv.style.position = 'fixed';

    // Append the popup to the body first to calculate its dimensions
    document.body.appendChild(popupDiv);

    // Center the popup in the viewport
    const popupWidth = popupDiv.offsetWidth;
    const popupHeight = popupDiv.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    popupDiv.style.left = `${(viewportWidth - popupWidth) / 2}px`;
    popupDiv.style.top = `${(viewportHeight - popupHeight) / 2}px`;
}

function hideOverlayLabelPopup() {
    const existing = document.getElementById('overlay-button-label-popup');
    if (existing) existing.remove();
}

function createOverlayToggleButton({ label, icon, enabledByDefault = false, overlay, containerDiv }) {
    const btn = document.createElement('button');
    btn.classList.add('overlay-toggle-button');
    btn.dataset.active = enabledByDefault ? 'true' : 'false';

    // Default to '?' if the icon is not provided or invalid
    if (!icon || typeof icon !== 'string') {
        icon = '?';
    }

    // Icon logic
    if (icon.endsWith('.svg')) {
    // SVG: fetch and inline
    const iconUrl = icon.startsWith('http') ? icon : `${window.location.origin}${icon}`;
    fetch(iconUrl)
        .then(res => res.text())
        .then(svg => {
            btn.innerHTML = `<span 
                style="display: inline-block;"
                class="overlay-button-svg-or-img-symbol">
                ${svg}</span>`;
        })
        .catch(() => {
            btn.innerHTML = `<span style="font-size: 28px;">❓</span>`;
        });
    } else if (icon.startsWith('http') || icon.startsWith('/')) {
        // Other images: use <img>
        const iconUrl = icon.startsWith('http') ? icon : `${window.location.origin}${icon}`;
        btn.innerHTML = `<img 
            src="${iconUrl}"
            alt="" 
            class="overlay-button-svg-or-img-symbol">`;
    } else {
        // Material Symbol
        btn.innerHTML = `<span 
            class="material-symbols-outlined" 
            style="font-size: 28px;">
            ${icon}
        </span>`;
    }

    // Add/remove overlay logic
    if (enabledByDefault) {
        overlay.addTo(map);
    }
    btn.onclick = function() {
        if (btn.dataset.active === 'false') {
            overlay.addTo(map);
            btn.dataset.active = 'true';
        } else {
            map.removeLayer(overlay);
            btn.dataset.active = 'false';
        }
    };

    btn.addEventListener('mousedown', (e) => showOverlayLabelPopup(label, e));
    btn.addEventListener('mouseup', hideOverlayLabelPopup);
    btn.addEventListener('mouseleave', hideOverlayLabelPopup);
    btn.addEventListener('touchstart', (e) => showOverlayLabelPopup(label, e));
    btn.addEventListener('touchend', hideOverlayLabelPopup);

    containerDiv.appendChild(btn);
}

function createStyledOverlay(url) {
    return omnivore.kml(url, null, L.geoJson(null, {
        style: function(feature) {
            const styleUrl = feature.properties?.styleUrl;

            // Determine weight based on feature type
            let featureWeight;
            if (feature.geometry?.type === 'Point') {
                featureWeight = 1;
            } else if (feature.geometry?.type === 'LineString') {
                featureWeight = 4;
            } else if (feature.geometry?.type === 'Polygon') {
                featureWeight = 3;
            }

            return styleFromGMapsStyleUrl(styleUrl, featureWeight);
        },
        pointToLayer: pointToLayer,
        onEachFeature: interactivePoints
    }));
}

function addCyclosmLiteButton(){
    // Create the CyclOSM Lite layer
    const cyclosmLayer = L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm-lite/{z}/{x}/{y}.png', {
        attribution: '&copy; Cyclosm contributors'
    });

    // Use the shared overlay button logic
    createOverlayToggleButton({
        label: 'Велоалеи от CyclOSM Lite / Bike paths from CyclOSM Lite',
        icon: 'bike_lane',
        enabledByDefault: false,
        overlay: cyclosmLayer,
        containerDiv: primaryToggleDiv
    });
}

function addPrimaryOverlayButtons() {
    const primaryOverlays = data.primary
    const primaryOverlayLayers = {};
    // Add primary overlays
    primaryOverlays.forEach(({url, label, icon, disabled, enabledByDefault}) => {
        if (!disabled) {
            const overlay = createStyledOverlay(url);
            primaryOverlayLayers[url] = overlay;
            createOverlayToggleButton({
                label,
                icon,
                enabledByDefault,
                overlay,
                containerDiv: primaryToggleDiv
            });
        }
    });
}

function addExternalOverlayButtons() {
    // Add external overlays
    const externalOverlays = data.external;
    const externalToggleDiv = document.getElementById('overlay-toggle-external');
    const externalOverlayLayers = {};
    externalOverlays.forEach(({url, label, icon, disabled}) => {
        if (!disabled) {
            const overlay = createStyledOverlay(url);
            externalOverlayLayers[url] = overlay;
            createOverlayToggleButton({
                label,
                icon,
                enabledByDefault: false,
                overlay,
                containerDiv: externalToggleDiv
            });
        }
    });
}

function styleFromGMapsStyleUrl(styleUrl, featureWeight) {
    const match = styleUrl?.match(/#(?:line|poly|icon-\d+)-([0-9A-Fa-f]{6})/);
    
    const style = {};
    style.weight = featureWeight,
    style.opacity = 1,
    style.fillOpacity = 0.2
    
    const defaultColor = "#0074D9";
    const extractedColor = `#${match[1]}`;

    if (match) {
        style.color = extractedColor;
        style.fillColor = extractedColor;
    } else {
        style.color = defaultColor;
        style.fillColor = defaultColor;
    }

    return style;
}

function colorFromGMapsStyleUrl(styleUrl) {
    // Match #line-xxxxxx, #poly-xxxxxx, or #icon-xxxxxx
    const match = styleUrl?.match(/#(?:line|poly|icon-\d+)-([0-9A-Fa-f]{6})/);
    return match ? `#${match[1]}` : "#CCCCCC";
}

function pointToLayer(feature, latlng) {
    const styleUrl = feature.properties?.styleUrl;
    const fillColor = colorFromGMapsStyleUrl(styleUrl);

    // Extract the relevant style (ignoring everything after the second '-')
    const relevantStyle = styleUrl?.split('-')[1]?.split('-')[0];

    // Default to 'question_mark' if no match is found
    const iconName = iconMapping[relevantStyle] || 'question_mark';

    // Create a combined divIcon with both the circle and the Material Symbols icon
    const iconSizePx = 16;
    const combinedIconHtml = `
        <div style="position: relative; width: 12px; height: 12px;">
            <div class="overlay-pin-icon" style="background-color: ${fillColor};"></div>
            <span class="material-symbols-outlined overlay-pin-symbol">${iconName}</span>
        </div>
    `;

    const combinedDivIcon = L.divIcon({
        className: 'custom-combined-icon',
        html: combinedIconHtml,
        iconSize: [iconSizePx, iconSizePx],
        iconAnchor: [iconSizePx / 2, iconSizePx / 2]
    });

    // Create a marker with the combined icon
    const marker = L.marker(latlng, { icon: combinedDivIcon });

    // Add to global array for zoom-based style switching (if needed elsewhere)
    window.allCustomMarkers = window.allCustomMarkers || [];
    window.allCustomMarkers.push(marker);

    return marker;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Helper regex function to extract all URLs from a string
function extractLinks(text) {
    return [...(text.matchAll(/https?:\/\/[^\s"<]+/g))].map(match => match[0]);
}

const overlayPinLinkButtonHtml = (name, description) => {
    const links = extractLinks(description || '');
    let safeDescription = escapeHtml(description || '');
    safeDescription = safeDescription.replace(/(https?:\/\/[^\s"<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">Link</a>');
    let buttonsHtml = '';
    if (links.length > 0) {
        buttonsHtml = `
            <div style="display: flex; gap: 8px; margin-top: 8px; justify-content: center;">
                ${links.map((link, i) => `
                    <button onclick="window.open('${link}', '_blank')" 
                        class="popup-link-button"
                        title="Open link ${i+1}">
                        <span 
                            class="material-symbols-outlined" 
                            style="font-size: 24px; 
                            color: #00000095;">
                            link
                        </span>
                    </button>
                `).join('')}
            </div>
        `;
    }
    return `
        <strong>${escapeHtml(name)}</strong>
        <div>${safeDescription}</div>
        ${buttonsHtml}
    `;
};

function interactivePoints(feature, layer) {
    if (feature.geometry?.type === 'Point' || 'Polygon') {
        const name = feature.properties?.name || '';
        const description = feature.properties?.description || '';
        if (name && description) {
            layer.bindPopup(overlayPinLinkButtonHtml(name, description));
        } else if (name) {
            layer.bindPopup(`<strong>${name}</strong>`);
        }
    }
}
