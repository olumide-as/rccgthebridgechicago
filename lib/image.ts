export type Frame = { x:number; y:number; width:number; height:number };
export type ImageSize = { width:number; height:number };
export type CropState = { zoom:number; offsetX:number; offsetY:number };
export function coverScale(image: ImageSize, frame: Frame): number { return Math.max(frame.width / image.width, frame.height / image.height); }
export function clamp(value:number, min:number, max:number): number { return Math.min(max, Math.max(min, value)); }
export function clampOffsets(image: ImageSize, frame: Frame, state: CropState): CropState { const scaledWidth = image.width * state.zoom; const scaledHeight = image.height * state.zoom; const maxX = Math.max(0, (scaledWidth - frame.width) / 2); const maxY = Math.max(0, (scaledHeight - frame.height) / 2); return { ...state, offsetX: clamp(state.offsetX, -maxX, maxX), offsetY: clamp(state.offsetY, -maxY, maxY) }; }
export function drawCoverImage(ctx: CanvasRenderingContext2D, image: CanvasImageSource & ImageSize, frame: Frame, state: CropState) { const s = clampOffsets(image, frame, state); const w = image.width * s.zoom; const h = image.height * s.zoom; ctx.drawImage(image, frame.x + (frame.width - w) / 2 + s.offsetX, frame.y + (frame.height - h) / 2 + s.offsetY, w, h); }
