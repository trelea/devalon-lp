import { AuroraText } from "@/components/ui/aurora-text";
import { MagicCard } from "@/components/ui/magic-card";
import { NumberTicker } from "@/components/ui/number-ticker";
import { stats } from "@/lib/stats";

const AURORA_COLORS = ["#3B4354", "#4e6cb8", "#7196E0", "#5b7fd4"];

// Full-viewport trust band between Hero and Services: the four studio
// numbers as tall centered spotlight cards. Light cards bridge the white
// Hero card above and the dark Services tabs below.
export function Stats() {
  return (
    <section
      aria-label="Devalon in numbers"
      className="flex min-h-svh min-h-dvh w-screen max-w-full items-center justify-center bg-transparent"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:gap-12 sm:px-5 sm:py-20 xl:max-w-[88rem]">
        <h2 className="mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">
          Devalon in{" "}
          <AuroraText colors={AURORA_COLORS} speed={1}>
            numbers
          </AuroraText>
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <MagicCard
              key={stat.label}
              gradientFrom="#4e6cb8"
              gradientTo="#7196E0"
              gradientColor="rgba(113,150,224,0.18)"
              className="h-full rounded-[2rem] shadow-[0_10px_30px_-12px_rgba(59,67,84,0.25)]"
            >
              <article className="flex h-full min-h-[20rem] flex-col items-center justify-center gap-4 p-8 text-center sm:min-h-[24rem] sm:p-10">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/[0.08] ring-1 ring-border sm:size-16">
                  <stat.icon
                    className="size-7 text-primary sm:size-8"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                </span>
                <p className="mt-4 flex h-16 items-center text-5xl font-bold tracking-tight text-foreground tabular-nums sm:mt-6 sm:h-20 sm:text-6xl">
                  <NumberTicker value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="flex min-h-[3rem] items-center text-lg font-semibold tracking-tight text-foreground sm:min-h-[3.5rem] sm:text-xl">
                  {stat.label}
                </p>
                <div aria-hidden className="h-px w-full bg-border" />
                <p className="flex min-h-[2.75rem] items-start text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {stat.sub}
                </p>
              </article>
            </MagicCard>
          ))}
        </div>
      </div>
    </section>
  );
}
