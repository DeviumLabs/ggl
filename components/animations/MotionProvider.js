import { LazyMotion, MotionConfig, useReducedMotion, useScroll, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { defaultMotionTransition } from "./motionTokens";

const loadFeatures = () => import("./motionFeatures").then((res) => res.default);

function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    mass: 0.22
  });

  if (shouldReduceMotion) return null;

  return (
    <m.div
      aria-hidden="true"
      className="tw-pointer-events-none tw-fixed tw-left-0 tw-top-0 tw-z-[450] tw-h-[3px] tw-w-full tw-origin-left tw-bg-[linear-gradient(90deg,#0058C2_0%,#38bdf8_100%)] tw-opacity-80"
      style={{ scaleX, transformOrigin: "0% 50%", willChange: "transform" }}
    />
  );
}

export default function MotionProvider({ children }) {
  return (
    <LazyMotion features={loadFeatures}>
      <MotionConfig
        reducedMotion="user"
        transition={defaultMotionTransition}
      >
        <ScrollProgressBar />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
