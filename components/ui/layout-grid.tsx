"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type LayoutGridCard = {
  id: string;
  content: React.ReactNode;
  className?: string;
  thumbnail: string;
  alt?: string;
  /** always-visible overlay (e.g. title) on the collapsed card; full
      `content` still reveals in the click-to-expand modal. Omit for the
      original thumbnail-only behavior. */
  overlay?: React.ReactNode;
  /** numbered screenshots for the expanded dialog — rendered on the right side */
  gallery?: string[];
  shotLabels?: string[];
  href?: string;
};

export const LayoutGrid = ({
  cards,
  className,
  enableExpand = true,
  variant = "default",
  mobileScrollTarget = "work",
}: {
  cards: LayoutGridCard[];
  className?: string;
  enableExpand?: boolean;
  /** "split" = clean 50/50 dialog (How We Work): text left/top, image right/bottom */
  variant?: "default" | "split";
  /** id to keep visible on mobile open, or false to disable auto-scroll */
  mobileScrollTarget?: string | false;
}) => {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridCard | null>(
    null
  );

  const handleClick = (card: LayoutGridCard) => {
    if (!enableExpand) return;
    const isOpening = selected?.id !== card.id;
    // small devices only: scroll visibly more into section header
    // PC (>=1024px) untouched — runs only below lg
    if (
      isOpening &&
      mobileScrollTarget !== false &&
      typeof window !== "undefined" &&
      window.innerWidth < 1024
    ) {
      const el = document.getElementById(mobileScrollTarget);
      if (el) {
        // -72 navbar + -80 extra peek into Case Studies title
        const targetTop = el.getBoundingClientRect().top + window.scrollY - 72 - 80;
        // defer until after state update / motion layout so scroll isn't swallowed
        const doScroll = () => window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
        // immediate + rAF + timeout to beat motion animation on phones where scroll was swallowed
        doScroll();
        requestAnimationFrame(() => requestAnimationFrame(doScroll));
        setTimeout(doScroll, 120);
      }
    }
    setLastSelected(selected);
    setSelected(selected?.id === card.id ? null : card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div
      className={cn(
        "relative grid h-full w-full grid-cols-1 gap-4 auto-rows-[20rem] sm:gap-5 sm:auto-rows-[22rem] md:auto-rows-[24rem] lg:grid-cols-2 lg:auto-rows-fr lg:gap-6",
        className
      )}
    >
      {cards.map((card) => (
        <div key={card.id} className={cn(card.className)}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "group relative overflow-hidden",
              enableExpand ? "cursor-pointer" : "cursor-default",
              selected?.id === card.id
                ? "fixed inset-x-3 top-[2.5svh] bottom-auto z-[100] flex h-[92svh] w-auto flex-col overflow-hidden rounded-[1.25rem] sm:inset-x-4 sm:top-[2.5svh] lg:inset-0 lg:m-auto lg:h-[92svh] lg:w-[96vw] sm:rounded-[1.5rem] lg:rounded-[2rem] bg-white shadow-2xl"
                : lastSelected?.id === card.id
                  ? "z-40 h-full w-full rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] bg-secondary/40 shadow-[0_18px_45px_-18px_rgba(59,67,84,0.4)]"
                  : "h-full w-full rounded-[1.25rem] sm:rounded-[1.5rem] lg:rounded-[2rem] bg-secondary/40 shadow-[0_18px_45px_-18px_rgba(59,67,84,0.4)]"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id ? (
              <SelectedCard
                selected={selected}
                onClose={handleOutsideClick}
                variant={variant}
              />
            ) : (
              <ImageComponent card={card} />
            )}
            {card.overlay && selected?.id !== card.id && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/85 to-transparent p-5 sm:p-6">
                {card.overlay}
              </div>
            )}
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "fixed inset-0 z-[90] bg-black opacity-0",
          selected ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected ? 0.6 : 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: LayoutGridCard }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}`}
      src={card.thumbnail}
      height="500"
      width="500"
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
      alt={card.alt ?? "Project screenshot"}
    />
  );
};

const SelectedCard = ({
  selected,
  onClose,
  variant = "default",
}: {
  selected: LayoutGridCard | null;
  onClose?: () => void;
  variant?: "default" | "split";
}) => {
  if (!selected) return null;
  if (variant === "split") {
    return <SplitSelectedCard selected={selected} onClose={onClose} />;
  }
  return <DefaultSelectedCard selected={selected} onClose={onClose} />;
};

const SplitSelectedCard = ({
  selected,
  onClose,
}: {
  selected: LayoutGridCard;
  onClose?: () => void;
}) => {
  const gallery =
    selected.gallery && selected.gallery.length > 0
      ? selected.gallery
      : [selected.thumbnail];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
  }, [selected.id]);
  const total = gallery.length;
  const currentSrc = gallery[idx] ?? selected.thumbnail;
  const currentLabel = selected.shotLabels?.[idx];
  const touchStartX = useRef<number | null>(null);
  const goPrev = () => setIdx((p) => (p - 1 + total) % total);
  const goNext = () => setIdx((p) => (p + 1) % total);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative z-[60] flex h-full w-full flex-col overflow-y-auto bg-white lg:flex-row lg:overflow-hidden"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="absolute right-3 top-3 z-20 inline-flex size-8 items-center justify-center rounded-full bg-zinc-900/80 text-white backdrop-blur hover:bg-zinc-900 sm:right-4 sm:top-4"
      >
        <X className="size-4" />
      </button>
      <motion.div
        layoutId={`content-${selected.id}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full flex-none p-6 pt-12 sm:p-8 sm:pt-10 lg:h-full lg:w-1/2 lg:flex-none lg:p-12 lg:pt-12"
      >
        {selected.content}
      </motion.div>
      <div
        className="relative flex h-[38svh] min-h-[280px] w-full flex-none cursor-grab touch-pan-y flex-col items-center justify-center overflow-hidden active:cursor-grabbing lg:h-full lg:min-h-0 lg:w-1/2 lg:flex-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          if (touchStartX.current == null || total <= 1) return;
          const dx =
            (e.changedTouches[0]?.clientX ?? touchStartX.current) -
            touchStartX.current;
          if (dx <= -40) goNext();
          else if (dx >= 40) goPrev();
          touchStartX.current = null;
        }}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          aria-hidden="true"
          alt=""
          className="absolute inset-0 h-full w-full scale-[1.5] object-cover object-center blur-md brightness-75"
          loading="lazy"
        />
        {idx === 0 ? (
          <motion.img
            layoutId={`image-${selected.id}`}
            src={currentSrc}
            alt={currentLabel ?? selected.alt ?? "Project screenshot"}
            className="relative z-10 h-full w-full min-h-0 flex-1 object-contain object-center"
            loading="lazy"
            draggable={false}
          />
        ) : (
          <img
            src={currentSrc}
            alt={currentLabel ?? selected.alt ?? "Project screenshot"}
            className="relative z-10 h-full w-full min-h-0 flex-1 object-contain object-center"
            loading="lazy"
            draggable={false}
          />
        )}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={cn(
                  "size-3 rounded-full transition-colors",
                  i === idx
                    ? "bg-[#4e6cb8]"
                    : "bg-zinc-300 hover:bg-zinc-400"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const DefaultSelectedCard = ({
  selected,
  onClose,
}: {
  selected: LayoutGridCard;
  onClose?: () => void;
}) => {
  const gallery = selected.gallery && selected.gallery.length > 0 ? selected.gallery : [selected.thumbnail];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
  }, [selected.id]);
  const total = gallery.length;
  const goPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIdx((p) => (p - 1 + total) % total);
  };
  const goNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIdx((p) => (p + 1) % total);
  };
  const currentSrc = gallery[idx] ?? selected.thumbnail;
  const currentLabel = selected.shotLabels?.[idx];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="relative z-[60] flex h-full w-full flex-col overflow-y-auto rounded-[1.25rem] bg-white sm:rounded-[1.5rem] lg:rounded-[2rem] md:flex-row md:overflow-hidden"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        className="absolute right-3 top-3 z-20 inline-flex size-8 items-center justify-center rounded-full bg-zinc-900/80 text-white backdrop-blur hover:bg-zinc-900 sm:right-4 sm:top-4"
      >
        <X className="size-4" />
      </button>
      {/* Left — single-scroll on phones (accordion), split on md+ (tabs) — PC untouched */}
      <div className="flex w-full flex-none flex-col p-6 pt-12 sm:p-8 sm:pt-10 md:min-h-0 md:w-1/2 md:flex-1 md:overflow-y-auto lg:w-1/2 lg:overflow-hidden lg:p-12 lg:pt-12">
        <motion.div
          layoutId={`content-${selected.id}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex h-full flex-col overflow-visible lg:overflow-hidden"
        >
          {selected.content}
        </motion.div>
      </div>
      {/* Right — stacked below content on phones, side-by-side on md+ */}
      {total === 1 ? (
        <div className="flex w-full flex-none flex-col overflow-hidden bg-zinc-50 p-3 sm:p-4 md:min-h-0 md:w-1/2 md:flex-1 md:border-l md:border-zinc-100 md:bg-white md:p-0">
          <div className="relative flex justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-sm md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none">
            <motion.img
              layoutId={`image-${selected.id}`}
              src={currentSrc}
              alt={selected.alt ?? "Project screenshot"}
              className="h-auto max-h-[68svh] w-auto max-w-full object-contain object-center md:h-full md:w-full md:max-h-none md:max-w-none md:object-cover"
              loading="lazy"
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-none flex-col justify-center gap-3 bg-zinc-50 p-3 sm:p-4 md:min-h-0 md:w-1/2 md:flex-1 md:border-l md:border-zinc-100 md:p-5 lg:w-1/2">
          <div className="relative flex justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 shadow-sm">
            {idx === 0 ? (
              <motion.img
                layoutId={`image-${selected.id}`}
                src={currentSrc}
                alt={currentLabel ?? selected.alt ?? "Project screenshot"}
                className="h-auto max-h-[68svh] w-auto max-w-full object-contain object-center md:max-h-[72svh]"
                loading="lazy"
              />
            ) : (
              <img
                src={currentSrc}
                alt={currentLabel ?? selected.alt ?? "Project screenshot"}
                className="h-auto max-h-[68svh] w-auto max-w-full object-contain object-center md:max-h-[72svh]"
                loading="lazy"
              />
            )}
          {total > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrev}
                className="absolute left-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/70 text-white backdrop-blur hover:bg-zinc-900 sm:size-9"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goNext}
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/70 text-white backdrop-blur hover:bg-zinc-900 sm:size-9"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>
            </>
          )}
        </div>
        {total > 1 && (
          <div className="flex items-center justify-center gap-1.5">
            {gallery.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIdx(i);
                }}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-6 bg-zinc-900" : "w-1.5 bg-zinc-300 hover:bg-zinc-400",
                )}
              />
            ))}
          </div>
        )}
        <p className="text-center text-[11px] tracking-wide text-muted-foreground">
          {idx + 1} / {total}
        </p>
      </div>
        )}
    </div>
  );
};
