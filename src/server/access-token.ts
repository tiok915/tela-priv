import crypto from "node:crypto";

const SECRET =
    process.env.ACCESS_TOKEN_SECRET ?? "dev-insecure-access-secret";

export type AccessScope =
    | "subscription"
    | `photo:${string}`
    | "mimo";

export type AccessTokenPayload = {
    scope: AccessScope;
    creator: string;
    iat: number;
    exp: number;
    bind?: string;
};

const base64url = (input: Buffer | string): string => {
    const buf = typeof input === "string" ? Buffer.from(input, "utf8") : input;
    return buf
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const fromBase64url = (input: string): Buffer =>
    Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");

const sign = (body: string): string =>
    base64url(crypto.createHmac("sha256", SECRET).update(body).digest());

const safeEqual = (x: string, y: string): boolean => {
    if (x.length !== y.length) return false;
    let diff = 0;
    for (let i = 0; i < x.length; i += 1) {
        diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
    }
    return diff === 0;
};

export const signAccessToken = (payload: AccessTokenPayload): string => {
    const body = base64url(JSON.stringify(payload));
    return `${body}.${sign(body)}`;
};

export const verifyAccessToken = (
    token: string,
    expectedBind?: string,
): AccessTokenPayload | null => {
    const [body, signature] = token.split(".");
    if (!body || !signature) {
        return null;
    }

    if (!safeEqual(signature, sign(body))) {
        return null;
    }

    try {
        const payload = JSON.parse(
            fromBase64url(body).toString("utf8"),
        ) as AccessTokenPayload;

        if (typeof payload.exp !== "number" || payload.exp < Date.now()) {
            return null;
        }

        if (payload.bind && payload.bind !== expectedBind) {
            return null;
        }
        return payload;
    } catch {
        return null;
    }
};
