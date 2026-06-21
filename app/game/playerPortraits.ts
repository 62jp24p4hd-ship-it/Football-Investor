export const PIXEL_PORTRAITS: Record<string, string> = {
  "Yousef Alnuwasser":   "/images/yousef-pixel.png",
  "Hussain Alrezk":      "/images/hussain-alrezk.png",
  "ABDULLAH ALMUSAWI":   "/images/abdullah-almusawi.png",
  "Ali Alsaif":          "/images/ali-alsaif.png",
  "Ali AlGhanim":        "/images/ali-alghanim.png",
  "Abdulaziz Alghariri": "/images/abdulaziz-alghariri.png",
  "Ali Albrahim":        "/images/ali-albrahim.png",
};

export function getPlayerPortrait(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  return PIXEL_PORTRAITS[name];
}
