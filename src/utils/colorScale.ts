// Color scales for building visualization
// Viridis and Plasma from matplotlib - colorblind-friendly

type RGBA = [number, number, number, number];
type RGB = [number, number, number];

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

// Generate CSS gradient string for legend
export function getViridisGradientCSS(): string {
  const stops = VIRIDIS_COLORS.map((color, index) => {
    const percent = (index / (VIRIDIS_COLORS.length - 1)) * 100;
    return `rgb(${color[0]}, ${color[1]}, ${color[2]}) ${percent.toFixed(1)}%`;
  });
  return `linear-gradient(to top, ${stops.join(', ')})`;
}

// Get CSS color string for "no data" indicator
export function getNoDataColorCSS(): string {
  return `rgba(${NO_HEIGHT_COLOR[0]}, ${NO_HEIGHT_COLOR[1]}, ${NO_HEIGHT_COLOR[2]}, ${NO_HEIGHT_COLOR[3] / 255})`;
}

// Get color for a specific height as CSS string
export function getColorForHeightCSS(height: number): string {
  const [r, g, b] = interpolateViridis(Math.min(height, MAX_HEIGHT) / MAX_HEIGHT);
  return `rgb(${r}, ${g}, ${b})`;
}

export { VIRIDIS_COLORS, NO_HEIGHT_COLOR, MAX_HEIGHT };

// ============================================
// Plasma colormap for variance (confidence)
// ============================================

const PLASMA_COLORS: RGB[] = [
  [13, 8, 135],     // 0.0 - deep blue
  [84, 2, 163],     // 0.125
  [139, 10, 165],   // 0.25
  [185, 50, 137],   // 0.375
  [219, 92, 104],   // 0.5
  [244, 136, 73],   // 0.625
  [254, 188, 43],   // 0.75
  [240, 249, 33],   // 1.0 - bright yellow
];

const MAX_VARIANCE = 10; // meters - typical range for height variance

function interpolatePlasma(t: number): RGB {
  t = Math.max(0, Math.min(1, t));
  const scaledT = t * (PLASMA_COLORS.length - 1);
  const lowerIndex = Math.floor(scaledT);
  const upperIndex = Math.min(lowerIndex + 1, PLASMA_COLORS.length - 1);
  const localT = scaledT - lowerIndex;
  const lower = PLASMA_COLORS[lowerIndex];
  const upper = PLASMA_COLORS[upperIndex];
  return [
    Math.round(lerp(lower[0], upper[0], localT)),
    Math.round(lerp(lower[1], upper[1], localT)),
    Math.round(lerp(lower[2], upper[2], localT)),
  ];
}

export function getColorForVariance(variance: number | null | undefined): RGBA {
  if (variance === null || variance === undefined) {
    return NO_HEIGHT_COLOR;
  }
  // Lower variance = more confident = blue end
  // Higher variance = less confident = yellow end
  const normalizedVariance = Math.min(variance, MAX_VARIANCE) / MAX_VARIANCE;
  const [r, g, b] = interpolatePlasma(normalizedVariance);
  const alpha = Math.round(lerp(180, 220, normalizedVariance));
  return [r, g, b, alpha];
}

export function getPlasmaGradientCSS(): string {
  const stops = PLASMA_COLORS.map((color, index) => {
    const percent = (index / (PLASMA_COLORS.length - 1)) * 100;
    return `rgb(${color[0]}, ${color[1]}, ${color[2]}) ${percent.toFixed(1)}%`;
  });
  return `linear-gradient(to top, ${stops.join(', ')})`;
}

export { MAX_VARIANCE };

// ============================================
// Categorical palette for data sources
// ============================================

const CATEGORICAL_PALETTE: RGB[] = [
  [31, 119, 180],   // blue
  [255, 127, 14],   // orange
  [44, 160, 44],    // green
  [214, 39, 40],    // red
  [148, 103, 189],  // purple
  [140, 86, 75],    // brown
  [227, 119, 194],  // pink
  [127, 127, 127],  // gray
  [188, 189, 34],   // olive
  [23, 190, 207],   // cyan
  [255, 187, 120],  // light orange
  [152, 223, 138],  // light green
];

const SOURCE_COLORS: Record<string, RGB> = {};
let sourceColorIndex = 0;

function getSourceColor(source: string): RGB {
  if (!SOURCE_COLORS[source]) {
    SOURCE_COLORS[source] = CATEGORICAL_PALETTE[sourceColorIndex % CATEGORICAL_PALETTE.length];
    sourceColorIndex++;
  }
  return SOURCE_COLORS[source];
}

export function resetSourceColors(): void {
  Object.keys(SOURCE_COLORS).forEach(key => delete SOURCE_COLORS[key]);
  sourceColorIndex = 0;
}

export function getSourceColorMap(): Map<string, RGB> {
  return new Map(Object.entries(SOURCE_COLORS));
}

export function getColorForSource(source: string | null | undefined): RGBA {
  if (!source) {
    return NO_HEIGHT_COLOR;
  }
  const [r, g, b] = getSourceColor(source);
  return [r, g, b, 200];
}

// ============================================
// Area-based coloring (footprint size)
// ============================================

const MIN_AREA = 20;    // sq meters - small building
const MAX_AREA = 2000;  // sq meters - large building

export function getColorForArea(area: number | null | undefined): RGBA {
  if (area === null || area === undefined || area <= 0) {
    return NO_HEIGHT_COLOR;
  }
  // Log scale for area (buildings vary widely in size)
  const logMin = Math.log(MIN_AREA);
  const logMax = Math.log(MAX_AREA);
  const clampedArea = Math.max(MIN_AREA, Math.min(area, MAX_AREA));
  const logArea = Math.log(clampedArea);
  const normalizedArea = (logArea - logMin) / (logMax - logMin);
  const [r, g, b] = interpolateViridis(normalizedArea);
  const alpha = Math.round(lerp(180, 220, normalizedArea));
  return [r, g, b, alpha];
}

export { MIN_AREA, MAX_AREA };
