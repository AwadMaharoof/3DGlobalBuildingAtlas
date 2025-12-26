# 3DGlobalBuildingAtlas

An interactive 3D viewer for the [GlobalBuildingAtlas](https://github.com/zhu-xlab/GlobalBuildingAtlas) dataset from TUM with a few additional features.

## [Live Demo](https://AwadMaharoof.github.io/3DGlobalBuildingAtlas/)

![3D Building View](assets/demo.gif)

## Key Features

- **Multiple Color Modes** - Visualize by height, uncertainty, polygon source (OSM/Google/Microsoft), or footprint area
- **Height Filtering** - Filter buildings by height range with real-time statistics and distribution histogram
- **Building Info Popup** - Hover to see height, source, uncertainty, and other properties
- **Light/Dark Themes** - Toggle between light and dark basemap styles
- **Smart Data Loading** - Efficient bounding-box queries with caching and debouncing

## Quick Start

```bash
npm install
npm run dev
```

## Tech Stack

React + deck.gl + MapLibre GL

## Data Source

Building data is provided by the GlobalBuildingAtlas project via their WFS service. If you use this data, please cite:

> Zhu, X. X., et al. (2025). GlobalBuildingAtlas: an open global and complete dataset of building polygons, heights and LoD1 3D models. *Earth System Science Data*, 17(12), 6647-6668.

- [GlobalBuildingAtlas GitHub](https://github.com/zhu-xlab/GlobalBuildingAtlas)
- [Dataset Download (mediaTUM)](https://mediatum.ub.tum.de/1782307)
