import json
from shapely.geometry import shape, mapping, LineString, MultiLineString
from shapely import speedups

if speedups.available:
    speedups.enable()

SIMPLIFY_TOLERANCE = 0.0005  # Adjust as needed (~50m)

with open("routes.geojson", "r", encoding="utf-8") as f:
    data = json.load(f)

color_map = {
    "icn": "#ff00ff",
    "ncn": "#aa00ff",
    "rcn": "#5500ff",
    "lcn": "#0000ff",
    "mcn": "#d15000",
    "Alabak": "#000000",
    "alabak": "#000000",
    "mtb": "#d15000",
}

styled_features = []

for feature in data.get("features", []):
    geometry = feature.get("geometry", {})
    if geometry.get("type") == "Point":
        continue  # Skip points

    props = feature.setdefault("properties", {})
    name = props.get("name", "")
    # Exclude routes with "велоалея" in name (case-insensitive)
    if "велоалея" in name.lower():
        continue

    geom = shape(geometry)
    simplified = geom.simplify(SIMPLIFY_TOLERANCE, preserve_topology=False)

    if simplified.is_empty or not isinstance(simplified, (LineString, MultiLineString)):
        continue

    network = props.get("network")
    route = props.get("route")

    stroke_color = color_map.get(network)
    if route == "mtb":
        stroke_color = color_map["mtb"]

    if stroke_color:
        props["stroke"] = stroke_color
        props["stroke-width"] = 4
        props["stroke-opacity"] = 0.5

    styled_features.append({
        "type": "Feature",
        "properties": props,
        "geometry": mapping(simplified),
    })

output_geojson = {
    "type": "FeatureCollection",
    "features": styled_features,
}

with open("routes_styled_simplified_filtered.geojson", "w", encoding="utf-8") as f:
    json.dump(output_geojson, f, ensure_ascii=False, indent=2)
