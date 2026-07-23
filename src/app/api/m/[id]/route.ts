import { NextRequest } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import manifest from "@/features/Checkout/data/media-manifest.json";

export const dynamic = "force-dynamic";

const PRIVATE_DIR = join(process.cwd(), "private-media");
const MANIFEST = manifest as Record<string, { path: string; mime: string }>;

const isSameSiteRequest = (request: NextRequest): boolean => {
    const site = request.headers.get("sec-fetch-site");
    if (site) {
        return site === "same-origin" || site === "same-site";
    }
    const referer = request.headers.get("referer");
    if (!referer) return false;
    try {
        return new URL(referer).host === request.headers.get("host");
    } catch {
        return false;
    }
};

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
): Promise<Response> {
    if (!isSameSiteRequest(request)) {
        return new Response("Forbidden", { status: 403 });
    }

    const entry = MANIFEST[params.id];
    if (!entry) {
        return new Response("Not found", { status: 404 });
    }

    let data: Buffer;
    try {
        data = await readFile(join(PRIVATE_DIR, entry.path));
    } catch {
        return new Response("Not found", { status: 404 });
    }

    const total = data.length;
    const range = request.headers.get("range");

    if (range) {
        const match = /bytes=(\d+)-(\d*)/.exec(range);
        if (match) {
            const start = Number(match[1]);
            const end = match[2] ? Number(match[2]) : total - 1;
            if (start <= end && end < total) {
                const chunk = data.subarray(start, end + 1);
                return new Response(new Uint8Array(chunk), {
                    status: 206,
                    headers: {
                        "Content-Type": entry.mime,
                        "Content-Range": `bytes ${start}-${end}/${total}`,
                        "Accept-Ranges": "bytes",
                        "Content-Length": String(chunk.length),
                        "Cache-Control": "private, max-age=3600",
                    },
                });
            }
        }
    }

    return new Response(new Uint8Array(data), {
        headers: {
            "Content-Type": entry.mime,
            "Accept-Ranges": "bytes",
            "Content-Length": String(total),
            "Cache-Control": "private, max-age=3600",
        },
    });
}
