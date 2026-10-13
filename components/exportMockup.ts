import {
  FrameStyle,
  MatOption,
  MatColor,
  ArtworkSize,
  RoomScene,
  GlassOptionId,
} from "./types";

interface ExportMockupParams {
  imageSrc: string | null;
  frame: FrameStyle;
  matOption: MatOption;
  matColor: MatColor;
  artworkSize: ArtworkSize;
  wallColor: string;
  roomScene: RoomScene;
  glassOption: GlassOptionId;
  aspectRatio: "portrait" | "landscape" | "square";
  frameColorOverride?: string;
}

export async function exportWallMockup({
  imageSrc,
  frame,
  matOption,
  matColor,
  artworkSize,
  wallColor,
  roomScene,
  glassOption,
  aspectRatio,
  frameColorOverride,
}: ExportMockupParams): Promise<void> {
  const width = 1600;
  const height = 1200;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // 1. Draw Wall background
  ctx.fillStyle = wallColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Wall Lighting Gradient (Studio / Gallery Spotlight)
  const spotGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.4,
    50,
    width * 0.5,
    height * 0.45,
    width * 0.75
  );
  spotGrad.addColorStop(0, "rgba(255, 250, 240, 0.2)");
  spotGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.08)");
  spotGrad.addColorStop(1, "rgba(0, 0, 0, 0.4)");
  ctx.fillStyle = spotGrad;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw Floor (lower 18% of canvas)
  const floorY = height * 0.82;
  const floorHeight = height * 0.18;

  if (roomScene.floorType === "parquet") {
    ctx.fillStyle = "#8d5b38";
    ctx.fillRect(0, floorY, width, floorHeight);
    // Draw wood planks
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 2;
    for (let x = 0; x < width; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  } else if (roomScene.floorType === "marble") {
    ctx.fillStyle = "#d8dadf";
    ctx.fillRect(0, floorY, width, floorHeight);
  } else {
    ctx.fillStyle = "#3c3f44";
    ctx.fillRect(0, floorY, width, floorHeight);
  }

  // Floor ambient shadow
  const floorShadow = ctx.createLinearGradient(0, floorY, 0, floorY + 40);
  floorShadow.addColorStop(0, "rgba(0, 0, 0, 0.4)");
  floorShadow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = floorShadow;
  ctx.fillRect(0, floorY, width, 40);

  // 4. Skirting board (baseboard)
  ctx.fillStyle = "#f0ede8";
  ctx.fillRect(0, floorY - 32, width, 32);
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, floorY - 32, width, 32);

  // 5. Compute Frame and Artwork Bounds
  let artWidth = 600 * (artworkSize.scaleRatio * 0.9);
  let artHeight = artWidth * 1.35;

  if (aspectRatio === "landscape") {
    artWidth = 720 * (artworkSize.scaleRatio * 0.9);
    artHeight = artWidth * 0.72;
  } else if (aspectRatio === "square") {
    artWidth = 600 * (artworkSize.scaleRatio * 0.9);
    artHeight = artWidth;
  }

  const matMargin = matOption.widthPx > 0 ? (matOption.marginMm / 50) * 45 : 0;
  const frameBorderWidth =
    frame.id === "frameless-gallery-float"
      ? 0
      : frame.id === "royal-walnut"
      ? 36
      : frame.id === "vintage-heritage-gold"
      ? 42
      : 28;

  const totalWidth = artWidth + matMargin * 2 + frameBorderWidth * 2;
  const totalHeight = artHeight + matMargin * 2 + frameBorderWidth * 2;

  const frameX = (width - totalWidth) / 2;
  const frameY = height * 0.22;

  // 6. Draw Frame Wall Cast Shadow
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 45;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 24;
  ctx.fillStyle = "rgba(0,0,0,0.01)";
  ctx.fillRect(frameX, frameY, totalWidth, totalHeight);
  ctx.restore();

  // 7. Draw Frame Moulding
  if (frame.id !== "frameless-gallery-float") {
    // Frame colors — use override first, then fallback by frame id
    if (frameColorOverride) {
      ctx.fillStyle = frameColorOverride;
    } else if (frame.id === "scandinavian-oak") {
      ctx.fillStyle = "#c9a67a";
    } else if (frame.id === "royal-walnut") {
      ctx.fillStyle = "#432918";
    } else if (frame.id === "vintage-heritage-gold") {
      ctx.fillStyle = "#c4962b";
    } else if (frame.id === "brushed-titanium-silver") {
      ctx.fillStyle = "#b8bec7";
    } else if (frame.id === "studio-pure-white") {
      ctx.fillStyle = "#f5f5f3";
    } else {
      ctx.fillStyle = "#18191c"; // matte black
    }

    ctx.fillRect(frameX, frameY, totalWidth, totalHeight);

    // Bevel highlights & shadow inner border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 3;
    ctx.strokeRect(frameX + 2, frameY + 2, totalWidth - 4, totalHeight - 4);

    ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
    ctx.lineWidth = 4;
    ctx.strokeRect(
      frameX + frameBorderWidth - 2,
      frameY + frameBorderWidth - 2,
      totalWidth - (frameBorderWidth * 2 - 4),
      totalHeight - (frameBorderWidth * 2 - 4)
    );
  }

  // 8. Draw Mat Board
  const matX = frameX + frameBorderWidth;
  const matY = frameY + frameBorderWidth;
  const matW = totalWidth - frameBorderWidth * 2;
  const matH = totalHeight - frameBorderWidth * 2;

  if (matOption.widthPx > 0) {
    ctx.fillStyle = matColor.hex;
    ctx.fillRect(matX, matY, matW, matH);

    // Inner mat bevel cut shadow
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      matX + matMargin,
      matY + matMargin,
      artWidth,
      artHeight
    );
  }

  // 9. Draw Artwork Image
  const artX = matX + matMargin;
  const artY = matY + matMargin;

  if (imageSrc) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = imageSrc;
      });

      ctx.drawImage(img, artX, artY, artWidth, artHeight);
    } catch {
      // If cross origin fails, fill artistic placeholder
      ctx.fillStyle = "#2c2e35";
      ctx.fillRect(artX, artY, artWidth, artHeight);
    }
  } else {
    ctx.fillStyle = "#2c2e35";
    ctx.fillRect(artX, artY, artWidth, artHeight);
  }

  // 10. Glass Reflection Effect
  if (glassOption === "window") {
    const glassGrad = ctx.createLinearGradient(artX, artY, artX + artWidth, artY + artHeight);
    glassGrad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
    glassGrad.addColorStop(0.25, "rgba(255, 255, 255, 0.1)");
    glassGrad.addColorStop(0.4, "rgba(255, 255, 255, 0)");
    glassGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.18)");
    glassGrad.addColorStop(0.85, "rgba(255, 255, 255, 0.05)");
    ctx.fillStyle = glassGrad;
    ctx.fillRect(artX, artY, artWidth, artHeight);
  } else if (glassOption === "museum") {
    const glassGrad = ctx.createLinearGradient(artX, artY, artX + artWidth, artY + artHeight);
    glassGrad.addColorStop(0, "rgba(150, 190, 255, 0.08)");
    glassGrad.addColorStop(1, "rgba(220, 180, 255, 0.02)");
    ctx.fillStyle = glassGrad;
    ctx.fillRect(artX, artY, artWidth, artHeight);
  }

  // 11. Luxury Branding Footer Watermark
  ctx.fillStyle = "rgba(10, 12, 16, 0.85)";
  ctx.fillRect(width * 0.04, height - 90, 420, 56);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.strokeRect(width * 0.04, height - 90, 420, 56);

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("BidX Frame Studio", width * 0.04 + 20, height - 58);

  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px sans-serif";
  ctx.fillText(
    `${artworkSize.dimensionsCm} • ${frame.label}`,
    width * 0.04 + 20,
    height - 42
  );

  // Trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `bidx-wall-frame-mockup-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}
