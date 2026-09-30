"use client";

import dynamic from "next/dynamic";

// Client boundary for the decorative globe: `ssr: false` is only allowed
// inside a Client Component, so the server-rendered Hero imports this
// wrapper statically while the WebGL chunk loads separately.
const HeroGlobeInner = dynamic(
  () => import("./hero-globe").then((mod) => mod.HeroGlobe),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="relative min-h-[300px] bg-[#050d1f] max-[360px]:min-h-[240px] sm:min-h-[340px] md:min-h-[360px] lg:min-h-0 xl:min-h-0"
      />
    ),
  },
);

export function HeroGlobeLazy() {
  return <HeroGlobeInner />;
}
