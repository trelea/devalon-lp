import type { LucideIcon } from "lucide-react";
import { Award, Globe2, Layers, Rocket } from "lucide-react";

export type Stat = {
  value: number;
  suffix: string;
  label: string;
  sub: string;
  icon: LucideIcon;
};

// Single source of truth for the homepage stats band.
// Provenance:
// - "Projects shipped" and "Years building" are founder-provided totals
//   (they include client work not published as case studies).
// - lib/works.ts currently holds 9 published case studies — the documented
//   subset of the shipped total. Bump both together when new work ships.
// - Countries and niches are derived from works[].client in lib/works.ts:
//   USA, Denmark, Moldova, Romania (+ EU-wide logistics/green-tech).
export const stats: Stat[] = [
  {
    value: 20,
    suffix: "+",
    label: "Projects shipped to production",
    sub: "9 documented case studies",
    icon: Rocket,
  },
  {
    value: 5,
    suffix: "+",
    label: "Years building software",
    sub: "Design to production to scale",
    icon: Award,
  },
  {
    value: 4,
    suffix: "+",
    label: "Countries served",
    sub: "USA · Denmark · Moldova · Romania",
    icon: Globe2,
  },
  {
    value: 10,
    suffix: "+",
    label: "Industries & niches",
    sub: "SaaS · AI · Real estate · + more",
    icon: Layers,
  },
];
