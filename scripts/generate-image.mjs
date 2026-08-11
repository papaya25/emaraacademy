#!/usr/bin/env node
// Generate images with Gemini 2.5 Flash Image ("Nano Banana") — free tier via Google AI Studio.
// Usage: node scripts/generate-image.mjs "<prompt>" [output-name] [--ref image1.png,image2.png] [--ratio 16:9]
//
// Reads GEMINI_API_KEY from .env.imagegen (gitignored, not part of the Next.js app env).
// Saves output PNG(s) into generated-images/ for review before adding to the site.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

function loadEnvKey() {
  const envPath = join(ROOT, ".env.imagegen");
  const content = readFileSync(envPath, "utf-8");
  const match = content.match(/^GEMINI_API_KEY=(.+)$/m);
  if (!match) throw new Error("GEMINI_API_KEY not found in .env.imagegen");
  return match[1].trim();
}

function parseArgs(argv) {
  const args = argv.slice(2);

  const refFlagIndex = args.findIndex((a) => a === "--ref");
  let refFiles = [];
  if (refFlagIndex !== -1) {
    refFiles = args[refFlagIndex + 1].split(",").map((s) => s.trim());
    args.splice(refFlagIndex, 2);
  }

  const ratioFlagIndex = args.findIndex((a) => a === "--ratio");
  let aspectRatio = null;
  if (ratioFlagIndex !== -1) {
    aspectRatio = args[ratioFlagIndex + 1];
    args.splice(ratioFlagIndex, 2);
  }

  const [prompt, outputName] = args;
  if (!prompt) {
    console.error(
      'Usage: node scripts/generate-image.mjs "<prompt>" [output-name] [--ref file1.png,file2.png] [--ratio 16:9]'
    );
    process.exit(1);
  }
  return { prompt, outputName: outputName || `image-${Date.now()}`, refFiles, aspectRatio };
}

async function main() {
  const apiKey = loadEnvKey();
  const { prompt, outputName, refFiles, aspectRatio } = parseArgs(process.argv);

  const parts = [{ text: prompt }];
  for (const f of refFiles) {
    const buf = readFileSync(f);
    const mimeType = f.endsWith(".jpg") || f.endsWith(".jpeg") ? "image/jpeg" : "image/png";
    parts.push({ inline_data: { mime_type: mimeType, data: buf.toString("base64") } });
  }

  const body = { contents: [{ parts }] };
  if (aspectRatio) {
    body.generationConfig = { imageConfig: { aspectRatio } };
  }

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Gemini API error ${res.status}: ${errText}`);
    process.exit(1);
  }

  const data = await res.json();
  const candidateParts = data?.candidates?.[0]?.content?.parts ?? [];
  const imageParts = candidateParts.filter((p) => p.inlineData || p.inline_data);

  if (!imageParts.length) {
    const textPart = candidateParts.find((p) => p.text);
    console.error("No image returned.", textPart ? `Model said: ${textPart.text}` : JSON.stringify(data));
    process.exit(1);
  }

  const outDir = join(ROOT, "generated-images");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  imageParts.forEach((part, i) => {
    const inline = part.inlineData || part.inline_data;
    const ext = (inline.mimeType || inline.mime_type || "image/png").includes("jpeg") ? "jpg" : "png";
    const suffix = imageParts.length > 1 ? `-${i + 1}` : "";
    const outPath = join(outDir, `${outputName}${suffix}.${ext}`);
    writeFileSync(outPath, Buffer.from(inline.data, "base64"));
    console.log(`Saved: ${outPath}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
