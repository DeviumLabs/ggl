import { useContext } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import RevealGroupContext from "./revealContext";
import { getRevealStagger, getRevealViewport } from "./motionTokens";

function getMotionTag(as = "div") {
  return m[as] || m.div;
}

export default function RevealGroup({
  children,
  className = "",
  as = "div",
  variant = "card",
  once = true,
  threshold,
  viewportMargin,
  stagger,
  delay = 0
}) {
  const shouldReduceMotion = useReducedMotion();
  const parentGroup = useContext(RevealGroupContext);
  const MotionTag = getMotionTag(as);
  const viewport = getRevealViewport(variant, threshold, viewportMargin);

  if (shouldReduceMotion) {
    return (
      <RevealGroupContext.Provider value={false}>
        <MotionTag className={className}>{children}</MotionTag>
      </RevealGroupContext.Provider>
    );
  }

  return (
    <RevealGroupContext.Provider value={true}>
      <MotionTag
        className={className}
        variants={{
          hidden: {},
          show: {
            transition: {
              delayChildren: delay / 1000,
              staggerChildren: getRevealStagger(variant, stagger)
            }
          }
        }}
        {...(!parentGroup
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
    </RevealGroupContext.Provider>
  );
}
