import { NextRequest, NextResponse } from "next/server";
import { getPaymentStatus } from "@/server/payments-store";

export const dynamic = "force-dynamic";

export async function GET(
    _request: NextRequest,
    { params }: { params: { id: string } },
): Promise<NextResponse> {
    const result = await getPaymentStatus(params.id);

    if (!result) {
        return NextResponse.json({ error: "not_found" }, { status: 404 });
    }

    return NextResponse.json(result);
}
