import { useRef, useState, useEffect } from "react";
import Image from "next/image";

export default function ZoomLens({
  src,
  width = 450,
  height = 430,
  zoom = 2,
  item_id,
  item_name,
}) {
  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const [showLens, setShowLens] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    const key = `zoom_fired::${src}`;
    firedRef.current = sessionStorage.getItem(key) === "1";
  }, [src]);

  const markFired = () => {
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
      items: [{
        item_id: product.slug,
        item_name: product.name,
        item_category: category.singleName,
        item_category2: category.slug,
      }],
      image_src: src,
      zoom_level: zoom,
      component: "zoom_lens",
    });
    markFired();
  };

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const lens = lensRef.current;
    if (!container || !lens) return;

    const rect = container.getBoundingClientRect();
    const x = (e.clientX ?? 0) - rect.left;
    const y = (e.clientY ?? 0) - rect.top;

    const halfW = lens.offsetWidth / 2;
    const halfH = lens.offsetHeight / 2;

    let lensX = x - halfW;
    let lensY = y - halfH;

    lensX = Math.max(0, Math.min(lensX, width - lens.offsetWidth));
    lensY = Math.max(0, Math.min(lensY, height - lens.offsetHeight));

    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;
    lens.style.backgroundPosition = `-${lensX * zoom}px -${lensY * zoom}px`;
  };

  const handleMouseEnter = () => {
    setShowLens(true);
    pushZoomEvent();
  };

  const handleTouchStart = () => {
    setShowLens(true);
    pushZoomEvent();
  };

  const handleMouseLeave = () => {
    setShowLens(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      className="tw-relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <Image
        src={src}
        alt={item_name ? `Zoom: ${item_name}` : "Produto com zoom"}
        width={width}
        height={height}
        className="tw-object-contain"
        style={{ width: "100%", height: "100%" }}
      />

      {showLens && (
        <div
          ref={lensRef}
          aria-hidden="true"
          className="tw-absolute tw-border tw-border-gray-400 tw-pointer-events-none"
          style={{
            width: "150px",
            height: "150px",
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${width * zoom}px ${height * zoom}px`,
          }}
        />
      )}
    </div>
  );
}