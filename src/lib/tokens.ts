// Clario design tokens — extracted from live sniper pass
export const tokens = {
  colors: {
    bg: "#050505",
    dark: "#0d0d0d",
    accent: "#8cff2e",
    white: "#ffffff",
    offwhite: "#f8f8fa",
    surface: "#f5f5f2",
    muted: "#2f2f2f",
    gray: "#c8c8c0",
    border: "#171717",
    textSecondary: "rgba(255, 255, 255, 0.65)",
  },
  nav: {
    height: 80,
    bg: "rgba(5, 5, 5, 0.5)",
    paddingX: 40,
    linkSize: "16px",
    linkWeight: 500,
  },
  hero: {
    h1Size: "64px",
    h1Weight: 500,
    h1LetterSpacing: "-2.56px",
    h1LineHeight: "64px",
    subheadSize: "18px",
    subheadWeight: 400,
    subheadLineHeight: "27px",
    subheadColor: "rgba(255, 255, 255, 0.65)",
    subheadWidth: 540,
  },
  button: {
    radius: "23px",
    padding: "12px 20px",
    textSize: "15px",
    textWeight: 600,
    textColor: "#0d0d0d",
    glow: "0px 8px 20px 0px rgba(132,255,31,0.32)",
  },
  card: {
    radius: "30px",
    bg: "#0d0d0d",
    padding: "10px 10px 30px",
    width: 320,
    shadow: "inset 0px 1px 0px 0px rgba(23,23,23,0.15), inset 0px -1px 0px 0px rgba(23,23,23,0.15), 0px 1px 2px 0px rgba(23,23,23,0.4), 0px 3px 8px 0px rgba(23,23,23,0.19), 0px 6px 4px 0px rgba(23,23,23,0.05), 0px 11px 4px 0px rgba(23,23,23,0.01), 0px 16px 5px 0px rgba(23,23,23,0)",
  },
  stepPill: {
    color: "#8cff2e",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: "-0.32px",
  },
  price: {
    size: "48px",
    weight: 500,
    periodSize: "12px",
    periodWeight: 400,
  },
  popular: {
    bg: "#171717",
    color: "#0d0d0d",
    radius: "0px 16px",
    fontSize: "12px",
    padding: "8px 16px",
  },
  container: {
    maxWidth: 1199,
    narrow: 809,
    medium: 1000,
  },
  sectionPadding: "100px 40px",
};

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export const fadeUpSmall = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export const fadeUpTiny = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};

export const fadeUpCard = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
};
