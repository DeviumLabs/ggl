import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function ZoomLens({
  src,
  width = 450,
  height = 430,
  zoom = 2,
  item_id,
  item_name,
  item_category,
  item_category2,
  priority = false,
}) {
  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const firedRef = useRef(false);

  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const LENS_W = 150;
  const LENS_H = 150;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `zoom_fired::${src}`;
    firedRef.current = sessionStorage.getItem(key) === "1";
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

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "image_zoom",
      items: [
        {
          item_id: item_id || "unknown",
          item_name: item_name || "unknown",
          item_category: item_category || undefined,
          item_category2: item_category2 || undefined,
        },
      ],
      image_src: src,
      zoom_level: zoom,
      component: "zoom_lens",
    });
    markFired();
  };

  const clamp = (val, min, max) => Math.max(min, Math.min(val, max));

  const handlePointer = (clientX, clientY) => {
    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    const rect = container.getBoundingClientRect();
    const x = (clientX ?? 0) - rect.left;
    const y = (clientY ?? 0) - rect.top;

    let lensX = clamp(x - LENS_W / 2, 0, width - LENS_W);
    let lensY = clamp(y - LENS_H / 2, 0, height - LENS_H);
    setLensPos({ x: lensX, y: lensY });
  };

  const handleMouseMove = (e) => {
    handlePointer(e.clientX, e.clientY);
  };
  const handleTouchStart = (e) => {
    setShowLens(true);
    pushZoomEvent();
    const t = e.touches?.[0];
    if (t) handlePointer(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    const t = e.touches?.[0];
    if (t) handlePointer(t.clientX, t.clientY);
  };

  const handleMouseEnter = () => {
    setShowLens(true);
    pushZoomEvent();
  };
  const handleMouseLeave = () => setShowLens(false);

  const sizes = `${width}px`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="tw-relative"
      style={{ width, height }}
    >
      <Image
        src={src}
        alt={item_name ? `Zoom: ${item_name}` : "Produto com zoom"}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        className="tw-object-contain"
        style={{ width: "100%", height: "100%" }}
      />

      {showLens && (
        <div
          ref={lensRef}
          aria-hidden="true"
          className="tw-absolute tw-border tw-border-gray-400 tw-pointer-events-none tw-overflow-hidden tw-rounded"
          style={{
            width: `${LENS_W}px`,
            height: `${LENS_H}px`,
            left: `${lensPos.x}px`,
            top: `${lensPos.y}px`,
          }}
        >
          <div
            className="tw-absolute"
            style={{
              left: `${-lensPos.x * zoom}px`,
              top: `${-lensPos.y * zoom}px`,
              width: `${width * zoom}px`,
              height: `${height * zoom}px`,
            }}
          >
            <Image
              src={src}
              alt=""
              width={width * zoom}
              height={height * zoom}
              sizes={`${width * zoom}px`}
              priority={false}
              className="tw-object-contain"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
