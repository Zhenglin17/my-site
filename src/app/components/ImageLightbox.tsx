"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  src: string;
  alt: string;
  thumbnailClassName?: string;
  thumbnailStyle?: React.CSSProperties;
}

export function ImageLightbox({ src, alt, thumbnailClassName, thumbnailStyle }: Props) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const lastPinchDist = useRef<number | null>(null);

  const applyScale = (next: number) => {
    const clamped = Math.min(Math.max(next, 1), 8);
    setScale(clamped);
    if (clamped <= 1) setOffset({ x: 0, y: 0 });
  };

  const close = () => {
    setOpen(false);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Scroll wheel zoom
  const onWheel = (e: React.WheelEvent) => {
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    applyScale(scale * factor);
  };

  // Mouse drag (when zoomed)
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setOffset({
      x: dragStart.current.ox + (e.clientX - dragStart.current.x) / scale,
      y: dragStart.current.oy + (e.clientY - dragStart.current.y) / scale,
    });
  };
  const onMouseUp = () => { isDragging.current = false; };

  // Touch: two-finger pinch + single-finger pan
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      lastPinchDist.current = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging.current = true;
      dragStart.current = {
        x: e.touches[0].clientX, y: e.touches[0].clientY,
        ox: offset.x, oy: offset.y,
      };
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      e.preventDefault();
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      applyScale(scale * (dist / lastPinchDist.current));
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && isDragging.current) {
      setOffset({
        x: dragStart.current.ox + (e.touches[0].clientX - dragStart.current.x) / scale,
        y: dragStart.current.oy + (e.touches[0].clientY - dragStart.current.y) / scale,
      });
    }
  };
  const onTouchEnd = () => {
    lastPinchDist.current = null;
    isDragging.current = false;
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`${thumbnailClassName ?? ""} cursor-zoom-in`}
        style={thumbnailStyle}
        onClick={() => setOpen(true)}
      />

      {open && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={close}
        >
          {/* Close button */}
          <button
            className="absolute top-5 right-6 text-white/50 hover:text-white text-3xl leading-none z-10 transition-colors duration-150"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
          >
            ×
          </button>

          {/* Zoom / pan area */}
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{ cursor: scale > 1 ? "grab" : "default", touchAction: "none" }}
            onClick={(e) => e.stopPropagation()}
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="max-w-[90vw] max-h-[90vh] object-contain select-none pointer-events-none"
              style={{
                transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
                transformOrigin: "center center",
              }}
            />
          </div>

          {scale === 1 && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/25 text-xs pointer-events-none select-none">
              scroll or pinch to zoom · click outside to close
            </p>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
