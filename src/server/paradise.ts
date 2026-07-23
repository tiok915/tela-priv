import type { Customer } from "./customers";

const BASE_URL =
    process.env.PARADISE_API_BASE_URL ?? "https://multi.paradisepags.com/api/v1";
const API_KEY = process.env.PARADISE_API_KEY ?? "";

export type ProviderStatus =
    | "pending"
    | "approved"
    | "processing"
    | "under_review"
    | "failed"
    | "refunded"
    | "chargeback";

export type CreateTransactionInput = {
    amountCents: number;
    description: string;
    reference: string;
    customer: Customer;
    postbackUrl?: string;
};

export type CreateTransactionResult = {
    transactionId: string;
    qrCode: string;
    qrCodeBase64: string | null;
};

const authHeaders = (): Record<string, string> => ({
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
});

export const createTransaction = async (
    input: CreateTransactionInput,
): Promise<CreateTransactionResult> => {
    const res = await fetch(`${BASE_URL}/transaction.php`, {
        method: "POST",
        headers: authHeaders(),
        cache: "no-store",
        body: JSON.stringify({
            amount: input.amountCents,
            description: input.description,
            reference: input.reference,
            customer: input.customer,
            ...(input.postbackUrl ? { postback_url: input.postbackUrl } : {}),
        }),
    });

    const data = (await res.json().catch(() => null)) as
        | {
            status?: string;
            transaction_id?: number | string;
            qr_code?: string;
            qr_code_base64?: string | null;
        }
        | null;

    if (!res.ok || !data || data.status !== "success" || !data.transaction_id) {
        throw new Error(
            `paradise_create_failed: ${res.status} ${JSON.stringify(data)}`,
        );
    }

    return {
        transactionId: String(data.transaction_id),
        qrCode: data.qr_code ?? "",
        qrCodeBase64: data.qr_code_base64 ?? null,
    };
};

export const getTransactionStatus = async (
    transactionId: string,
): Promise<ProviderStatus> => {
    const res = await fetch(
        `${BASE_URL}/query.php?action=get_transaction&id=${encodeURIComponent(
            transactionId,
        )}`,
        { headers: { "X-API-Key": API_KEY }, cache: "no-store" },
    );

    const data = (await res.json().catch(() => null)) as
        | { status?: ProviderStatus }
        | null;

    if (!res.ok || !data?.status) {
        throw new Error(`paradise_query_failed: ${res.status}`);
    }

    return data.status;
};
