"use client";

type PhotoControlsProps = {
  zoom: number;
  min: number;
  max: number;
  disabled: boolean;
  isAdjusting: boolean;
  onZoom: (value: number) => void;
  onReset: () => void;
  onToggleAdjusting: () => void;
};

export function PhotoControls({
  zoom,
  min,
  max,
  disabled,
  isAdjusting,
  onZoom,
  onReset,
  onToggleAdjusting,
}: PhotoControlsProps) {
  return (
    <fieldset
      className="space-y-4 rounded-2xl border border-white/15 bg-white/5 p-4"
      disabled={disabled}
    >
      <legend className="px-1 text-base font-bold text-white">
        Adjust Your Photo
      </legend>

      <button
        type="button"
        onClick={onToggleAdjusting}
        aria-pressed={isAdjusting}
        className={[
          "w-full rounded-xl px-4 py-3 font-bold transition",
          isAdjusting
            ? "bg-amber-100 text-stone-950"
            : "bg-white/10 text-white hover:bg-white/15",
        ].join(" ")}
      >
        {isAdjusting
          ? "Done adjusting"
          : "Adjust photo position"}
      </button>

      {isAdjusting && (
        <p className="rounded-xl bg-amber-200/10 px-3 py-2 text-sm text-amber-50">
          Drag the photo on the flyer, then tap Done adjusting.
        </p>
      )}

      <div className="space-y-2">
        <label
          className="flex items-center justify-between gap-3 text-sm font-medium text-amber-50"
          htmlFor="zoom"
        >
          <span>Zoom</span>
          <span className="text-amber-200">
            {zoom.toFixed(2)}×
          </span>
        </label>

        <input
          id="zoom"
          type="range"
          min={min}
          max={max}
          step="0.01"
          value={zoom}
          onChange={(event) =>
            onZoom(Number(event.target.value))
          }
          className="w-full accent-amber-300"
        />
      </div>

      <button
        type="button"
        className="w-full rounded-xl bg-white/10 px-4 py-3 font-bold text-white hover:bg-white/15"
        onClick={onReset}
      >
        Reset photo
      </button>
    </fieldset>
  );
}
