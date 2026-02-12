import { useEffect, useRef, useState } from "react";

const offsets = {
  up: "translate3d(0, 16px, 0)",
  down: "translate3d(0, -16px, 0)",
  left: "translate3d(-16px, 0, 0)",
  right: "translate3d(16px, 0, 0)",
  none: "translate3d(0, 0, 0)"
};

export default function Reveal({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 550,
  once = true,
  threshold = 0.12
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(true);
  const [canHide, setCanHide] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      setCanHide(false);
      return;
    }

    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      setCanHide(false);
      return;
    }

    const node = ref.current;
    if (!node) return;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const rect = node.getBoundingClientRect();
    const initialInView = rect.bottom > 0 && rect.top < viewportHeight * 0.85;

    setVisible(initialInView);
    setCanHide(!initialInView || !once);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -15% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold, reduceMotion]);

  const hidden = canHide && !visible && !reduceMotion;
  const hiddenTransform = offsets[direction] || offsets.up;

  const style = {
    opacity: hidden ? 0 : 1,
    transform: hidden ? hiddenTransform : "translate3d(0, 0, 0)",
    transition: reduceMotion
      ? "none"
      : `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    willChange: hidden ? "opacity, transform" : "auto"
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
