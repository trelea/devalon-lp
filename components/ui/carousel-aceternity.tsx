"use client";

import { IconArrowNarrowRight } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SlideData {
  title: string;
  client: string;
  src: string;
  description: string;
  metrics?: { value: string; label: string }[];
  highlights?: string[];
  href?: string;
}

interface SlideProps {
  slide: SlideData;
  index?: number;
  current?: number;
  handleSlideClick?: (index: number) => void;
}

export const Slide = ({
  slide,
  index = 0,
  current = 0,
  handleSlideClick = () => {},
}: SlideProps) => {
  const slideRef = useRef<HTMLLIElement>(null);
  const xRef = useRef(0);
  const yRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      if (slideRef.current) {
        slideRef.current.style.setProperty("--x", `${xRef.current}px`);
        slideRef.current.style.setProperty("--y", `${yRef.current}px`);
      }
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent) => {
    const el = slideRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    xRef.current = event.clientX - (r.left + Math.floor(r.width / 2));
    yRef.current = event.clientY - (r.top + Math.floor(r.height / 2));
  };

  const handleMouseLeave = () => {
    xRef.current = 0;
    yRef.current = 0;
  };

  const { src, title, client, description, metrics, highlights, href } = slide;

  return (
    <div className="w-screen shrink-0 flex justify-center items-center md:w-[50vw] xl:w-[46vw]">
      <div className="w-full max-w-[640px] px-3 md:px-4 xl:px-3">
        <li
          ref={slideRef}
          className="flex flex-col bg-white rounded-4xl lg:rounded-[40px] overflow-hidden w-full h-full xl:h-[560px] transition-all duration-500 ease-in-out cursor-pointer border border-white/60 shadow-[0_16px_40px_-12px_rgba(15,23,42,0.22)]"
          onClick={() => handleSlideClick(index)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: current !== index ? "scale(0.96)" : "scale(1)",
            opacity: current !== index ? 0.82 : 1,
            transformOrigin: "bottom",
          }}
        >
          {/* left: image */}
          <div className="w-full shrink-0 relative flex">
            <div className="w-full h-64 sm:h-72 xl:h-[320px] group overflow-hidden rounded-4xl lg:rounded-[40px] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={title}
                width={1000}
                height={1000}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-in-out"
                style={{ opacity: 1 }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-black/75 pointer-events-none" />
            </div>
            <div className="absolute bottom-5 left-6 md:bottom-7 md:left-8 z-20">
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/80">
                {client}
              </p>
              <p className="mt-1 text-lg font-semibold leading-tight text-white md:text-xl">
                {title}
              </p>
            </div>
          </div>

          {/* right: copy */}
          <div className="flex flex-1 flex-col justify-between gap-5 px-6 py-6 sm:p-6 lg:p-6 xl:py-6">
            <div>
              <p className="text-[11px] font-medium tracking-[0.14em] uppercase text-muted-foreground">
                {client}
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-foreground lg:text-2xl xl:text-[1.7rem]">
                {title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
              {highlights && highlights.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {highlights.map((h) => {
                    const colon = h.indexOf(": ");
                    const lead = colon > 0 ? h.slice(0, colon) : null;
                    const rest = colon > 0 ? h.slice(colon + 2) : h;
                    return (
                      <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>
                          {lead && <span className="font-medium text-foreground/90">{lead}: </span>}
                          {rest}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              {metrics && metrics.length > 0 && (
                <div className="flex flex-row gap-8 sm:gap-10">
                  {metrics.map((m, idx) => (
                    <div key={idx} className="flex flex-col">
                      <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                        {m.value}
                      </p>
                      <p className="mt-1 whitespace-pre-line text-xs leading-tight text-muted-foreground sm:text-sm">
                        {m.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              {href ? (
                <Button
                  asChild
                  className="h-10 w-fit shrink-0 rounded-full bg-[#4e6cb8] px-5 text-sm font-semibold text-white shadow-md shadow-[#4e6cb8]/20 hover:bg-[#4e6cb8]/90 border-0"
                >
                  <Link href={href} target="_blank" rel="noopener noreferrer">
                    Visit site
                    <ArrowUpRight className="size-4" />
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </li>
      </div>
    </div>
  );
};

interface CarouselControlProps {
  type: "previous" | "next";
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({ type, title, handleClick }: CarouselControlProps) => {
  return (
    <button
      className="flex size-10 items-center justify-center rounded-full bg-white shadow-md border border-border/60 hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={title}
      onClick={handleClick}
      type="button"
    >
      <IconArrowNarrowRight className={cn("size-5 text-foreground/70", type === "previous" && "rotate-180")} />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
  autoPlay?: boolean;
  startOnSlide?: number;
  endOnSlide?: number;
}

export function CarouselAceternity({
  slides,
  autoPlay = false,
  startOnSlide = 0,
  endOnSlide = slides.length,
}: CarouselProps) {
  const [current, setCurrent] = useState(startOnSlide);
  const [slideWidth, setSlideWidth] = useState(100);
  const [viewportWidth, setViewportWidth] = useState(1280);

  useEffect(() => {
    const update = () => {
      setViewportWidth(window.innerWidth);
      if (window.innerWidth >= 1280) setSlideWidth(46);
      else if (window.innerWidth >= 768) setSlideWidth(50);
      else setSlideWidth(100);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => handleNextClick(), 7000);
    return () => clearInterval(id);
  }, [current, autoPlay]);

  // 2 cards per view: keep a small 1.5vw left inset, no centering
  const centerOffset = slideWidth === 100 ? 0 : 1.5;

  const handlePreviousClick = () =>
    setCurrent((c) => (c - 1 < startOnSlide ? endOnSlide - 1 : c - 1));

  const handleNextClick = () =>
    setCurrent((c) => (c + 1 >= endOnSlide ? startOnSlide : c + 1));

  const handleSlideClick = (index: number) => {
    if (current !== index) setCurrent(index);
  };

  const id = useId();

  return (
    <div className="relative w-max py-4 sm:py-6" aria-labelledby={`carousel-heading-${id}`}>
      <div className="relative w-max overflow-hidden">
        <ul
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{
            transform:
              current === 0
                ? `translateX(${viewportWidth > 1279 ? "1.5vw" : "0"})`
                : `translateX(-${current * slideWidth - centerOffset}vw)`,
          }}
        >
          {slides.map((slide, index) => (
            <Slide
              key={`${slide.title}-${index}`}
              slide={slide}
              index={index}
              current={current}
              handleSlideClick={handleSlideClick}
            />
          ))}
        </ul>
      </div>

      <div className="flex w-screen items-center justify-center gap-4 mt-6 sm:mt-8">
        <CarouselControl type="previous" title="Go to previous slide" handleClick={handlePreviousClick} />
        <CarouselControl type="next" title="Go to next slide" handleClick={handleNextClick} />
      </div>
    </div>
  );
}
