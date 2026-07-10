"use client";
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 **/

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
  className?: string;
  separator?: boolean;
  /** Render the icon filling the whole circle (e.g. for logos). */
  fullIcon?: boolean;
};

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: DockItem[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-full border border-border bg-background/80 px-3 py-1.5 shadow-lg shadow-black/30 backdrop-blur-xl md:hidden",
        className,
      )}
    >
      {items.map((item) =>
        item.separator ? (
          <div key={item.title} aria-hidden className="h-5 w-px bg-border" />
        ) : (
          <a
            key={item.title}
            href={item.href}
            aria-label={item.title}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary",
              item.className,
            )}
          >
            <div className={item.fullIcon ? "size-full" : "h-4 w-4"}>
              {item.icon}
            </div>
          </a>
        ),
      )}
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: DockItem[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-start gap-4 rounded-2xl border border-border bg-background/70 px-4 pt-3 shadow-lg shadow-black/30 backdrop-blur-xl md:flex",
        className,
      )}
    >
      {items.map((item) =>
        item.separator ? (
          <div
            key={item.title}
            aria-hidden
            className="h-8 w-px self-center bg-border"
          />
        ) : (
          <IconContainer mouseX={mouseX} key={item.title} {...item} />
        ),
      )}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
  className,
  fullIcon,
}: DockItem & {
  mouseX: MotionValue;
}) {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 54, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 54, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 26, 20]);
  let heightTransformIcon = useTransform(
    distance,
    [-150, 0, 150],
    [20, 26, 20],
  );

  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  let widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href} aria-label={title}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "relative flex aspect-square items-center justify-center rounded-full bg-secondary transition-colors hover:bg-accent",
          className,
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: -10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: -2, x: "-50%" }}
              className="absolute -bottom-8 left-1/2 w-fit rounded-md border border-border bg-popover px-2 py-0.5 text-xs whitespace-pre text-popover-foreground"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={fullIcon ? undefined : { width: widthIcon, height: heightIcon }}
          className={cn(
            "flex items-center justify-center",
            fullIcon && "size-full",
          )}
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
