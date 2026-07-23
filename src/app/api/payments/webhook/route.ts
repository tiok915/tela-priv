import { NextRequest, NextResponse } from "next/server";
import { applyWebhook } from "@/server/payments-store";
import { activeGateway } from "@/server/gateway";
import { parseWebhookExternalId } from "@/server/wiinpay";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = (await request.json().catch(() => null)) as Record<
        string,
        unknown
    > | null;

    if (!body) {
        return NextResponse.json({ ok: true });
    }

    let externalId: string | null = null;

    if (activeGateway === "wiinpay") {
        externalId = parseWebhookExternalId(body);
    } else {
        externalId =
            typeof body.external_id === "string" ? body.external_id : null;
    }

    if (externalId) {
        await applyWebhook(externalId);
    }

    return NextResponse.json({ ok: true });
}
