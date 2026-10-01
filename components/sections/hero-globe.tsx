"use client";

import type { COBEOptions } from "cobe";

import { Globe } from "@/components/ui/globe";
import { Meteors } from "@/components/ui/meteors";

// solid brand-blue globe with white dots/markers
export const HERO_GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.6,
  mapSamples: 16000,
  mapBrightness: 10,
  baseColor: [29 / 255, 78 / 255, 216 / 255],
  markerColor: [1, 1, 1],
  glowColor: [1, 1, 1],
  markers: [
    { location: [14.5995, 120.9842], size: 0.03 },
    { location: [19.076, 72.8777], size: 0.1 },
    { location: [23.8103, 90.4125], size: 0.05 },
    { location: [30.0444, 31.2357], size: 0.07 },
    { location: [39.9042, 116.4074], size: 0.08 },
    { location: [-23.5505, -46.6333], size: 0.1 },
    { location: [19.4326, -99.1332], size: 0.1 },
    { location: [40.7128, -74.006], size: 0.1 },
    { location: [34.6937, 135.5022], size: 0.05 },
    { location: [41.0082, 28.9784], size: 0.06 },
  ],
};

// Decorative canvas visual. Loaded client-side only (ssr: false from the
// server-rendered Hero) so the H1 copy paints without waiting for WebGL.
export function HeroGlobe() {
  return (
    <div
      aria-hidden
      className="relative min-h-[300px] overflow-hidden bg-[#050d1f] max-[360px]:min-h-[240px] sm:min-h-[340px] md:min-h-[360px] lg:min-h-0 xl:min-h-0"
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Meteors number={20} />
      </div>
      <div className="absolute inset-0 z-10">
        <Globe className="m-auto" config={HERO_GLOBE_CONFIG} />
      </div>
    </div>
  );
}
