import { Mail, Phone, Star } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AuroraText } from "@/components/ui/aurora-text";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

const ctaAvatars = [
  {
    imageUrl: "/recommendations/2marketing.jpg",
    profileUrl: "https://2marketing.ai",
    name: "2Marketing.ai",
  },
  {
    imageUrl: "/recommendations/thomas-bach-petersen.jpg",
    profileUrl: "https://2ai.dk",
    name: "Thomas Bach Petersen — 2ai",
  },
  {
    imageUrl: "/recommendations/dimitry-bizga.jpg",
    profileUrl: "https://synthax.codes",
    name: "Dimitry Bizga — Synthax Codes",
  },
  {
    imageUrl: "/recommendations/vasile-borogan.jpg",
    profileUrl: "https://primeinvest.md",
    name: "Vasile Borogan — Premier Invest",
  },
  {
    imageUrl: "/recommendations/redcore.jpg",
    profileUrl: "https://redcoreconcrete.com",
    name: "Red Core Concrete",
  },
  {
    imageUrl: "/recommendations/palazzo-aesthetics.svg",
    profileUrl: "https://palazzoaesthetics.md/",
    name: "Palazzo Aesthetics",
    className: "bg-[#f2eee4]",
  },
  {
    imageUrl: "/recommendations/inesa-dita.webp",
    profileUrl: "https://www.compass.com/agents/inesa-dita/",
    name: "Inesa Dita — Real Estate Agent",
  },
];

export function ContactCta() {
  return (
    <section
      id="contact"
      className="relative flex min-h-svh min-h-dvh scroll-mt-[72px] items-start overflow-hidden bg-background py-10 md:h-svh md:h-dvh md:items-center md:py-0"
    >
      {/* top transition — smooth, no border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background via-background/60 to-transparent sm:h-20"
      />
      {/* right half background — expands fully to viewport right edge on md+ — base layout effect */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 overflow-hidden bg-secondary/[0.35] md:block"
      >
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_88%,transparent)]">
          <AnimatedGridPattern
            width={40}
            height={40}
            numSquares={30}
            maxOpacity={0.4}
            duration={3}
            repeatDelay={0.5}
            className="stroke-foreground/[0.07] text-primary/[0.2] [mask-image:radial-gradient(640px_circle_at_70%_35%,white,transparent)]"
          />
        </div>
      </div>
      <div className="relative mx-auto grid w-full max-w-7xl gap-6 md:grid-cols-2 md:gap-0 xl:max-w-[88rem]">
        {/* left — form */}
        <div className="order-2 flex items-center px-4 py-6 sm:px-8 sm:py-8 md:order-1 lg:px-12">
          <div className="w-full max-w-xl rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:rounded-[2.5rem] sm:p-8">
            <h3 className="text-center text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Tell us your idea
            </h3>
            <p className="mx-auto mt-2 max-w-md text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
              <span className="block">Tell us about your project.</span>
              <span className="block">We reply honestly, usually within a day.</span>
            </p>
            <ContactForm className="mt-6" />
          </div>
        </div>

        {/* right — testimonials / 5 stars — more forth, fully expanded right */}
        <div className="relative isolate order-1 flex flex-col justify-center overflow-hidden bg-secondary/[0.35] px-4 py-6 sm:px-8 sm:py-8 md:order-2 md:bg-transparent md:py-12 lg:px-12 lg:py-0">
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_88%,transparent)] md:hidden">
            <AnimatedGridPattern
              width={40}
              height={40}
              numSquares={30}
              maxOpacity={0.4}
              duration={3}
              repeatDelay={0.5}
              className="stroke-foreground/[0.07] text-primary/[0.2] [mask-image:radial-gradient(640px_circle_at_70%_35%,white,transparent)]"
            />
          </div>
          <h3 className="mx-auto mt-2 w-full max-w-4xl pb-1 text-center text-3xl font-bold leading-[1.1] tracking-tight text-foreground text-balance sm:text-4xl md:mx-0 md:mt-3 md:text-left">
            Your{" "}
            <AuroraText colors={AURORA_COLORS} speed={1}>
              project
            </AuroraText>
          </h3>
          <div className="mt-3 h-px w-16 bg-border md:mt-5" />
          <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/80 sm:text-lg md:mt-5 md:text-xl">
            This is the space where your ideas that have not been revealed
            yet live, whether good or crazy. Just tell us what you would
            like to build, and we shall be frank about it.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3 md:mt-8 md:gap-x-5">
            <AvatarCircles
              avatarUrls={ctaAvatars}
              className="-space-x-4"
              avatarClassName="size-9 sm:size-10 md:size-12"
            />
            <div
              className="flex items-center gap-1"
              aria-label="Rated 5 out of 5 by our clients"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400 md:size-5"
                  strokeWidth={0}
                  aria-hidden
                />
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Trusted by clients worldwide
          </p>
          <div className="mt-6 space-y-4 md:mt-7">
            <a
              href="mailto:hello@devalon.dev"
              className="flex w-fit items-center gap-3 text-base font-normal transition-colors hover:text-foreground sm:text-lg"
            >
              <Mail
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden
              />
              <AuroraText colors={AURORA_COLORS} speed={1}>
                hello@devalon.dev
              </AuroraText>
            </a>
            <a
              href="tel:+37367500054"
              className="flex w-fit items-center gap-3 text-base font-normal transition-colors hover:text-foreground sm:text-lg"
            >
              <Phone
                className="size-5 text-primary"
                strokeWidth={2}
                aria-hidden
              />
              <AuroraText colors={AURORA_COLORS} speed={1}>
                +373 675 00 054
              </AuroraText>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
