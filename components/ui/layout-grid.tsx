"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export type LayoutGridCard = {
  id: string;
  content: React.ReactNode;
  className?: string;
  thumbnail: string;
  alt?: string;
};

export const LayoutGrid = ({
  cards,
  className,
}: {
  cards: LayoutGridCard[];
  className?: string;
}) => {
  const [selected, setSelected] = useState<LayoutGridCard | null>(null);
  const [lastSelected, setLastSelected] = useState<LayoutGridCard | null>(
    null
  );

  const handleClick = (card: LayoutGridCard) => {
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
        "relative grid h-full w-full auto-rows-fr grid-cols-2 gap-2",
        className
      )}
    >
      {cards.map((card) => (
        <div key={card.id} className={cn(card.className)}>
          <motion.div
            onClick={() => handleClick(card)}
            className={cn(
              card.className,
              "group relative cursor-pointer overflow-hidden",
              selected?.id === card.id
                ? "fixed inset-0 z-[100] m-auto flex h-[92svh] w-[96vw] flex-col justify-end rounded-xl bg-background/80"
                : lastSelected?.id === card.id
                  ? "z-40 h-full w-full rounded-lg bg-secondary/40"
                  : "h-full w-full rounded-lg bg-secondary/40"
            )}
            layoutId={`card-${card.id}`}
          >
            {selected?.id === card.id && <SelectedCard selected={selected} />}
            <ImageComponent card={card} isSelected={selected?.id === card.id} />
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

const ImageComponent = ({
  card,
  isSelected,
}: {
  card: LayoutGridCard;
  isSelected?: boolean;
}) => {
  return (
    <motion.img
      layoutId={`image-${card.id}`}
      src={card.thumbnail}
      height="500"
      width="500"
      loading="lazy"
      className={cn(
        "absolute inset-0 h-full w-full transition duration-500",
        isSelected
          ? "object-contain"
          : "object-cover object-top group-hover:scale-[1.03]"
      )}
      alt={card.alt ?? "Project screenshot"}
    />
  );
};

const SelectedCard = ({ selected }: { selected: LayoutGridCard | null }) => {
  return (
    <div className="relative z-[60] flex h-full w-full flex-col justify-end rounded-lg bg-transparent shadow-2xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="absolute inset-0 z-10 h-full w-full bg-black"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-[70] px-6 pb-5"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
