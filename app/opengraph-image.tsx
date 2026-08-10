import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const logoData = readFileSync(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

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
          background: "#f6efdf",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "1px solid rgba(184,145,46,0.5)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 44,
            border: "1px solid rgba(184,145,46,0.5)",
            display: "flex",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={150} height={211} alt="" />
        <div
          style={{
            marginTop: 28,
            fontSize: 54,
            fontWeight: 700,
            color: "#241c12",
            display: "flex",
          }}
        >
          Emara Academy
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 26,
            color: "#1e4d3b",
            letterSpacing: 2,
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Building Communities That Keep New Muslims
        </div>
      </div>
    ),
    { ...size }
  );
}
