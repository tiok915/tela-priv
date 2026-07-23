import type { Customer } from "./customers";
import type {
    ProviderStatus,
    CreateTransactionInput,
    CreateTransactionResult,
} from "./paradise";

const BASE_URL =
    (process.env.WIINPAY_BASE_URL ?? "https://api-v2.wiinpay.com.br").replace(/\/$/, "");
const API_KEY = process.env.WIINPAY_API_KEY ?? "";

const norm = (v: unknown): string =>
    typeof v === "string" ? v.trim().toLowerCase() : "";

const PAID_STATUSES = new Set(["paid", "completed", "approved", "confirmed"]);
const PENDING_STATUSES = new Set([
    "pending",
    "active",
    "waiting",
    "processing",
    "created",
    "new",
    "open",
]);

const toProviderStatus = (raw: string): ProviderStatus => {
    if (PAID_STATUSES.has(raw)) return "approved";
    if (PENDING_STATUSES.has(raw)) return "pending";
    return "failed";
};


export const createTransaction = async (
    input: CreateTransactionInput,
): Promise<CreateTransactionResult> => {
    if (!API_KEY) {
        throw new Error("WiinPay: WIINPAY_API_KEY não configurada");
    }

    const valueInReais = input.amountCents / 100;

    const body: Record<string, unknown> = {
        api_key: API_KEY,
        value: valueInReais,
        name: input.customer.name,
        email: input.customer.email,
        description: input.description ?? `Pedido ${input.reference}`,
        metadata: { reference: input.reference },
    };
    if (input.postbackUrl) {
        body.webhook_url = input.postbackUrl;
    }

    const res = await fetch(`${BASE_URL}/payment/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error(
            `wiinpay_create_failed: ${res.status}: ${await res.text()}`,
        );
    }

    const json = (await res.json()) as {
        data?: { qr_code?: string; paymentId?: string };
    };
    const data = json.data;

    if (!data?.qr_code) {
        throw new Error("WiinPay: resposta de create sem qr_code");
    }

    return {
        transactionId: data.paymentId ?? "",
        qrCode: data.qr_code,
        qrCodeBase64: null,
    };
};

export const getTransactionStatus = async (
    transactionId: string,
): Promise<ProviderStatus> => {
    if (!API_KEY || !transactionId) {
        throw new Error("wiinpay_query_failed: missing key or txn id");
    }

    const res = await fetch(
        `${BASE_URL}/payment/list/${encodeURIComponent(transactionId)}`,
        {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                Accept: "application/json",
            },
            cache: "no-store",
        },
    );

    if (!res.ok) {
        throw new Error(`wiinpay_query_failed: ${res.status}`);
    }

    const json = (await res.json()) as {
        data?: { payment?: { status?: string } };
    };

    const s = norm(json.data?.payment?.status);
    if (!s) {
        throw new Error("wiinpay_query_failed: status ausente na resposta");
    }

    return toProviderStatus(s);
};

export const parseWebhookExternalId = (
    body: Record<string, unknown>,
): string | null => {
    const metadata = body?.metadata as Record<string, unknown> | undefined;
    const reference = metadata?.reference;
    return typeof reference === "string" && reference.trim()
        ? reference.trim()
        : null;
};
