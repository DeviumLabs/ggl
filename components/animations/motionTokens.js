export const motionEase = {
  standard: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 0.2, 1]
};

export const motionDuration = {
  hero: 0.64,
  section: 0.52,
  card: 0.44,
  subtle: 0.3,
  overlay: 0.22,
  panel: 0.28,
  modal: 0.24,
  expand: 0.32,
  collapse: 0.28,
  quick: 0.18
};

export const motionOffset = {
  hero: 28,
  section: 18,
  card: 14,
  subtle: 10,
  drawer: -32,
  menu: -10,
  modal: 18,
  collapse: 8
};

export const motionStagger = {
  hero: 0.12,
  section: 0.08,
  card: 0.06,
  subtle: 0.04
};

const revealPresets = {
  hero: {
    amount: 0.28,
    margin: "0px 0px -10% 0px",
    duration: motionDuration.hero,
    distance: motionOffset.hero,
    stagger: motionStagger.hero
  },
  section: {
    amount: 0.18,
    margin: "0px 0px -12% 0px",
    duration: motionDuration.section,
    distance: motionOffset.section,
    stagger: motionStagger.section
  },
  card: {
    amount: 0.14,
    margin: "0px 0px -10% 0px",
    duration: motionDuration.card,
    distance: motionOffset.card,
    stagger: motionStagger.card
  },
  subtle: {
    amount: 0.1,
    margin: "0px 0px -8% 0px",
    duration: motionDuration.subtle,
    distance: motionOffset.subtle,
    stagger: motionStagger.subtle
  }
};

const surfacePresets = {
  drawer: {
    axis: "x",
    offset: motionOffset.drawer,
    duration: motionDuration.panel
  },
  menu: {
    axis: "y",
    offset: motionOffset.menu,
    duration: motionDuration.panel
  },
  modal: {
    axis: "y",
    offset: motionOffset.modal,
    duration: motionDuration.modal
  }
};

export function getRevealPreset(variant = "section") {
  return revealPresets[variant] || revealPresets.section;
}

export function getRevealViewport(variant = "section", threshold, viewportMargin) {
  const preset = getRevealPreset(variant);

  return {
    amount: typeof threshold === "number" ? threshold : preset.amount,
    margin: viewportMargin || preset.margin
  };
}

export function getRevealTransition({ variant = "section", delay = 0, duration } = {}) {
  const preset = getRevealPreset(variant);

  return {
    duration: typeof duration === "number" ? duration / 1000 : preset.duration,
    delay: delay / 1000,
    ease: motionEase.standard
  };
}

export function getRevealStagger(variant = "card", stagger) {
  const preset = getRevealPreset(variant);
  return typeof stagger === "number" ? stagger : preset.stagger;
}

export function getDirectionalOffset(direction = "up", distance = motionOffset.section) {
  switch (direction) {
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "none":
      return { x: 0, y: 0 };
    case "up":
    default:
      return { x: 0, y: distance };
  }
}

export function getOverlayMotion(shouldReduceMotion) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: shouldReduceMotion
      ? { duration: 0.16 }
      : { duration: motionDuration.overlay, ease: motionEase.standard }
  };
}

export function getSurfaceMotion(type = "menu", shouldReduceMotion) {
  const preset = surfacePresets[type] || surfacePresets.menu;
  const distance = shouldReduceMotion ? 0 : preset.offset;
  const axisState = preset.axis === "x" ? { x: distance } : { y: distance };

  return {
    initial: { opacity: 0, ...axisState },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, ...axisState },
    transition: shouldReduceMotion
      ? { duration: 0.16 }
      : { duration: preset.duration, ease: motionEase.standard }
  };
}

export const defaultMotionTransition = {
  duration: motionDuration.section,
  ease: motionEase.standard
};
