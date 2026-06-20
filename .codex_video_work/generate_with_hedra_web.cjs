const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const ROOT = "/Users/shereenmagdy/Documents/GitHub/vibeup";
const OUTDIR = path.join(ROOT, ".codex_video_work", "hedra_webgen");
fs.mkdirSync(OUTDIR, { recursive: true });

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const clips = [
  {
    name: "01-main-stage",
    image: path.join(ROOT, ".codex_video_work/fal_refs/ref_main_stage.jpg"),
    preset: "zoom-in",
    prompt: "slow cinematic push toward a luxury white beach party stage at golden sunset",
  },
  {
    name: "02-arrival",
    image: path.join(ROOT, ".codex_video_work/fal_refs/ref_arrival_mood.jpg"),
    preset: "pan-right",
    prompt: "elegant guests in white arrive beside palm trees, gentle gimbal drift",
  },
  {
    name: "03-luxury-venue",
    image: path.join(ROOT, ".codex_video_work/fal_refs/ref_luxury_venue.jpg"),
    preset: "ken-burns",
    prompt: "luxury tents, lanterns, Turkish carpets, warm cinematic camera reveal",
  },
  {
    name: "04-sunset-crowd",
    image: "/Users/shereenmagdy/Downloads/ChatGPT Image Jun 6, 2026, 06_25_12 AM.png",
    preset: "parallax",
    prompt: "sunset crowd dressed in white, ocean reflections and golden atmosphere",
  },
];

async function waitForDownloadBlob(page) {
  await page.waitForFunction(() => {
    const link = document.querySelector("#i2vDownload");
    return link && link.href && link.href.startsWith("blob:");
  }, { timeout: 30000 });

  return await page.evaluate(async () => {
    const link = document.querySelector("#i2vDownload");
    const response = await fetch(link.href);
    const arrayBuffer = await response.arrayBuffer();
    const bytes = Array.from(new Uint8Array(arrayBuffer));
    return { bytes, mime: response.headers.get("content-type") || "video/webm" };
  });
}

(async () => {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      "--autoplay-policy=no-user-gesture-required",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
    ],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  page.setDefaultTimeout(45000);
  await page.route("**/*", async (route) => {
    const url = route.request().url();
    if (
      url.includes("googlesyndication.com") ||
      url.includes("googletagmanager.com") ||
      url.includes("google-analytics.com") ||
      url.includes("doubleclick.net") ||
      url.includes("/cdn-cgi/challenge-platform/")
    ) {
      await route.abort();
      return;
    }
    await route.continue();
  });

  await page.goto("https://hedraai.app/image-to-video", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForSelector("#i2vFile", { timeout: 15000 });

  for (const clip of clips) {
    console.log(`Generating ${clip.name} via Hedra web app`);

    const clear = page.locator("#i2vClear");
    if (await clear.isVisible().catch(() => false)) {
      await clear.click().catch(() => {});
    }

    await page.setInputFiles("#i2vFile", clip.image);
    await page.locator(`button[data-preset="${clip.preset}"]`).click();
    await page.locator('button[data-sec="6"]').click();
    await page.locator("#i2vText").fill(clip.prompt);
    await page.locator("#i2vGenerate").click();

    const result = await waitForDownloadBlob(page);
    const outPath = path.join(OUTDIR, `${clip.name}.webm`);
    fs.writeFileSync(outPath, Buffer.from(result.bytes));
    console.log(`Saved ${outPath} (${result.bytes.length} bytes, ${result.mime})`);

    await page.locator("#i2vRedo").click().catch(() => {});
  }

  await browser.close();
  console.log(`Done: ${OUTDIR}`);
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
