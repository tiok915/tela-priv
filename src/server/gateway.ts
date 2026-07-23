import type {
    ProviderStatus,
    CreateTransactionInput,
    CreateTransactionResult,
} from "./paradise";

import * as paradise from "./paradise";
import * as wiinpay from "./wiinpay";

export type { ProviderStatus, CreateTransactionInput, CreateTransactionResult };

const GATEWAY = (process.env.PAYMENT_GATEWAY ?? "paradise").trim().toLowerCase();

const provider = GATEWAY === "wiinpay" ? wiinpay : paradise;

export const createTransaction = provider.createTransaction;
export const getTransactionStatus = provider.getTransactionStatus;
export const activeGateway = GATEWAY === "wiinpay" ? "wiinpay" : "paradise";
