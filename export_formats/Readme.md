# Easy exports of KML and GeoJson files:

## Acquire automatic download link:

Choose a layer -> Layer options -> KML/KMZ.

<img src="../attachments/network_link_kml.png" alt="Alt Text" width="500">

Keep a KML with a network link.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Маршрути</name>
    <NetworkLink>
      <name>VELOSOFIZE</name>
      <Link>
      </Link>
    </NetworkLink>
  </Document>
</kml>
```

```bash
git clone https://github.com/mapbox/togeojson.git
# Pipe togeojson conversion output into a geojson file
togeojson verbose.kml > velosofize_export.geojson
```
