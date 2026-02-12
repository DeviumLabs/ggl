import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { dlPush } from "../lib/analytics/dataLayer";

export default function ZoomLens({ src, width = 450, height = 430, zoom = 2, item_id, item_name, item_category, item_category2, priority = false }) {
  const containerRef = useRef(null);
  const firedRef = useRef(false);
  const naturalSizeRef = useRef({ width: 0, height: 0 });
  const rafRef = useRef(null);
  const pendingPointRef = useRef(null);

  const [showLens, setShowLens] = useState(false);
  const [lensState, setLensState] = useState({ x: 0, y: 0, focusX: 0, focusY: 0 });
  const [imageBounds, setImageBounds] = useState({
    width,
    height,
    offsetX: 0,
    offsetY: 0
  });

  const LENS_W = 150;
  const LENS_H = 150;

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));
  const round = (val) => Math.round(val * 100) / 100;

  const computeContainBounds = useCallback((containerW, containerH, naturalW, naturalH) => {
    if (!naturalW || !naturalH || !containerW || !containerH) {
      return { width: containerW || width, height: containerH || height, offsetX: 0, offsetY: 0 };
    }

    const scale = Math.min(containerW / naturalW, containerH / naturalH);
    const fitW = naturalW * scale;
    const fitH = naturalH * scale;
    return {
      width: fitW,
      height: fitH,
      offsetX: (containerW - fitW) / 2,
      offsetY: (containerH - fitH) / 2
    };
  }, [width, height]);

  const refreshImageBounds = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const naturalW = naturalSizeRef.current.width;
    const naturalH = naturalSizeRef.current.height;
    const nextBounds = computeContainBounds(rect.width, rect.height, naturalW, naturalH);
    setImageBounds(nextBounds);
  }, [computeContainBounds]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `zoom_fired::${src}`;
    firedRef.current = sessionStorage.getItem(key) === "1";
    setShowLens(false);
  }, [src]);

  const markFired = () => {
    if (typeof window === "undefined") return;
    const key = `zoom_fired::${src}`;
    firedRef.current = true;
    sessionStorage.setItem(key, "1");
  };

  const pushZoomEvent = () => {
    if (typeof window === "undefined") return;
    if (firedRef.current) return;

    dlPush("image_zoom", {
      items: [
        {
          item_id: item_id || "unknown",
          item_name: item_name || "unknown",
          item_category: item_category || undefined,
          item_category2: item_category2 || undefined
        }
      ],
      image_src: src,
      zoom_level: zoom,
      component: "zoom_lens"
    });

    markFired();
  };

  const handlePointer = useCallback((clientX, clientY) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = (clientX ?? 0) - rect.left;
    const y = (clientY ?? 0) - rect.top;

    const boundsW = imageBounds.width || rect.width;
    const boundsH = imageBounds.height || rect.height;
    const minX = imageBounds.offsetX || 0;
    const minY = imageBounds.offsetY || 0;
    const maxX = minX + boundsW;
    const maxY = minY + boundsH;
    const isInsideImage = x >= minX && x <= maxX && y >= minY && y <= maxY;
    if (!isInsideImage) {
      setShowLens(false);
      return;
    }

    const focusX = clamp(x, minX, maxX);
    const focusY = clamp(y, minY, maxY);
    const lensX = clamp(
      focusX - LENS_W / 2,
      minX,
      Math.max(minX, maxX - LENS_W)
    );
    const lensY = clamp(
      focusY - LENS_H / 2,
      minY,
      Math.max(minY, maxY - LENS_H)
    );

    setLensState((prev) => {
      const next = {
        x: round(lensX),
        y: round(lensY),
        focusX: round(focusX),
        focusY: round(focusY)
      };
      if (
        prev.x === next.x &&
        prev.y === next.y &&
        prev.focusX === next.focusX &&
        prev.focusY === next.focusY
      ) {
        return prev;
      }
      return next;
    });
    setShowLens(true);
  }, [imageBounds]);

  const schedulePointer = useCallback((clientX, clientY) => {
    pendingPointRef.current = { clientX, clientY };
    if (rafRef.current) return;
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      const p = pendingPointRef.current;
      if (!p) return;
      handlePointer(p.clientX, p.clientY);
    });
  }, [handlePointer]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const node = containerRef.current;
    if (!node) return undefined;

    refreshImageBounds();

    let ro = null;
    if (typeof window.ResizeObserver === "function") {
      ro = new window.ResizeObserver(() => refreshImageBounds());
      ro.observe(node);
    } else {
      window.addEventListener("resize", refreshImageBounds);
    }

    return () => {
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", refreshImageBounds);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [refreshImageBounds]);

  const handlePointerEnter = (e) => {
    if (e.pointerType === "touch") return;
    setShowLens(true);
    pushZoomEvent();
    schedulePointer(e.clientX, e.clientY);
  };
  const handlePointerMove = (e) => {
    if (e.pointerType === "touch") return;
    schedulePointer(e.clientX, e.clientY);
  };
  const handlePointerLeave = () => setShowLens(false);

  const sizes = `${width}px`;
  const zoomLayerW = Math.max(1, Math.round(imageBounds.width * zoom));
  const zoomLayerH = Math.max(1, Math.round(imageBounds.height * zoom));
  const zoomLeft = LENS_W / 2 - (lensState.focusX - imageBounds.offsetX) * zoom;
  const zoomTop = LENS_H / 2 - (lensState.focusY - imageBounds.offsetY) * zoom;

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="tw-relative tw-select-none"
      style={{ width, height }}
    >
      <Image
        src={src}
        alt={item_name ? `Zoom: ${item_name}` : "Produto com zoom"}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        onLoadingComplete={(img) => {
          naturalSizeRef.current = { width: img.naturalWidth, height: img.naturalHeight };
          refreshImageBounds();
        }}
        className="tw-object-contain tw-pointer-events-none"
        draggable={false}
        style={{ width: "100%", height: "100%" }}
      />

      {showLens ? (
        <div
          aria-hidden="true"
          className="tw-absolute tw-pointer-events-none tw-overflow-hidden tw-rounded-[18px] tw-border tw-border-white/85 tw-shadow-[0_18px_32px_-20px_rgba(15,23,42,0.65)] tw-bg-slate-100/20"
          style={{ width: `${LENS_W}px`, height: `${LENS_H}px`, left: `${lensState.x}px`, top: `${lensState.y}px` }}
        >
          <div
            className="tw-absolute tw-w-full tw-h-full tw-bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_58%,rgba(255,255,255,0.2)_100%)]"
            style={{ zIndex: 2 }}
          />
          <div className="tw-absolute" style={{ left: `${zoomLeft}px`, top: `${zoomTop}px`, width: `${zoomLayerW}px`, height: `${zoomLayerH}px` }}>
            <Image
              src={src}
              alt=""
              width={zoomLayerW}
              height={zoomLayerH}
              sizes={`${zoomLayerW}px`}
              priority={false}
              className="tw-object-contain"
              draggable={false}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
