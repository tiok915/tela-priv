import crypto from "node:crypto";
import type { NextRequest } from "next/server";

const SECRET =
    process.env.ACCESS_TOKEN_SECRET ?? "dev-insecure-access-secret";

export const clientIp = (request: NextRequest): string => {
    const xff = request.headers.get("x-forwarded-for");
    if (xff) return xff.split(",")[0].trim();
    return (
        request.headers.get("x-real-ip") ??
        (request as unknown as { ip?: string }).ip ??
        "0.0.0.0"
    );
};

export const requestBind = (request: NextRequest): string => {
    const ip = clientIp(request);
    const ua = request.headers.get("user-agent") ?? "";
    return crypto
        .createHmac("sha256", SECRET)
        .update(`${ip}|${ua}`)
        .digest("hex")
        .slice(0, 32);
};
