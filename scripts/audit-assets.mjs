import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return walk(fullPath);
      }

      return fullPath;
    }),
  );

  return files.flat();
}

function toRelative(filePath) {
  return path.relative(ROOT, filePath).replaceAll(path.sep, "/");
}

function formatMegabytes(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function readMetadata(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (!IMAGE_EXTENSIONS.has(extension)) {
    return null;
  }

  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || extension.replace(".", ""),
    };
  } catch {
    return null;
  }
}

function classify(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (IMAGE_EXTENSIONS.has(extension)) {
    return "image";
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return "video";
  }

  return "other";
}

async function main() {
  const filePaths = await walk(PUBLIC_DIR);
  const entries = await Promise.all(
    filePaths.map(async (filePath) => {
      const stats = await fs.stat(filePath);
      const type = classify(filePath);
      const metadata = await readMetadata(filePath);

      return {
        filePath,
        relativePath: toRelative(filePath),
        type,
        bytes: stats.size,
        metadata,
      };
    }),
  );

  const sortedBySize = [...entries].sort((a, b) => b.bytes - a.bytes);
  const totals = entries.reduce(
    (accumulator, entry) => {
      accumulator[entry.type] += entry.bytes;
      return accumulator;
    },
    { image: 0, video: 0, other: 0 },
  );

  console.log("\nVibeUp asset audit\n");
  console.log(`Images: ${formatMegabytes(totals.image)}`);
  console.log(`Videos: ${formatMegabytes(totals.video)}`);
  console.log(`Other:  ${formatMegabytes(totals.other)}\n`);

  console.log("Largest assets:");

  for (const entry of sortedBySize.slice(0, 20)) {
    const dimensions =
      entry.metadata && entry.metadata.width && entry.metadata.height
        ? ` · ${entry.metadata.width}x${entry.metadata.height}`
        : "";

    console.log(
      `- ${entry.relativePath} · ${entry.type} · ${formatMegabytes(entry.bytes)}${dimensions}`,
    );
  }

  const criticalEntries = sortedBySize.filter((entry) => {
    if (entry.type === "video") {
      return entry.bytes > 8 * 1024 * 1024;
    }

    if (entry.type === "image") {
      return entry.bytes > 1.5 * 1024 * 1024;
    }

    return false;
  });

  if (criticalEntries.length) {
    console.log("\nCritical budget risks:");
    for (const entry of criticalEntries) {
      console.log(`- ${entry.relativePath} (${formatMegabytes(entry.bytes)})`);
    }
  } else {
    console.log("\nNo assets exceed the default critical thresholds.");
  }
}

main().catch((error) => {
  console.error("Asset audit failed", error);
  process.exit(1);
});
