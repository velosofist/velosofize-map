window.allCustomMarkers = window.allCustomMarkers || [];

fetch('/src/overlays.json')
.then(response => response.json())
.then(data => {
    const allOverlays = [
        ...data.primary.map(layer => ({...layer, isPrimary: true})),
        ...data.secondary.map(layer => ({...layer, isPrimary: false}))
    ];
    const overlayToggleDiv = document.getElementById('overlay-toggle-secondary');
    const overlayLayers = {};

    allOverlays.forEach(({url, label, icon, disabled, isPrimary}) => {
        const overlay = createStyledOverlay(url);
        overlayLayers[url] = overlay;

        if (!disabled) {
            const btn = document.createElement('button');
            btn.title = label;
            btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 28px;">${icon}</span>`;
            btn.style.padding = '4px 4px';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.border = "2px solid rgba(0, 0, 0, 0.4)";
            btn.style.background = isPrimary ? '#86C68090' : '#eee8d5';
            btn.style.color = isPrimary ? '#fff' : 'rgba(0, 0, 0, 0.8)';
            btn.style.borderRadius = '50%';
            btn.dataset.active = isPrimary ? 'true' : 'false';

            if (isPrimary) {
                overlay.addTo(map); // Add primary overlays by default
            }

            btn.onclick = function() {
                if (btn.dataset.active === 'false') {
                    overlay.addTo(map);
                    btn.style.background = '#86C68090';
                    btn.style.color = '#fff';
                    btn.dataset.active = 'true';
                } else {
                    map.removeLayer(overlay);
                    btn.style.background = '#eee8d5';
                    btn.style.color = '#08103b';
                    btn.dataset.active = 'false';
                }
            };

            overlayToggleDiv.appendChild(btn);
        }
    });

    const externalOverlays = data.external;
    const externalToggleDiv = document.getElementById('overlay-toggle-external');
    const externalOverlayLayers = {};

    externalOverlays.forEach(({url, label, icon, disabled}) => {
    const overlay = createStyledOverlay(url);
    externalOverlayLayers[url] = overlay;

    if (!disabled) {
        const btn = document.createElement('button');
        btn.title = label;
        btn.style.padding = '4px 4px';
        btn.style.fontSize = '14px';
        btn.style.cursor = 'pointer';
        btn.style.border = "2px solid rgba(0, 0, 0, 0.4)";
        btn.style.background = '#eee8d5';
        btn.style.color = '#08103b';
        btn.style.borderRadius = '50%';
        btn.dataset.active = 'false';

        if (typeof icon === 'string' && icon.startsWith('http')) {
            if (icon.toLowerCase().endsWith('.svg')) {
                // Fetch and embed the SVG
                fetch(icon)
                    .then(res => res.text())
                    .then(svg => {
                        btn.innerHTML = `<span style="display:inline-block;width:28px;height:28px;vertical-align:middle;">${svg}</span>`;
                    })
                    .catch(() => {
                        btn.innerHTML = `<span style="font-size: 28px;">❓</span>`;
                    });
            } else if (icon.toLowerCase().endsWith('.png')) {
                btn.innerHTML = `<img src="${icon}" alt="" style="width:28px;height:28px;vertical-align:middle;">`;
            } else {
                // Unknown image type, fallback
                btn.innerHTML = `<img src="${icon}" alt="" style="width:28px;height:28px;vertical-align:middle;">`;
            }
        } else {
            // Fallback to Material Symbols if not a URL
            btn.innerHTML = `<span class="material-symbols-outlined" style="font-size: 28px;">${icon}</span>`;
        }

        btn.onclick = function() {
            if (btn.dataset.active === 'false') {
                overlay.addTo(map);
                btn.style.background = '#86C68090';
                btn.style.color = '#fff';
                btn.dataset.active = 'true';
            } else {
                map.removeLayer(overlay);
                btn.style.background = '#eee8d5';
                btn.style.color = '#08103b';
                btn.dataset.active = 'false';
            }
        };

        externalToggleDiv.appendChild(btn);
    }
    });
});

function styleFromStyleUrl(styleUrl, featureWeight) {
const match = styleUrl?.match(/#line-([0-9A-Fa-f]{6})/);
if (match) {
    return {
    color: `#${match[1]}`,
    weight: featureWeight,
    opacity: 1
    };
} else {
    return {
    color: "#0074D9", // grey by default
    weight: featureWeight,
    opacity: 0.8
    };
}
}

function colorFromStyleUrl(styleUrl) {
    const match = styleUrl?.match(/#(?:icon-\d+-)?([0-9A-Fa-f]{6})/);
    return match ? `#${match[1]}` : "#CCCCCC";
}

function pointToLayer(feature, latlng) {
    const styleUrl = feature.properties?.styleUrl;
    const fillColor = colorFromStyleUrl(styleUrl);

    // Extract the relevant style (ignoring everything after the second '-')
    const relevantStyle = styleUrl?.split('-')[1]?.split('-')[0];

    // Default to 'question_mark' if no match is found
    const iconName = iconMapping[relevantStyle] || 'question_mark';

    // Create a combined divIcon with both the circle and the Material Symbols icon
    const iconSizePx = 24;
    const combinedIconHtml = `
        <div style="position: relative; width: 12px; height: 12px;">
            <div style="
                width: 22px; 
                height: 22px; 
                border-radius: 50%; 
                background-color: ${fillColor}; 
                opacity: 0.8; 
                border: 1px 
                solid white;
            "></div>
            <span class="material-symbols-outlined" style="position: absolute; top: 4px; left: 4px; font-size: 16px; color: #e6e5e1;">${iconName}</span>
        </div>
    `;

    const combinedDivIcon = L.divIcon({
        className: 'custom-combined-icon',
        html: combinedIconHtml,
        iconSize: [iconSizePx, iconSizePx],
        iconAnchor: [iconSizePx / 2, iconSizePx / 2]
    });

    // Create a small colored dot icon for zoomed-out view
    const smallDotIcon = `
        <div style="position: relative; width: 12px; height: 12px;">
            <div style="
                width: 6px; 
                height: 6px; 
                border-radius: 50%; 
                background-color: #000000; 
                opacity: 0.8; 
                border: 1px 
                solid white;
            "></div>
        </div>
    `;

    const smallDivDotIcon = L.divIcon({
        className: 'custom-combined-icon',
        html: smallDotIcon,
        iconSize: [iconSizePx/2, iconSizePx/2],
        iconAnchor: [iconSizePx / 4, iconSizePx / 4]
    });

    // Create a marker with the combined icon
    const marker = L.marker(latlng, { icon: combinedDivIcon });

    // Store both icons for zoom-based style switching
    marker._originalIcon = combinedDivIcon;
    marker._smallDotIcon = smallDivDotIcon;

    // Add to global array for zoom-based style switching
    window.allCustomMarkers = window.allCustomMarkers || [];
    window.allCustomMarkers.push(marker);

    return marker;
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

        return styleFromStyleUrl(styleUrl, featureWeight);
        },
        pointToLayer: pointToLayer,
        onEachFeature: interactivePoints
    }));
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

const pointPopupHtml = (name, description) => {
    const links = extractLinks(description || '');
    let safeDescription = escapeHtml(description || '');
    safeDescription = safeDescription.replace(/(https?:\/\/[^\s"<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">Link</a>');
    let buttonsHtml = '';
    if (links.length > 0) {
        buttonsHtml = `
            <div style="display: flex; gap: 8px; margin-top: 8px; justify-content: center;">
                ${links.map((link, i) => `
                    <button onclick="window.open('${link}', '_blank')" style="
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        border: none;
                        background: #e6e5e1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.08);
                    " title="Open link ${i+1}">
                        <span class="material-symbols-outlined" style="font-size: 20px; color: #444;">link</span>
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

function extractLinks(text) {
    return [...(text.matchAll(/https?:\/\/[^\s"<]+/g))].map(match => match[0]);
}

function interactivePoints(feature, layer) {
    if (feature.geometry?.type === 'Point' || 'Polygon') {
        const name = feature.properties?.name || '';
        const description = feature.properties?.description || '';
        if (name && description) {
            layer.bindPopup(pointPopupHtml(name, description));
        } else if (name) {
            layer.bindPopup(`<strong>${name}</strong>`);
        }
    }
}