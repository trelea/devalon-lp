import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  ProjectsGrid,
  type ProjectWithSrc,
} from "@/components/sections/projects-grid";
import { getCoverSrc, works, type Work } from "@/lib/works";

type Shot = {
  src: string;
  label: string;
};


function availableShots(work: Work): Shot[] {
  if (!work.slug) return [];
  const dir = join(process.cwd(), "public", "works", work.slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => /\.(webp|avif|png|jpe?g)$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file, index) => ({
      src: `/works/${work.slug}/${file}`,
      label: work.shotLabels?.[index] ?? work.name,
    }));
}

function getGallerySrcs(work: Work): string[] {
  if (!work.slug) return [];
  const dir = join(process.cwd(), "public", "works", work.slug);
  if (!existsSync(dir)) return [];
  const numbered = readdirSync(dir)
    .filter((file) => /^\d+\.webp$/i.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => `/works/${work.slug}/${file}`);
  if (numbered.length > 0) return numbered;
  // fallback: any available shots except cover (should not happen)
  const shots = availableShots(work);
  return shots.map((s) => s.src).filter((src) => !src.endsWith("/cover.webp"));
}

export function Works() {
  const projects: ProjectWithSrc[] = works.map((work) => ({
    num: work.num,
    slug: work.slug,
    client: work.client,
    name: work.name,
    href: work.href,
    body: work.body,
    challenge: work.challenge,
    solution: work.solution,
    highlights: work.highlights,
    metrics: work.metrics,
    src: getCoverSrc(work),
    gallery: getGallerySrcs(work),
    shotLabels: work.shotLabels,
  }));

  return <ProjectsGrid projects={projects} />;
}
