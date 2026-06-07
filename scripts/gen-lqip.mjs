// Build-time LQIP generator. Walks src/assets, makes a tiny blurred base64
// placeholder per image with sharp, and writes src/data/lqip.json keyed by the
// image's project-root path (e.g. "/src/assets/hero.png"). BlurImage.astro
// reads this map at render time so `sharp` never has to load inside the
// on-demand Cloudflare worker (where native modules don't exist).
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const ASSETS_DIR = path.join(ROOT, "src/assets");
const OUT = path.join(ROOT, "src/data/lqip.json");
const EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif"]);

const dirents = await readdir(ASSETS_DIR, {
  recursive: true,
  withFileTypes: true,
});

const map = {};
for (const d of dirents) {
  if (!d.isFile() || !EXT.has(path.extname(d.name).toLowerCase())) continue;
  const abs = path.join(d.parentPath ?? d.path, d.name);
  const key = "/" + path.relative(ROOT, abs).split(path.sep).join("/");
  try {
    const out = await sharp(await readFile(abs))
      .resize(24, 24, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();
    map[key] = `data:image/webp;base64,${out.toString("base64")}`;
  } catch (err) {
    console.warn(`[lqip] skipped ${key}: ${err.message}`);
  }
}

await writeFile(OUT, JSON.stringify(map));
console.log(
  `[lqip] wrote ${Object.keys(map).length} placeholders -> ${path.relative(ROOT, OUT)}`,
);
