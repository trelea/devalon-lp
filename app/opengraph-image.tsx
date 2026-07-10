import { readFileSync } from "node:fs"
import { join } from "node:path"
import { ImageResponse } from "next/og"

export const alt =
  "Devalon — Software & AI development and consulting. We turn ideas into working software."
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  const logo = readFileSync(
    join(process.cwd(), "public/devalon-logos/light-txt.svg")
  )
  const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 36,
          background: "linear-gradient(115deg, #13161d 0%, #1a2233 100%)",
        }}
      >
        {/* brand-blue glow, matching the footer */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -100,
            width: 700,
            height: 500,
            borderRadius: "50%",
            background: "rgba(113,150,224,0.16)",
            filter: "blur(120px)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={560} height={168} />
        <div
          style={{
            fontSize: 34,
            color: "rgba(234,240,235,0.82)",
            textAlign: "center",
          }}
        >
          Software, tech &amp; AI — we turn ideas into working software
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#7196e0",
          }}
        >
          For individuals, startups, and enterprises
        </div>
      </div>
    ),
    size
  )
}
