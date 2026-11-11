"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { MetaPixel } from "@/components/meta-pixel";
import { GtmScript } from "@/components/gtm-script";
import { trackPageView } from "@/lib/tracking";

function AutoPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();

  useEffect(() => {
    trackPageView();
  }, [pathname, search]);

  return null;
}

export function TrackingProvider() {
  return (
    <>
      <MetaPixel />
      <GtmScript />
      <Suspense fallback={null}>
        <AutoPageView />
      </Suspense>
    </>
  );
}