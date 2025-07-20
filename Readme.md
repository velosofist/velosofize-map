# Velosofize Map

<img width="1740" height="904" alt="image" src="https://github.com/user-attachments/assets/aadeaf70-5795-40bd-aee9-ed9e7eaca223" />

## Introduction

This repository serves as the basis for the website and future web app map.velosofize.com and is planned to be open-sourced in the near future, once an appropriate license is chosen (likely AGPL). It is intended as a free-to-use platform in the long-term which sources data from personal contributions of the project's creator and from Velosofize's users (all accessible in Google Maps and Google Earth as well) and OpenStreetMap data from openmaptiles.

The focus of the project is to gather as much information as possible that Bulgarian cyclists need in their day-to-day, all in one place. It serves also as a catalogue of other projects in this niche. The data should be, as much as possible, accessible through apps that the majority of Bulgarian mobile users are already familiar with, e.g. through browsers, Google Maps and Google Earth and the underlying routes are to be accessible for export so that users can make their own modifications.

The Velosofize project includes resources from other repositories, such as velosofist/velosofize and velosofist/velosofize-minima-theme , which account for the blog section of the website (docs.velosofize.com) and its styling.

While the current code only accounts for a static page hosted on GitHub pages and with hardcoded data in KML and GeoJson format, one of the goals is for it to be expanded in the future so there's a static version (e.g. "Velosofize Lite" on Github Pages) and one with Firebase integration to allow for a more interactive user experience and for creators of other projects, events, resources, etc. to add contributions which are not easily downloadable by users.

## Projects used

The development of Velosofize Map in its current form would not be possible without the generous contributions to other free-to-use and open-source projects, including:

* [OpenStreetMap](https://www.openstreetmap.org/)
* [CyclOSM](https://www.cyclosm.org/)
* [OpenMapTiles](https://openmaptiles.github.io/)
* [OpenFreeMap](https://openfreemap.org/)
* [Leaflet.js](https://leafletjs.com)
* [Maplibre](https://maplibre.org/)
  * [Maputnik](https://maplibre.org/maputnik/)
* [Google My Maps](http://mymaps.google.com/)
* [Google Material Icons](https://fonts.google.com/icons)
* [geojson.io](https://geojson.io)
* [MapBox's togeojson tool](https://github.com/mapbox/togeojson)
* [Черна писта](https://chernapista.com)

and others. Further attributions will be added to NOTICES.md along with respective licenses. Some more attributions to other projects are included throughout https://github.com/velosofist/velosofize/

## Why KML format instead of GeoJson??

Much like JSON is superior to XML in many respects, GeoJson as a format might seem like an obvious choice for the representation of the underlying data used in Velosofize. The reason for the heavy use of KML format (which is closely linked to the development of Google Earth) in this project is simply that it is the default format in Google My Maps, which will likely be used in the future to gather users' suggestions for new routes to be added to the map. I am, however, open to suggestions for a different stack on the users' side to gather suggested routes in GeoJson format.  

## Contributions

In case of interest in contributing, please reach out on GitHub or at <velosofize@gmail.com> .
