import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

const offsets = {
  up: { y: 16 },
  down: { y: -16 },
  left: { x: -16 },
  right: { x: 16 },
  none: {}
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
  const shouldReduceMotion = useReducedMotion();
  const hiddenState = offsets[direction] || offsets.up;

  return (
    <m.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, ...hiddenState }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={
        shouldReduceMotion
          ? undefined
          : {
              once,
              amount: threshold,
              margin: "0px 0px -15% 0px"
            }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : {
              duration: duration / 1000,
              delay: delay / 1000,
              ease: [0.22, 1, 0.36, 1]
            }
      }
      style={shouldReduceMotion ? undefined : { willChange: "transform, opacity" }}
    >
      {children}
    </m.div>
  );
}
