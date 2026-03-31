import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".webm"]);
const IMAGE_LIMIT = 1.5 * 1024 * 1024;
const VIDEO_LIMIT = 8 * 1024 * 1024;

const LEGACY_ALLOWLIST = new Set([
  "public/118561-1.jpg.jpg",
  "public/arab.mp4",
  "public/blurred-light-bulbs.jpg",
  "public/dj.jpg",
  "public/pexels-ardit-mbrati-216809103-16966362.jpg",
  "public/pexels-leeloothefirst-7598011.jpg",
  "public/pexels-pavel-danilyuk-6405773.jpg",
  "public/VIBEUP.mp4",
  "public/VIBEUP21.jpeg",
  "public/VIBEUP23.jpeg",
  "public/VIBEUP25.jpeg",
  "public/VIBEUP26.jpeg",
  "public/VIBEUP1.mp4",
  "public/VIBEUP2.mp4",
  "public/VIBEUP9.mp4",
  "public/vibeup-logo.png",
  "public/widding.jpg",
]);

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

function getLimit(filePath) {
  const extension = path.extname(filePath).toLowerCase();

  if (IMAGE_EXTENSIONS.has(extension)) {
    return IMAGE_LIMIT;
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return VIDEO_LIMIT;
  }

  return null;
}

async function main() {
  const filePaths = await walk(PUBLIC_DIR);
  const violations = [];
  const legacyDebt = [];

  for (const filePath of filePaths) {
    const limit = getLimit(filePath);

    if (!limit) {
      continue;
    }

    const relativePath = toRelative(filePath);
    const stats = await fs.stat(filePath);

    if (stats.size <= limit) {
      continue;
    }

    if (LEGACY_ALLOWLIST.has(relativePath)) {
      legacyDebt.push({ relativePath, size: stats.size, limit });
      continue;
    }

    violations.push({ relativePath, size: stats.size, limit });
  }

  if (legacyDebt.length) {
    console.warn("\nLegacy oversized assets still in repo:");
    for (const entry of legacyDebt) {
      console.warn(
        `- ${entry.relativePath} is ${formatMegabytes(entry.size)} (budget ${formatMegabytes(entry.limit)})`,
      );
    }
  }

  if (violations.length) {
    console.error("\nAsset budget violations:");
    for (const entry of violations) {
      console.error(
        `- ${entry.relativePath} is ${formatMegabytes(entry.size)} (budget ${formatMegabytes(entry.limit)})`,
      );
    }
    process.exit(1);
  }

  console.log("\nAsset budgets passed. No new oversized media files detected.");
}

main().catch((error) => {
  console.error("Asset budget check failed", error);
  process.exit(1);
});
