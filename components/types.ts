export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  label: string;
  category: "طبيعة" | "فن تجريدي" | "عمارة ومدن" | "تراث وخط";
  aspect: "portrait" | "landscape" | "square";
}

export type FrameMaterial = "wood" | "metal" | "ornate" | "minimal" | "canvas";

export interface FrameStyle {
  id: string;
  label: string;
  labelEn: string;
  material: FrameMaterial;
  badge: string;
  description: string;
  depthMm: number;
  widthMm: number;
  pricePerMeter: number; // in SAR/AED
  frameClassName: string;
  cornerJoinStyle?: "miter45" | "seamless" | "floatBox";
  customStyle?: React.CSSProperties;
  matDefault?: string;
  hasNail?: boolean;
}

export interface MatOption {
  id: string;
  label: string;
  widthPx: number;
  marginMm: number;
  priceExtra: number;
}

export interface MatColor {
  id: string;
  label: string;
  hex: string;
  texture?: string;
}

export interface WallColor {
  id: string;
  label: string;
  hex: string;
  collection: "حيادي فاخر" | "ألوان دافئة" | "ألوان داكنة عميقة" | "ألوان معاصرة";
}

export type WallTexture = "smooth-matte" | "subtle-plaster" | "limewash" | "slatted-wood";

export type RoomSceneId = "modern-living" | "gallery-hall" | "minimalist-studio" | "cozy-corner";

export interface RoomScene {
  id: RoomSceneId;
  label: string;
  description: string;
  hasFurniture: boolean;
  furnitureType: "credenza" | "bench" | "pedestal" | "none";
  floorType: "parquet" | "marble" | "concrete";
  lightingPreset: LightingMoodId;
}

export type LightingMoodId = "spotlight" | "daylight" | "warm-evening" | "neutral-studio";

export interface LightingMood {
  id: LightingMoodId;
  label: string;
  description: string;
}

export type GlassOptionId = "museum" | "standard" | "window" | "anti-glare" | "none";

export interface GlassOption {
  id: GlassOptionId;
  label: string;
  description: string;
  reflectionOpacity: number;
  priceExtra: number;
}

export interface ArtworkSize {
  id: string;
  label: string;
  dimensionsCm: string;
  widthCm: number;
  heightCm: number;
  scaleRatio: number; // relative scaling in preview
  basePrice: number;
}
