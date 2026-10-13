import {
  GalleryImage,
  FrameStyle,
  MatOption,
  MatColor,
  WallColor,
  RoomScene,
  LightingMood,
  GlassOption,
  ArtworkSize,
} from "./types";

export const CURATED_ARTWORKS: GalleryImage[] = [
  {
    id: "nature-misty-pines",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85",
    alt: "غابة ضبابية ساحرة من أشجار الصنوبر",
    label: "سكون الضباب والغيوم",
    category: "طبيعة",
    aspect: "portrait",
  },
  {
    id: "nature-dolomites",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=85",
    alt: "قمم جبال الألب المهيبة",
    label: "شروق جبال الألب",
    category: "طبيعة",
    aspect: "landscape",
  },
  {
    id: "abstract-gold-indigo",
    src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=85",
    alt: "لوحة فن تجريدي بتموجات لونية دافئة",
    label: "تموجات ذهبية وتجريد",
    category: "فن تجريدي",
    aspect: "portrait",
  },
  {
    id: "abstract-minimal-fluid",
    src: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&q=85",
    alt: "لوحة تجريدية كلاسيكية فاخرة",
    label: "تجريد عضوي هادئ",
    category: "فن تجريدي",
    aspect: "portrait",
  },
  {
    id: "arch-monolith",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=85",
    alt: "تفاصيل عمارة حديثة وظلال هندسية",
    label: "ظلال العمارة الحديثة",
    category: "عمارة ومدن",
    aspect: "landscape",
  },
  {
    id: "arch-night-skyline",
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=85",
    alt: "أفق المدينة ليلاً مع أنوار العاصمة",
    label: "أنوار المدينة والسكينة",
    category: "عمارة ومدن",
    aspect: "landscape",
  },
  {
    id: "heritage-desert-dunes",
    src: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=1200&q=85",
    alt: "كثبان رملية ذهبية وتدرجات الصحراء",
    label: "ذهب الصحراء العربية",
    category: "تراث وخط",
    aspect: "landscape",
  },
  {
    id: "heritage-moroccan-pattern",
    src: "https://images.unsplash.com/photo-1548625361-195fe578b886?w=1200&q=85",
    alt: "زخارف معمارية أندلسية وإسلامية عريقة",
    label: "نقوش هندسية تراثية",
    category: "تراث وخط",
    aspect: "square",
  },
];

export const REALISTIC_FRAMES: FrameStyle[] = [
  {
    id: "vintage-heritage-gold",
    label: "ذهبي",
    labelEn: "Gold",
    material: "ornate",
    badge: "ذهبي",
    description: "إطار ذهبي لامع يمنح العمل الفني فخامة كلاسيكية راقية",
    depthMm: 45,
    widthMm: 36,
    pricePerMeter: 210,
    frameClassName: "frame-heritage-gold",
    cornerJoinStyle: "miter45",
    matDefault: "mat-wide",
    hasNail: true,
  },
  {
    id: "museum-matte-black",
    label: "أسود",
    labelEn: "Black",
    material: "minimal",
    badge: "أسود",
    description: "إطار أسود غير لامع يبرز تباين العمل الفني بأسلوب متحفي أنيق",
    depthMm: 30,
    widthMm: 18,
    pricePerMeter: 95,
    frameClassName: "frame-matte-black",
    cornerJoinStyle: "seamless",
    matDefault: "mat-medium",
    hasNail: true,
  },
  {
    id: "studio-pure-white",
    label: "أبيض",
    labelEn: "White",
    material: "minimal",
    badge: "أبيض",
    description: "إطار أبيض ناصع يتناغم مع الديكور المينيمال والعصري",
    depthMm: 25,
    widthMm: 18,
    pricePerMeter: 85,
    frameClassName: "frame-studio-white",
    cornerJoinStyle: "seamless",
    matDefault: "mat-medium",
    hasNail: true,
  },
  {
    id: "brushed-titanium-silver",
    label: "رمادي",
    labelEn: "Gray",
    material: "metal",
    badge: "رمادي",
    description: "إطار رمادي معدني مصقول يمنح اللوحة لمسة عصرية راقية",
    depthMm: 26,
    widthMm: 16,
    pricePerMeter: 135,
    frameClassName: "frame-brushed-silver",
    cornerJoinStyle: "seamless",
    matDefault: "mat-narrow",
    hasNail: true,
  },
];

export const MAT_OPTIONS: MatOption[] = [
  { id: "mat-none", label: "بدون حاشية (ممتد للحافة)", widthPx: 0, marginMm: 0, priceExtra: 0 },
  { id: "mat-narrow", label: "حاشية ضيقة (2.5 سم)", widthPx: 14, marginMm: 25, priceExtra: 35 },
  { id: "mat-medium", label: "حاشية كلاسيكية (5 سم)", widthPx: 26, marginMm: 50, priceExtra: 55 },
  { id: "mat-wide", label: "حاشية عريضة فاخرة (8 سم)", widthPx: 42, marginMm: 80, priceExtra: 85 },
];

export const MAT_COLORS: MatColor[] = [
  { id: "porcelain-white", label: "أبيض بورسلين", hex: "#FDFDFD" },
  { id: "warm-ivory", label: "عاجي دافئ", hex: "#F5EFE6" },
  { id: "linen-cream", label: "كتان كريمي", hex: "#EAE3D2" },
  { id: "gallery-slate", label: "رمادي حجري", hex: "#D6D5D2" },
  { id: "velvet-charcoal", label: "فحمي مخملي", hex: "#222428" },
];

export const LUXURY_WALL_COLORS: WallColor[] = [
  { id: "warm-alabaster", label: "ألاباستر دافئ", hex: "#F4EFE6", collection: "حيادي فاخر" },
  { id: "bone-white", label: "أوف وايت استوديو", hex: "#EBE6DD", collection: "حيادي فاخر" },
  { id: "greige-nordic", label: "جريج نورديك", hex: "#D8D2C6", collection: "حيادي فاخر" },
  { id: "concrete-mist", label: "رمادي أسمنتي", hex: "#C7C8C5", collection: "حيادي فاخر" },

  { id: "terracotta-warm", label: "طين معتق (Terracotta)", hex: "#B86644", collection: "ألوان دافئة" },
  { id: "warm-camel", label: "جملي مخملي", hex: "#C29562", collection: "ألوان دافئة" },
  { id: "desert-sand", label: "رمال ذهبية", hex: "#D7B58A", collection: "ألوان دافئة" },
  { id: "dusty-blush", label: "وردي معتق", hex: "#BE928D", collection: "ألوان دافئة" },

  { id: "deep-charcoal", label: "فحم حجري داكن", hex: "#26292E", collection: "ألوان داكنة عميقة" },
  { id: "midnight-navy", label: "كحلي ملكي عميق", hex: "#192434", collection: "ألوان داكنة عميقة" },
  { id: "forest-emerald", label: "أخضر زمردي غابات", hex: "#1F3429", collection: "ألوان داكنة عميقة" },
  { id: "matte-obsidian", label: "أوبسيديان أسود", hex: "#131416", collection: "ألوان داكنة عميقة" },

  { id: "sage-green", label: "مريمية هادئة (Sage)", hex: "#7E9484", collection: "ألوان معاصرة" },
  { id: "nordic-blue", label: "سماوي اسكندنافي", hex: "#7D929E", collection: "ألوان معاصرة" },
  { id: "olive-grove", label: "زيتوني معاصر", hex: "#6E7558", collection: "ألوان معاصرة" },
  { id: "mustard-ochre", label: "أوكر خردلي", hex: "#B68B39", collection: "ألوان معاصرة" },
];

export const ARTWORK_SIZES: ArtworkSize[] = [
  { id: "size-s", label: "صغير (مكتبي / زوايا)", dimensionsCm: "30 × 40 سم", widthCm: 30, heightCm: 40, scaleRatio: 0.75, basePrice: 110 },
  { id: "size-m", label: "متوسط (معياري صالات)", dimensionsCm: "50 × 70 سم", widthCm: 50, heightCm: 70, scaleRatio: 1.0, basePrice: 190 },
  { id: "size-l", label: "كبير (فوق الكونسول)", dimensionsCm: "70 × 100 سم", widthCm: 70, heightCm: 100, scaleRatio: 1.25, basePrice: 320 },
  { id: "size-xl", label: "جداري فندقي ضخم", dimensionsCm: "100 × 140 سم", widthCm: 100, heightCm: 140, scaleRatio: 1.5, basePrice: 520 },
];

export const ROOM_SCENES: RoomScene[] = [
  {
    id: "modern-living",
    label: "صالة معيشة فاخرة",
    description: "جدار مع طاولة كونسول خشبية عصرية وتحفة خزفية لمقارنة المقياس الواقعي",
    hasFurniture: true,
    furnitureType: "credenza",
    floorType: "parquet",
    lightingPreset: "daylight",
  },
  {
    id: "gallery-hall",
    label: "قاعة عرض متحفية",
    description: "أجواء صالات العرض الراقية مع مقعد متحفي وأرضية رخامية فخمة",
    hasFurniture: true,
    furnitureType: "bench",
    floorType: "marble",
    lightingPreset: "spotlight",
  },
  {
    id: "minimalist-studio",
    label: "استوديو معماري نقي",
    description: "تركيز نقي على اللوحة وتفاصيل الإطار دون أي عناصر مشتتة",
    hasFurniture: false,
    furnitureType: "none",
    floorType: "concrete",
    lightingPreset: "neutral-studio",
  },
];

export const LIGHTING_MOODS: LightingMood[] = [
  { id: "spotlight", label: "سبوتلايت متحفي مركّز", description: "شعاع إضاءة مركز يبرز ألوان وتفاصيل العمل" },
  { id: "daylight", label: "ضوء النهار الطبيعي", description: "إضاءة ناعمة قادمة من نافذة جانبية" },
  { id: "warm-evening", label: "أمسية دافئة مريحة", description: "أجواء دافئة مريحة مستوحاة من ساعات الغروب" },
  { id: "neutral-studio", label: "إضاءة استوديو متوازنة", description: "إضاءة نقية بدون ظلال قاسية للتقييم الموضوعي" },
];

export const GLASS_OPTIONS: GlassOption[] = [
  {
    id: "museum",
    label: "زجاج متحفي فائق النقاء (Anti-Reflective 99%)",
    description: "يمنع 99% من الوهج والانعكاسات ويحمي من الأشعة فوق البنفسجية",
    reflectionOpacity: 0.08,
    priceExtra: 110,
  },
  {
    id: "window",
    label: "انعكاس زجاجي طبيعي (Realistic Window Reflection)",
    description: "يعكس نافذة الغرفة بأسلوب واقعي يوضح عمق اللوحة في الفضاء",
    reflectionOpacity: 0.4,
    priceExtra: 45,
  },
  {
    id: "standard",
    label: "زجاج استوديو قياسي",
    description: "لمعان كلاسيكي ناعم يحمي اللوحة مع بريق خفيف",
    reflectionOpacity: 0.2,
    priceExtra: 30,
  },
  {
    id: "none",
    label: "بدون زجاج (مظهر الكانفاس الملموس)",
    description: "ملمس القماش أو الورق غير العاكس مباشرة للعين",
    reflectionOpacity: 0,
    priceExtra: 0,
  },
];
