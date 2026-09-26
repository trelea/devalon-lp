"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import Autoplay from "embla-carousel-autoplay";
import { IconArrowNarrowRight } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { AuroraText } from "@/components/ui/aurora-text";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

type Tab = {
  title: string;
  value: string;
  content?: React.ReactNode;
};

const AUTOPLAY_DELAY = 10000;

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

export const Tabs = ({
  tabs: propTabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
  contentClassName,
  switchToLargeDevices = "lg",
}: {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  switchToLargeDevices?: "lg" | "xl" | "2xl";
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [progressKey, setProgressKey] = useState(0);

  // Autoplay plugin instance (stable across renders)
  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnFocusIn: false,
      }),
    [],
  );
  const plugins = useMemo(() => [autoplay], [autoplay]);
  // stable carousel options — a fresh object every render would make
  // embla destroy + re-create the carousel on each autoplay tick
  const carouselOpts = useMemo(
    () => ({ align: "center" as const, loop: true, dragFree: false }),
    [],
  );

  const resetAutoplay = () => {
    autoplay.reset();
    setProgressKey((prev) => prev + 1);
  };

  const goToNextTab = () => {
    if (api) {
      api.scrollNext();
      resetAutoplay();
    }
  };

  const goToPrevTab = () => {
    if (api) {
      api.scrollPrev();
      resetAutoplay();
    }
  };

  const goToTab = (index: number) => {
    if (api) {
      api.scrollTo(index);
      resetAutoplay();
    }
  };

  // Listen to carousel selection changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
      // Reset progress bar when carousel auto-advances
      setProgressKey((prev) => prev + 1);
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
      {/* Mobile: Show only current tab indicator */}
      <div
        className={cn(
          "w-full px-4",
          switchToLargeDevices === "lg" ? "lg:hidden" : "xl:hidden",
        )}
      >
        <div className="relative flex w-full items-center justify-center">
          <button
            onClick={() => goToTab(currentIndex)}
            className={cn(
              "relative flex h-fit w-full items-center justify-start overflow-hidden pb-4 transition-all duration-300 ease-in-out lg:px-4",
              tabClassName,
            )}
          >
            <div className="flex flex-row items-end gap-2 font-nav lg:pb-2">
              <span className="relative text-lg font-medium text-black dark:text-foreground">
                {currentIndex + 1}
              </span>
              <span className="relative text-lg font-medium">
                <AuroraText colors={AURORA_COLORS} speed={1}>
                  {propTabs[currentIndex].title}
                </AuroraText>
              </span>
            </div>
            {/* Background indicator */}
            <motion.div
              layoutId="clickedbutton-mobile"
              transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
              className={cn(
                "absolute right-0 bottom-0 left-0 h-1 w-full overflow-hidden rounded-full bg-foreground/5 shadow dark:bg-zinc-800",
                activeTabClassName,
              )}
            />
            {/* Progress bar */}
            <motion.div
              key={`progress-mobile-${progressKey}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{
                duration: AUTOPLAY_DELAY / 1000,
                ease: "linear",
                repeat: 0,
              }}
              className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-full bg-primary"
            />
          </button>
        </div>
      </div>

      {/* Desktop: Show all tabs */}
      <div
        className={cn(
          "relative w-full max-w-full flex-row items-center justify-start overflow-auto [perspective:1000px] [scrollbar-width:none] sm:overflow-visible [&::-webkit-scrollbar]:hidden",
          switchToLargeDevices === "lg" ? "hidden lg:flex" : "hidden xl:flex",
          containerClassName,
        )}
      >
        {propTabs.map((tab, idx) => (
          <button
            key={tab.value || `tab-${idx}`}
            onClick={() => goToTab(idx)}
            className={cn(
              "relative flex h-fit w-full items-center justify-start overflow-hidden pb-2 transition-all duration-300 ease-in-out",
              tabClassName,
            )}
          >
            <div className="flex flex-row items-end gap-2 pb-2 font-nav">
              <span
                className={cn(
                  "relative text-lg font-medium text-foreground/50",
                  currentIndex === idx &&
                    "text-black dark:text-foreground",
                )}
              >
                {idx + 1}
              </span>
              <span
                className={cn(
                  "relative text-lg font-medium text-foreground/50",
                  currentIndex === idx && "text-foreground",
                )}
              >
                {currentIndex === idx ? (
                  <AuroraText colors={AURORA_COLORS} speed={1}>
                    {tab.title}
                  </AuroraText>
                ) : (
                  tab.title
                )}
              </span>
            </div>
            <motion.div
              className={cn(
                "absolute right-0 bottom-0 left-0 h-1 w-full overflow-hidden rounded-full bg-foreground/10 shadow",
                activeTabClassName,
              )}
            />
            {currentIndex === idx && (
              /* Progress bar */
              <motion.div
                key={`progress-desktop-${progressKey}`}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{
                  duration: AUTOPLAY_DELAY / 1000,
                  ease: "linear",
                  repeat: 0,
                }}
                className="absolute bottom-0 left-0 h-1 w-full overflow-hidden rounded-full bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      {/* Carousel Content */}
      <div className={cn("flex w-full flex-col items-center", contentClassName)}>
        <Carousel
          setApi={setApi}
          plugins={plugins}
          className="w-full"
          opts={carouselOpts}
        >
          <div className="w-full">
            <CarouselContent className="-ml-2 lg:-ml-0">
              {propTabs.map((tab, index) => (
                <CarouselItem
                  key={tab.value || `tab-${index}`}
                  className="basis-[90%] pl-2 lg:basis-full lg:pl-0"
                >
                  <div className="w-full">
                    {tab.content}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>
        </Carousel>

        {/* Navigation Buttons - hidden on phones/small screens per request */}
        <div className="hidden relative items-center justify-center gap-4 lg:hidden">
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent bg-neutral-100 shadow-md transition duration-200 outline-none hover:-translate-y-0.5 focus:border-primary active:translate-y-0.5 dark:bg-neutral-800"
            title="Go to previous slide"
            onClick={goToPrevTab}
          >
            <IconArrowNarrowRight className="rotate-180 text-neutral-600 dark:text-neutral-200" />
          </button>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-transparent bg-neutral-100 shadow-md transition duration-200 outline-none hover:-translate-y-0.5 focus:border-primary active:translate-y-0.5 dark:bg-neutral-800"
            title="Go to next slide"
            onClick={goToNextTab}
          >
            <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
