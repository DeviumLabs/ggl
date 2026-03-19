import { useEffect, useRef, useState } from "react";
import { useAnimate, useReducedMotion } from "motion/react";

export default function SmoothExpand({
  open,
  id,
  children,
  className = "",
  contentClassName = "",
  expandedMarginTop = 6,
  collapsedOffset = -8
}) {
  const shouldReduceMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const contentRef = useRef(null);
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useEffect(() => {
    const node = scope.current;
    const contentNode = contentRef.current;
    if (!node || !contentNode || !rendered) return;

    let cancelled = false;

    const run = async () => {
      if (shouldReduceMotion) {
        node.style.height = open ? "auto" : "0px";
        node.style.opacity = open ? "1" : "0";
        node.style.marginTop = open ? `${expandedMarginTop}px` : "0px";
        contentNode.style.opacity = open ? "1" : "0";
        contentNode.style.transform = open ? "translateY(0px)" : `translateY(${collapsedOffset}px)`;
        if (!open && !cancelled) setRendered(false);
        return;
      }

      if (open) {
        node.style.display = "block";
        node.style.overflow = "hidden";
        await Promise.all([
          animate(
            node,
            {
              height: [0, contentNode.scrollHeight],
              opacity: [0, 1],
              marginTop: [0, expandedMarginTop]
            },
            {
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1]
            }
          ),
          animate(
            contentNode,
            {
              opacity: [0, 1],
              y: [collapsedOffset, 0]
            },
            {
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1]
            }
          )
        ]);

        if (!cancelled) {
          node.style.height = "auto";
          node.style.opacity = "1";
          node.style.marginTop = `${expandedMarginTop}px`;
        }

        return;
      }

      const currentHeight = contentNode.getBoundingClientRect().height;
      node.style.height = `${currentHeight}px`;
      node.style.opacity = "1";
      node.style.marginTop = `${expandedMarginTop}px`;
      node.style.overflow = "hidden";

      await Promise.all([
        animate(
          contentNode,
          {
            opacity: [1, 0],
            y: [0, collapsedOffset]
          },
          {
            duration: 0.18,
            ease: [0.4, 0, 0.2, 1]
          }
        ),
        animate(
          node,
          {
            height: [currentHeight, 0],
            opacity: [1, 0],
            marginTop: [expandedMarginTop, 0]
          },
          {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }
        )
      ]);

      if (!cancelled) {
        setRendered(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [animate, collapsedOffset, expandedMarginTop, open, rendered, scope, shouldReduceMotion]);

  if (!rendered) return null;

  return (
    <div
      ref={scope}
      id={id}
      aria-hidden={!open}
      className={className}
      style={{
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
        marginTop: open ? expandedMarginTop : 0,
        overflow: "hidden",
        willChange: shouldReduceMotion ? "auto" : "height, opacity"
      }}
    >
      <div
        ref={contentRef}
        className={contentClassName}
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0px)" : `translateY(${collapsedOffset}px)`,
          willChange: shouldReduceMotion ? "auto" : "transform, opacity"
        }}
      >
        {children}
      </div>
    </div>
  );
}
