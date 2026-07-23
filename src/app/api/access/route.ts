import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/server/access-token";
import { requestBind } from "@/server/request-fingerprint";

export const dynamic = "force-dynamic";

export type AccessSummary = {
    subscription: boolean;
    unlockedPhotos: string[];
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = (await request.json().catch(() => null)) as {
        tokens?: unknown;
    } | null;

    const tokens = Array.isArray(body?.tokens)
        ? body!.tokens.filter((t): t is string => typeof t === "string")
        : [];

    const summary: AccessSummary = {
        subscription: false,
        unlockedPhotos: [],
    };

    const bind = requestBind(request);
    for (const token of tokens) {
        const payload = verifyAccessToken(token, bind);
        if (!payload) continue;

        if (payload.scope === "subscription") {
            summary.subscription = true;
        } else if (payload.scope.startsWith("photo:")) {
            const photoId = payload.scope.slice("photo:".length);
            if (photoId && !summary.unlockedPhotos.includes(photoId)) {
                summary.unlockedPhotos.push(photoId);
            }
        }
    }

    return NextResponse.json(summary);
}
