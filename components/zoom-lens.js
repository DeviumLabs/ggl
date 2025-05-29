import { useRef, useState } from "react";

export default function ZoomLens({ src, width = 450, height = 430, zoom = 2 }) {
  const containerRef = useRef(null);
  const lensRef = useRef(null);
  const [showLens, setShowLens] = useState(false);

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    const lens = lensRef.current;

    if (!container || !lens) return;

    const rect = container.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensWidth = lens.offsetWidth / 2;
    const lensHeight = lens.offsetHeight / 2;

    let lensX = x - lensWidth;
    let lensY = y - lensHeight;

    // limitar dentro da imagem
    lensX = Math.max(0, Math.min(lensX, width - lens.offsetWidth));
    lensY = Math.max(0, Math.min(lensY, height - lens.offsetHeight));

    lens.style.left = `${lensX}px`;
    lens.style.top = `${lensY}px`;

    lens.style.backgroundPosition = `-${lensX * zoom}px -${lensY * zoom}px`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowLens(true)}
      onMouseLeave={() => setShowLens(false)}
      className="tw-relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <img
        src={src}
        alt="Produto com zoom"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
      {showLens && (
        <div
          ref={lensRef}
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
