# Method for easy exports of kml and geojson files:

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
        <href><![CDATA[https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=13Ke06MOSLTuBBbr2ITKNV7kLhs_v2Qc&lid=3wjSl8o1dLc]]></href>
      </Link>
    </NetworkLink>
  </Document>
</kml>
```

| | |
|:--|:--|
| Routes: | 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=13Ke06MOSLTuBBbr2ITKNV7kLhs_v2Qc&lid=3wjSl8o1dLc'| 
| Crossings: | 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=13Ke06MOSLTuBBbr2ITKNV7kLhs_v2Qc&lid=bB78iE4m2io'| 
| Others | 'https://www.google.com/maps/d/u/0/kml?forcekml=1&mid=13Ke06MOSLTuBBbr2ITKNV7kLhs_v2Qc&lid=ToS2rNd9rNc'| 

```bash
git clone https://github.com/mapbox/togeojson.git
# Pipe togeojson conversion output into a geojson file
togeojson verbose.kml > velosofize_export.geojson
```
