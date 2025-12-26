// Viridis color scale - colorblind-friendly
// Colors from matplotlib's viridis colormap

type RGBA = [number, number, number, number];

// Viridis color stops (0 to 1) - 9 key points
const VIRIDIS_COLORS: [number, number, number][] = [
  [68, 1, 84],      // 0.0 - dark purple
  [72, 40, 120],    // 0.125
  [62, 74, 137],    // 0.25
  [49, 104, 142],   // 0.375
  [38, 130, 142],   // 0.5 - teal
  [31, 158, 137],   // 0.625
  [53, 183, 121],   // 0.75
  [109, 205, 89],   // 0.875
  [253, 231, 37],   // 1.0 - yellow
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function interpolateViridis(t: number): [number, number, number] {
  // Clamp t to [0, 1]
  t = Math.max(0, Math.min(1, t));

  // Find the two colors to interpolate between
  const scaledT = t * (VIRIDIS_COLORS.length - 1);
  const lowerIndex = Math.floor(scaledT);
  const upperIndex = Math.min(lowerIndex + 1, VIRIDIS_COLORS.length - 1);
  const localT = scaledT - lowerIndex;

  const lower = VIRIDIS_COLORS[lowerIndex];
  const upper = VIRIDIS_COLORS[upperIndex];

  return [
    Math.round(lerp(lower[0], upper[0], localT)),
    Math.round(lerp(lower[1], upper[1], localT)),
    Math.round(lerp(lower[2], upper[2], localT)),
  ];
}

// Color for buildings with no height data
const NO_HEIGHT_COLOR: RGBA = [128, 128, 128, 150];

// Height range for normalization
const MAX_HEIGHT = 100;

export function getColorForHeight(height: number | null | undefined): RGBA {
  if (height === null || height === undefined || height <= 0) {
    return NO_HEIGHT_COLOR;
  }

  // Normalize height to [0, 1] range
  const normalizedHeight = Math.min(height, MAX_HEIGHT) / MAX_HEIGHT;

  // Get RGB from Viridis scale
  const [r, g, b] = interpolateViridis(normalizedHeight);

  // Alpha based on height - taller buildings slightly more opaque
  const alpha = Math.round(lerp(180, 220, normalizedHeight));

  return [r, g, b, alpha];
}

export { VIRIDIS_COLORS, NO_HEIGHT_COLOR, MAX_HEIGHT };
