import { flyerConfig } from "@/config/flyer";
import {
  drawCoverImage,
  type CropState,
  type ImageSize,
} from "@/lib/image";

export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.arcTo(x + width, y, x + width, y + height, safeRadius);
  ctx.arcTo(x + width, y + height, x, y + height, safeRadius);
  ctx.arcTo(x, y + height, x, y, safeRadius);
  ctx.arcTo(x, y, x + width, y, safeRadius);
  ctx.closePath();
}

export function resolveCanvasFontFamily(): string {
  if (typeof window === "undefined") {
    return flyerConfig.name.fallbackFontFamily;
  }

  const styles = window.getComputedStyle(document.body);
  const loadedFamily = styles
    .getPropertyValue(flyerConfig.name.fontFamilyVariable)
    .trim();

  return loadedFamily || flyerConfig.name.fallbackFontFamily;
}

export function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: {
    fontFamily: string;
    fontWeight: string;
    preferred: number;
    minimum: number;
    maxWidth: number;
  },
) {
  let fontSize = options.preferred;
  let displayText = text;

  const createFont = (size: number) =>
    `${options.fontWeight} ${size}px ${options.fontFamily}`;

  while (fontSize > options.minimum) {
    ctx.font = createFont(fontSize);

    if (ctx.measureText(displayText).width <= options.maxWidth) {
      return {
        fontSize,
        text: displayText,
      };
    }

    fontSize -= 2;
  }

  ctx.font = createFont(options.minimum);

  while (
    displayText.length > 1 &&
    ctx.measureText(`${displayText}…`).width > options.maxWidth
  ) {
    displayText = displayText.slice(0, -1);
  }

  return {
    fontSize: options.minimum,
    text: `${displayText.trim()}…`,
  };
}

export function renderFlyer(
  ctx: CanvasRenderingContext2D,
  artwork: CanvasImageSource,
  photo?: CanvasImageSource & ImageSize,
  state?: CropState,
  name?: string,
) {
  const config = flyerConfig;

  ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
  ctx.drawImage(
    artwork,
    0,
    0,
    config.canvasWidth,
    config.canvasHeight,
  );

  if (photo && state) {
    ctx.save();

    roundedRect(
      ctx,
      config.photoFrame.x,
      config.photoFrame.y,
      config.photoFrame.width,
      config.photoFrame.height,
      config.photoFrame.cornerRadius,
    );

    ctx.clip();
    drawCoverImage(ctx, photo, config.photoFrame, state);
    ctx.restore();
  }

  if (name) {
    const fontFamily = resolveCanvasFontFamily();
    const displayName = config.name.uppercase
      ? name.toUpperCase()
      : name;

    const fitted = fitText(ctx, displayName, {
      fontFamily,
      fontWeight: config.name.fontWeight,
      preferred: config.name.preferredFontSize,
      minimum: config.name.minimumFontSize,
      maxWidth: config.name.maxWidth,
    });

    ctx.save();

    ctx.textAlign = config.name.textAlign;
    ctx.textBaseline = "middle";
    ctx.font =
      `${config.name.fontWeight} ${fitted.fontSize}px ${fontFamily}`;

    ctx.fillStyle = config.name.colour;
    ctx.fillText(
      fitted.text,
      config.name.x,
      config.name.y,
      config.name.maxWidth,
    );

    ctx.restore();
  }
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
        return;
      }

      reject(new Error("Canvas export failed"));
    }, "image/png");
  });
}