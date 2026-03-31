import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();

const tasks = [
  {
    src: "public/arabnights-1200.jpeg",
    outputs: [
      { dest: "public/arabnights-1200.webp", format: "webp", maxWidth: 1200, quality: 72 },
      { dest: "public/arabnights-1200.avif", format: "avif", maxWidth: 1200, quality: 52 },
    ],
  },
  {
    src: "public/stage-1600.jpg",
    outputs: [
      { dest: "public/stage-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/stage-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/fireworks-1600.jpg",
    outputs: [
      { dest: "public/fireworks-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/fireworks-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/VIBEUP22-1600.jpeg",
    outputs: [
      { dest: "public/VIBEUP22-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/VIBEUP22-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/VIBEUP21.jpeg",
    outputs: [
      { dest: "public/VIBEUP21-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/VIBEUP21-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/widding.jpg",
    outputs: [
      { dest: "public/wedding-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/wedding-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/dj.jpg",
    outputs: [
      { dest: "public/dj-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/dj-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/pexels-ardit-mbrati-216809103-16966362.jpg",
    outputs: [
      { dest: "public/artist-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/artist-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/pexels-pavel-danilyuk-6405773.jpg",
    outputs: [
      { dest: "public/production-1600.webp", format: "webp", maxWidth: 1600, quality: 72 },
      { dest: "public/production-1600.avif", format: "avif", maxWidth: 1600, quality: 52 },
    ],
  },
  {
    src: "public/vibeup-logo-512.png",
    outputs: [
      { dest: "public/vibeup-logo-512.webp", format: "webp", maxWidth: 512, quality: 82 },
      { dest: "public/vibeup-logo-512.avif", format: "avif", maxWidth: 512, quality: 60 },
    ],
  },
];

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureFreshOutput(sourcePath, outputPath) {
  const [sourceStats, outputExists] = await Promise.all([
    fs.stat(sourcePath),
    fileExists(outputPath),
  ]);

  if (!outputExists) {
    return true;
  }

  const outputStats = await fs.stat(outputPath);
  return sourceStats.mtimeMs > outputStats.mtimeMs;
}

async function main() {
  console.log("\nOptimizing image derivatives...\n");

  for (const task of tasks) {
    const sourcePath = path.join(ROOT, task.src);

    if (!(await fileExists(sourcePath))) {
      console.warn(`Skipping missing source: ${task.src}`);
      continue;
    }

    for (const output of task.outputs) {
      const destinationPath = path.join(ROOT, output.dest);
      const needsWrite = await ensureFreshOutput(sourcePath, destinationPath);

      if (!needsWrite) {
        console.log(`Up to date: ${output.dest}`);
        continue;
      }

      let pipeline = sharp(sourcePath).rotate().resize({
        width: output.maxWidth,
        withoutEnlargement: true,
      });

      if (output.format === "webp") {
        pipeline = pipeline.webp({ quality: output.quality, effort: 5 });
      } else {
        pipeline = pipeline.avif({ quality: output.quality, effort: 4 });
      }

      await pipeline.toFile(destinationPath);
      console.log(`Created: ${output.dest}`);
    }
  }
}

main().catch((error) => {
  console.error("Image optimization failed", error);
  process.exit(1);
});
