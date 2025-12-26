import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';

const TMS_URL_TEMPLATE =
  'https://tubvsig-so2sat-vm1.srv.mwn.de/geoserver/gwc/service/tms/1.0.0/global3D:volume_480m@EPSG:900913@png';

export function createVolumeLayer(id: string = 'volume-layer') {
  return new TileLayer({
    id,
    // TMS scheme with Y-flip
    tileSize: 256,
    minZoom: 0,
    maxZoom: 14,

    getTileData: (tile) => {
      const { x, y, z } = tile.index;
      // TMS Y-axis flip: y_tms = 2^z - 1 - y_xyz
      const yFlipped = (1 << z) - 1 - y;
      const url = `${TMS_URL_TEMPLATE}/${z}/${x}/${yFlipped}.png`;

      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load tile: ${url}`));
        img.src = url;
      });
    },

    renderSubLayers: (props) => {
      const { boundingBox } = props.tile;

      return new BitmapLayer(props, {
        data: undefined,
        image: props.data as HTMLImageElement,
        bounds: [
          boundingBox[0][0],
          boundingBox[0][1],
          boundingBox[1][0],
          boundingBox[1][1],
        ],
      });
    },
  });
}
