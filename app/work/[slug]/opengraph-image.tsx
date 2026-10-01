import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { getWorkBySlug } from "@/lib/works";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type ImageProps = {
  params: Promise<{ slug: string }>;
};

// Per-case-study OG image: statically generated at build time per
// generateStaticParams of the parent segment.
export default async function WorkOpengraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  const name = work?.name ?? "Devalon case study";
  const client = work?.client ?? "Devalon";

  let logoSrc: string | undefined;
  try {
    const logo = await readFile(
      join(process.cwd(), "public/devalon-logos/light-txt.svg"),
      "base64",
    );
    logoSrc = `data:image/svg+xml;base64,${logo.toString()}`;
  } catch {
    logoSrc = undefined;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: 20,
          padding: 80,
          background: "linear-gradient(115deg, #13161d 0%, #1a2233 100%)",
        }}
      >
        <div style={{ fontSize: 28, color: "#7196e0" }}>{client}</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#eaf0eb",
            lineHeight: 1.1,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 26, color: "rgba(234,240,235,0.75)" }}>
          Devalon case study — from concept to production
        </div>
        {logoSrc ? (
          <img src={logoSrc} alt="" width={280} height={84} />
        ) : null}
      </div>
    ),
    size,
  );
}
