"use client";

import { forwardRef } from "react";

import { flyerConfig } from "@/config/flyer";

type FlyerCanvasProps = {
  isAdjustingPhoto: boolean;
  onPointerDown?: React.PointerEventHandler<HTMLCanvasElement>;
  onPointerMove?: React.PointerEventHandler<HTMLCanvasElement>;
  onPointerUp?: React.PointerEventHandler<HTMLCanvasElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLCanvasElement>;
};

export const FlyerCanvas = forwardRef<
  HTMLCanvasElement,
  FlyerCanvasProps
>(function FlyerCanvas(
  {
    isAdjustingPhoto,
    ...pointerHandlers
  },
  ref,
) {
  return (
    <canvas
      ref={ref}
      width={flyerConfig.canvasWidth}
      height={flyerConfig.canvasHeight}
      className={[
        "block h-auto w-full max-w-[520px] rounded-2xl shadow-2xl ring-1 ring-white/15",
        isAdjustingPhoto
          ? "cursor-grab touch-none active:cursor-grabbing"
          : "touch-pan-y",
      ].join(" ")}
      aria-label="Personalised DWELL 2026 flyer preview"
      aria-description={
        isAdjustingPhoto
          ? "Photo adjustment is enabled. Drag to reposition the photo."
          : "Photo adjustment is disabled. Swipe vertically to scroll the page."
      }
      {...pointerHandlers}
    />
  );
});
