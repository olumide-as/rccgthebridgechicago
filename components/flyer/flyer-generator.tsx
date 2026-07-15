"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { flyerConfig } from "@/config/flyer";
import { canvasToBlob, renderFlyer } from "@/lib/canvas";
import { flyerFilename, normaliseName } from "@/lib/filename";
import {
  clampOffsets,
  coverScale,
  type CropState,
  type ImageSize,
} from "@/lib/image";
import {
  copyText,
  publicPageUrl,
  shareFlyer,
  whatsappUrl,
} from "@/lib/share";

import { FlyerCanvas } from "./flyer-canvas";
import { PhotoControls } from "./photo-controls";

type LoadedImage = HTMLImageElement & ImageSize;

type DragState = {
  pointerId: number;
  clientX: number;
  clientY: number;
  cropState: CropState;
};

export function FlyerGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artworkRef = useRef<LoadedImage | null>(null);
  const photoRef = useRef<LoadedImage | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const dragRef = useRef<DragState | null>(null);

  const generationSequenceRef = useRef(0);

  const [name, setName] = useState("");
  const [cropState, setCropState] = useState<CropState>({
    zoom: 1,
    offsetX: 0,
    offsetY: 0,
  });

  const [minimumZoom, setMinimumZoom] = useState(1);
  const [artworkReady, setArtworkReady] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);

  const [generatedBlob, setGeneratedBlob] =
    useState<Blob | null>(null);

  const [isPreparing, setIsPreparing] = useState(false);
  const [status, setStatus] = useState(
    "Add your name and photo to begin.",
  );
  const [error, setError] = useState("");

  const normalisedName = normaliseName(
    name,
    flyerConfig.maxNameLength,
  );

  const outputFilename = flyerFilename(
    flyerConfig.outputFilenamePrefix,
    normalisedName,
  );

  const canPrepare = Boolean(
    normalisedName &&
      photoReady &&
      artworkReady,
  );

  const flyerReady = Boolean(
    generatedBlob &&
      canPrepare &&
      !isPreparing,
  );

  const drawPreview = useCallback(async () => {
    const canvas = canvasRef.current;
    const artwork = artworkRef.current;

    if (!canvas || !artwork) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      setError(
        "Canvas is not available in this browser.",
      );
      return;
    }

    await document.fonts?.ready;

    renderFlyer(
      context,
      artwork,
      photoRef.current || undefined,
      photoReady ? cropState : undefined,
      normalisedName || undefined,
    );
  }, [
    cropState,
    normalisedName,
    photoReady,
  ]);

  useEffect(() => {
    const image = new Image() as LoadedImage;

    image.onload = () => {
      image.width = image.naturalWidth;
      image.height = image.naturalHeight;

      artworkRef.current = image;
      setArtworkReady(true);
      setStatus(
        "Artwork ready. Add your name and photo.",
      );
    };

    image.onerror = () => {
      setError(
        "The official flyer artwork could not be loaded.",
      );
    };

    image.src = flyerConfig.artworkPath;
  }, []);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      void drawPreview();
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [drawPreview, artworkReady]);

  /*
   * Automatically prepare a fresh PNG after the user stops
   * changing their name, zoom or photo position.
   */
  useEffect(() => {
    const sequence = ++generationSequenceRef.current;

    setGeneratedBlob(null);

    if (!canPrepare) {
      setIsPreparing(false);
      return;
    }

    setIsPreparing(true);
    setStatus("Preparing your flyer…");

    const timer = window.setTimeout(async () => {
      try {
        await drawPreview();

        const canvas = canvasRef.current;

        if (!canvas) {
          throw new Error("Canvas unavailable");
        }

        const blob = await canvasToBlob(canvas);

        /*
         * Ignore an outdated result if the user changed the
         * name or photo while this version was being created.
         */
        if (
          generationSequenceRef.current !== sequence
        ) {
          return;
        }

        setGeneratedBlob(blob);
        setStatus(
          "Your flyer is ready to share or save.",
        );
      } catch {
        if (
          generationSequenceRef.current === sequence
        ) {
          setError(
            "We could not prepare your flyer. Please try again.",
          );
          setStatus("Flyer preparation failed.");
        }
      } finally {
        if (
          generationSequenceRef.current === sequence
        ) {
          setIsPreparing(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    canPrepare,
    cropState,
    drawPreview,
    normalisedName,
  ]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function loadPhoto(file?: File) {
    setError("");
    setGeneratedBlob(null);

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please choose a supported image file.",
      );
      return;
    }

    if (
      file.size >
      flyerConfig.maxFileSizeBytes
    ) {
      setError(
        "Please choose an image smaller than 12 MB.",
      );
      return;
    }

    setPhotoReady(false);
    setStatus("Loading image…");

    const objectUrl =
      URL.createObjectURL(file);

    const image = new Image() as LoadedImage;

    image.onload = () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(
          objectUrlRef.current,
        );
      }

      objectUrlRef.current = objectUrl;

      image.width = image.naturalWidth;
      image.height = image.naturalHeight;

      photoRef.current = image;

      const initialZoom = coverScale(
        image,
        flyerConfig.photoFrame,
      );

      setMinimumZoom(initialZoom);
      setCropState({
        zoom: initialZoom,
        offsetX: 0,
        offsetY: 0,
      });

      setPhotoReady(true);
      setStatus(
        "Photo ready. Drag the preview or adjust the zoom.",
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError(
        "We could not read that image. Please try another photo.",
      );
      setStatus("Photo loading failed.");
    };

    image.src = objectUrl;
  }

  function updateCropState(
    nextState: CropState,
  ) {
    const image = photoRef.current;

    setGeneratedBlob(null);

    setCropState(
      image
        ? clampOffsets(
            image,
            flyerConfig.photoFrame,
            nextState,
          )
        : nextState,
    );
  }

  function downloadFlyer() {
    if (!generatedBlob) {
      return;
    }

    const objectUrl =
      URL.createObjectURL(generatedBlob);

    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = outputFilename;
    link.click();

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);

    setStatus(
      "Flyer downloaded. On iPhone, it may appear in the Files app.",
    );
  }

  async function shareGeneratedFlyer() {
    if (!generatedBlob) {
      return;
    }

    try {
      await shareFlyer({
        blob: generatedBlob,
        filename: outputFilename,
        title: flyerConfig.nativeShareTitle,
        text: flyerConfig.nativeShareText,
        url: publicPageUrl(
          flyerConfig.publicSiteUrl,
        ),
      });

      setStatus(
        "Share options opened. Choose Save Image or an app.",
      );
    } catch (caughtError) {
      if (
        caughtError instanceof DOMException &&
        caughtError.name === "AbortError"
      ) {
        return;
      }

      setStatus(
        "Direct sharing is unavailable here. Use Download Image instead.",
      );
    }
  }

  async function copyPageLink() {
    try {
      await copyText(
        publicPageUrl(
          flyerConfig.publicSiteUrl,
        ),
      );

      setStatus("Link copied successfully.");
    } catch {
      setError(
        "Clipboard copy failed. Please copy the page URL from your browser.",
      );
    }
  }

  function getPointerScale(
    canvas: HTMLCanvasElement,
  ) {
    const rect =
      canvas.getBoundingClientRect();

    return {
      x:
        rect.width > 0
          ? canvas.width / rect.width
          : 1,
      y:
        rect.height > 0
          ? canvas.height / rect.height
          : 1,
    };
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(280px,560px)_1fr]">
      <div className="flex justify-center lg:sticky lg:top-6 lg:self-start">
        <FlyerCanvas
          ref={canvasRef}
          onPointerDown={(event) => {
            if (!photoReady) {
              return;
            }

            event.currentTarget.setPointerCapture(
              event.pointerId,
            );

            dragRef.current = {
              pointerId: event.pointerId,
              clientX: event.clientX,
              clientY: event.clientY,
              cropState,
            };

            setStatus(
              "Adjusting photo position…",
            );
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;

            if (
              !drag ||
              drag.pointerId !== event.pointerId
            ) {
              return;
            }

            event.preventDefault();

            const scale = getPointerScale(
              event.currentTarget,
            );

            updateCropState({
              ...drag.cropState,
              offsetX:
                drag.cropState.offsetX +
                (event.clientX -
                  drag.clientX) *
                  scale.x,
              offsetY:
                drag.cropState.offsetY +
                (event.clientY -
                  drag.clientY) *
                  scale.y,
            });
          }}
          onPointerUp={(event) => {
            if (
              dragRef.current?.pointerId ===
              event.pointerId
            ) {
              dragRef.current = null;
              setStatus(
                "Photo position updated.",
              );
            }
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
        />
      </div>

      <div className="control-card rounded-3xl p-5 sm:p-7">
        <div className="mb-5 rounded-2xl bg-amber-200/15 p-4 text-sm text-amber-50">
          {flyerConfig.privacyMessage}
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="mb-2 block font-bold">
              Your Name
            </span>

            <input
              value={name}
              maxLength={
                flyerConfig.maxNameLength
              }
              onChange={(event) => {
                setName(event.target.value);
                setGeneratedBlob(null);
                setError("");
              }}
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/20 bg-white px-4 py-3 text-stone-950"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-bold">
              Choose Your Photo
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                loadPhoto(
                  event.target.files?.[0],
                )
              }
              className="w-full rounded-xl border border-dashed border-amber-200/60 p-3"
            />
          </label>

          <PhotoControls
            disabled={!photoReady}
            zoom={cropState.zoom}
            min={minimumZoom}
            max={
              minimumZoom *
              flyerConfig.photo.maximumZoom
            }
            onZoom={(zoom) =>
              updateCropState({
                ...cropState,
                zoom,
              })
            }
            onReset={() =>
              updateCropState({
                zoom: minimumZoom,
                offsetX: 0,
                offsetY: 0,
              })
            }
            onNudge={(x, y) =>
              updateCropState({
                ...cropState,
                offsetX:
                  cropState.offsetX + x,
                offsetY:
                  cropState.offsetY + y,
              })
            }
          />

          <div
            aria-live="polite"
            className="min-h-6 text-sm text-amber-100"
          >
            {error || status}
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-red-500/20 p-3 text-sm text-red-100"
            >
              {error}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!flyerReady}
              onClick={
                shareGeneratedFlyer
              }
              className="rounded-xl bg-amber-300 px-4 py-3 font-black text-stone-950 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
            >
              {isPreparing
                ? "Preparing Flyer…"
                : "Share or Save Flyer"}
            </button>

            <button
              type="button"
              disabled={!flyerReady}
              onClick={downloadFlyer}
              className="rounded-xl bg-white px-4 py-3 font-bold text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download Image
            </button>

            <a
              href={whatsappUrl(
                flyerConfig.whatsappShareText,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-green-500 px-4 py-3 text-center font-bold text-white"
            >
              Share on WhatsApp
            </a>

            <button
              type="button"
              onClick={copyPageLink}
              className="rounded-xl bg-white/10 px-4 py-3 font-bold"
            >
              Copy Link
            </button>

            <a
              href={
                flyerConfig.registrationUrl
              }
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-amber-100 px-4 py-3 text-center font-bold text-stone-950"
            >
              Register for DWELL 2026
            </a>
          </div>

  
        </div>
      </div>
    </div>
  );
}