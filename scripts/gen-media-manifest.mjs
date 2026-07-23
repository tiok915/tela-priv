import crypto from "node:crypto";
import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.cwd();
const PRIVATE_DIR = join(ROOT, "private-media");
const OUT = join(ROOT, "src/features/Checkout/data/media-manifest.json");

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp4": "video/mp4", ".webm": "video/webm" };

const walk = (dir) => {
    const out = [];
    for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) out.push(...walk(full));
        else out.push(full);
    }
    return out;
};

const prev = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const byPath = {};
for (const [id, entry] of Object.entries(prev)) byPath[entry.path] = id;

const manifest = {};
for (const file of walk(PRIVATE_DIR).sort()) {
    const path = relative(PRIVATE_DIR, file).split("\\").join("/");
    const id = byPath[path] ?? crypto.randomBytes(16).toString("hex");
    manifest[id] = { path, mime: MIME[extname(file).toLowerCase()] ?? "application/octet-stream" };
}

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${Object.keys(manifest).length} entries to ${relative(ROOT, OUT)}`);
