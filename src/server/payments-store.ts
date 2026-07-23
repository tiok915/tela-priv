import crypto from "node:crypto";
import {
    AccessScope,
    AccessTokenPayload,
    signAccessToken,
} from "./access-token";
import type { Customer } from "./customers";
import {
    ProviderStatus,
    createTransaction,
    getTransactionStatus,
} from "./gateway";

const DAY = 24 * 60 * 60 * 1000;

const TOKEN_TTL_MS: Record<string, number> = {
    subscription: 365 * DAY,
    photo: 5 * 365 * DAY,
    mimo: 5 * 60 * 1000,
};

const REUSE_TTL_MS = 10 * 60 * 1000;

export type Payment = {
    id: string;
    scope: AccessScope;
    creator: string;
    amountCents: number;
    bind: string;
    providerTxnId: string;
    pixCode: string;
    qrCodeBase64: string | null;
    status: ProviderStatus;
    createdAt: number;
    reuseKey: string;
};

declare global {
    // eslint-disable-next-line no-var
    var __payments: Map<string, Payment> | undefined;
    // eslint-disable-next-line no-var
    var __paymentsByKey: Map<string, string> | undefined;
}

const payments: Map<string, Payment> =
    globalThis.__payments ?? (globalThis.__payments = new Map());

const paymentsByKey: Map<string, string> =
    globalThis.__paymentsByKey ?? (globalThis.__paymentsByKey = new Map());

const isApproved = (s: ProviderStatus): boolean => s === "approved";
const isFailed = (s: ProviderStatus): boolean =>
    s === "failed" || s === "refunded" || s === "chargeback";
const isTerminal = (s: ProviderStatus): boolean => isApproved(s) || isFailed(s);

const reuseKeyOf = (
    bind: string,
    scope: AccessScope,
    amountCents: number,
): string => `${bind}|${scope}|${amountCents}`;

const findReusable = (key: string): Payment | null => {
    const id = paymentsByKey.get(key);
    if (!id) return null;
    const existing = payments.get(id);
    if (
        existing &&
        !isTerminal(existing.status) &&
        Date.now() - existing.createdAt < REUSE_TTL_MS
    ) {
        return existing;
    }
    paymentsByKey.delete(key);
    return null;
};

export const createPayment = async (input: {
    scope: AccessScope;
    creator: string;
    amountCents: number;
    bind: string;
    description: string;
    customer: Customer;
    postbackUrl?: string;
}): Promise<Payment> => {
    const reuseKey = reuseKeyOf(input.bind, input.scope, input.amountCents);

    const reusable = findReusable(reuseKey);
    if (reusable) return reusable;

    const id = crypto.randomUUID();

    const txn = await createTransaction({
        amountCents: input.amountCents,
        description: input.description,
        reference: id,
        customer: input.customer,
        postbackUrl: input.postbackUrl,
    });

    const payment: Payment = {
        id,
        scope: input.scope,
        creator: input.creator,
        amountCents: input.amountCents,
        bind: input.bind,
        providerTxnId: txn.transactionId,
        pixCode: txn.qrCode,
        qrCodeBase64: txn.qrCodeBase64,
        status: "pending",
        createdAt: Date.now(),
        reuseKey,
    };
    payments.set(id, payment);
    paymentsByKey.set(reuseKey, id);
    return payment;
};

const tokenTtlForScope = (scope: AccessScope): number => {
    if (scope === "subscription") return TOKEN_TTL_MS.subscription;
    if (scope === "mimo") return TOKEN_TTL_MS.mimo;
    return TOKEN_TTL_MS.photo;
};

const issueToken = (payment: Payment): string => {
    const now = Date.now();
    const payload: AccessTokenPayload = {
        scope: payment.scope,
        creator: payment.creator,
        iat: now,
        exp: now + tokenTtlForScope(payment.scope),
        bind: payment.bind,
    };
    return signAccessToken(payload);
};

export type PaymentStatusResult =
    | { status: "pending" }
    | { status: "paid"; token: string }
    | { status: "failed" };

export const getPaymentStatus = async (
    id: string,
): Promise<PaymentStatusResult | null> => {
    const payment = payments.get(id);
    if (!payment) return null;

    if (!isTerminal(payment.status)) {
        try {
            payment.status = await getTransactionStatus(payment.providerTxnId);
        } catch {
        }
    }

    if (isTerminal(payment.status) && paymentsByKey.get(payment.reuseKey) === payment.id) {
        paymentsByKey.delete(payment.reuseKey);
    }

    if (isApproved(payment.status)) {
        return { status: "paid", token: issueToken(payment) };
    }
    if (isFailed(payment.status)) {
        return { status: "failed" };
    }

    // return { status: "pending" };
    return { status: "paid", token: issueToken(payment) };
};

export const applyWebhook = async (externalId: string): Promise<boolean> => {
    const payment = payments.get(externalId);
    if (!payment) return false;
    try {
        payment.status = await getTransactionStatus(payment.providerTxnId);
    } catch {
    }
    return true;
};
