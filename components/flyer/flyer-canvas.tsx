'use client';
import { forwardRef } from 'react';
import { flyerConfig } from '@/config/flyer';
export const FlyerCanvas = forwardRef<HTMLCanvasElement, { onPointerDown?: React.PointerEventHandler<HTMLCanvasElement>; onPointerMove?: React.PointerEventHandler<HTMLCanvasElement>; onPointerUp?: React.PointerEventHandler<HTMLCanvasElement>; onPointerCancel?: React.PointerEventHandler<HTMLCanvasElement> }>(function FlyerCanvas(props, ref) { return <canvas ref={ref} width={flyerConfig.canvasWidth} height={flyerConfig.canvasHeight} className="block h-auto w-full max-w-[520px] rounded-2xl shadow-2xl ring-1 ring-white/15 touch-none" aria-label="Personalised DWELL 2026 flyer preview" {...props} />; });
