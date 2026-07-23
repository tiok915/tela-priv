import type { AccessScope } from "@/server/access-token";
import { PROFILE } from "../data/profile";

export const CREATOR_HANDLE = PROFILE.handle.replace(/^@/, "");
export const SUBSCRIPTION_PRICE_LABEL = PROFILE.subscription.monthly.price;

export type PaymentIntent = {
    scope: AccessScope;
    amountCents: number;
    priceLabel: string;
    title?: string;
};

export const priceToCents = (priceLabel: string): number => {
    const normalized = priceLabel.replace(/[^\d,.-]/g, "").replace(",", ".");
    return Math.round(Number(normalized) * 100) || 0;
};

export const subscriptionIntent = (
    priceLabel: string = SUBSCRIPTION_PRICE_LABEL,
): PaymentIntent => ({
    scope: "subscription",
    amountCents: priceToCents(priceLabel),
    priceLabel,
    title: "Assinatura",
});

export const mimoIntent = (
    amountCents: number,
    priceLabel: string,
): PaymentIntent => ({
    scope: "mimo",
    amountCents,
    priceLabel,
    title: "Enviar mimo",
});

export const mediaUnlockIntent = (item: {
    id: string;
    priceCents: number;
    priceLabel: string;
}): PaymentIntent => ({
    scope: `photo:${item.id}`,
    amountCents: item.priceCents,
    priceLabel: item.priceLabel,
    title: "Desbloquear mídia",
});
