import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { AccessScope } from "@/server/access-token";
import { createPayment } from "@/server/payments-store";
import { requestBind } from "@/server/request-fingerprint";
import { randomCustomer } from "@/server/customers";

export const dynamic = "force-dynamic";

const isValidScope = (scope: unknown): scope is AccessScope =>
    scope === "subscription" ||
    scope === "mimo" ||
    (typeof scope === "string" && scope.startsWith("photo:"));

const describe = (scope: AccessScope, creator: string): string => {
    if (scope === "subscription") return `Assinatura ${creator}`;
    if (scope === "mimo") return `Mimo para ${creator}`;
    return `Desbloqueio de mídia ${creator}`;
};

const webhookUrl = (): string | undefined => {
    const base = process.env.PARADISE_PUBLIC_URL?.trim();
    return base ? `${base.replace(/\/$/, "")}/api/payments/webhook` : undefined;
};

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = (await request.json().catch(() => null)) as {
        scope?: unknown;
        creator?: unknown;
        amountCents?: unknown;
    } | null;

    if (!body || !isValidScope(body.scope)) {
        return NextResponse.json({ error: "invalid_scope" }, { status: 400 });
    }

    const amountCents =
        typeof body.amountCents === "number" && body.amountCents > 0
            ? Math.round(body.amountCents)
            : 0;
    if (amountCents <= 0) {
        return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }
    const creator =
        typeof body.creator === "string" && body.creator.trim()
            ? body.creator
            : "witchpleasure";

    let payment;
    try {
        payment = await createPayment({
            scope: body.scope,
            creator,
            amountCents,
            bind: requestBind(request),
            description: describe(body.scope, creator),
            customer: randomCustomer(),
            postbackUrl: webhookUrl(),
        });
    } catch {
        return NextResponse.json({ error: "gateway_error" }, { status: 502 });
    }

    let qrImage = payment.qrCodeBase64
        ? payment.qrCodeBase64.startsWith("data:")
            ? payment.qrCodeBase64
            : `data:image/png;base64,${payment.qrCodeBase64}`
        : "";
    if (!qrImage && payment.pixCode) {
        try {
            qrImage = await QRCode.toDataURL(payment.pixCode, {
                margin: 1,
                width: 220,
            });
        } catch {
            qrImage = "";
        }
    }

    return NextResponse.json({
        id: payment.id,
        scope: payment.scope,
        amountCents: payment.amountCents,
        pixCode: payment.pixCode,
        qrImage,
        status: "pending",
    });
}
