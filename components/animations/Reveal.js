import { useContext } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import RevealGroupContext from "./revealContext";
import { getDirectionalOffset, getRevealPreset, getRevealTransition, getRevealViewport } from "./motionTokens";

function getMotionTag(as = "div") {
  return m[as] || m.div;
}

export default function Reveal({
  children,
  className = "",
  as = "div",
  variant = "section",
  direction,
  delay = 0,
  duration,
  once = true,
  threshold,
  viewportMargin
}) {
  const shouldReduceMotion = useReducedMotion();
  const isGrouped = useContext(RevealGroupContext);
  const MotionTag = getMotionTag(as);
  const preset = getRevealPreset(variant);
  const resolvedDirection = direction || "up";
  const hiddenState = getDirectionalOffset(resolvedDirection, preset.distance);
  const transition = getRevealTransition({ variant, delay, duration });
  const viewport = getRevealViewport(variant, threshold, viewportMargin);

  if (shouldReduceMotion) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: { opacity: 0, ...hiddenState },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition
        }
      }}
      {...(!isGrouped
        ? {
            initial: "hidden",
            whileInView: "show",
            viewport: {
              once,
              amount: viewport.amount,
              margin: viewport.margin
            }
          }
        : {})}
    >
      {children}
    </MotionTag>
  );
}
