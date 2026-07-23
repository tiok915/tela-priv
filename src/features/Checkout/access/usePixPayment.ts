"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CREATOR_HANDLE, PaymentIntent } from "./config";

export type PaymentPhase = "idle" | "creating" | "awaiting" | "paid" | "error";

type CreateResponse = {
    id: string;
    pixCode: string;
    qrImage: string;
};

type StatusResponse = {
    status: "pending" | "paid" | "failed";
    token?: string;
};

const POLL_INTERVAL_MS = 4000;
const MAX_POLLS = 200;

export const usePixPayment = (
    onPaid: (token: string, intent: PaymentIntent) => void,
) => {
    const [phase, setPhase] = useState<PaymentPhase>("idle");
    const [pixCode, setPixCode] = useState<string>("");
    const [qrImage, setQrImage] = useState<string>("");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const cancelledRef = useRef(false);
    const onPaidRef = useRef(onPaid);
    onPaidRef.current = onPaid;

    const clearTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const reset = useCallback(() => {
        cancelledRef.current = true;
        clearTimer();
        setPhase("idle");
        setPixCode("");
        setQrImage("");
    }, []);

    const start = useCallback(async (intent: PaymentIntent) => {
        cancelledRef.current = false;
        clearTimer();
        setPhase("creating");
        setPixCode("");
        setQrImage("");

        let created: CreateResponse;
        try {
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    scope: intent.scope,
                    amountCents: intent.amountCents,
                    creator: CREATOR_HANDLE,
                }),
            });
            if (!res.ok) throw new Error("create failed");
            created = (await res.json()) as CreateResponse;
        } catch {
            if (!cancelledRef.current) setPhase("error");
            return;
        }

        if (cancelledRef.current) return;
        setPixCode(created.pixCode);
        setQrImage(created.qrImage);
        setPhase("awaiting");

        let attempts = 0;
        const poll = async () => {
            if (cancelledRef.current) return;
            attempts += 1;
            try {
                const res = await fetch(`/api/payments/${created.id}`, {
                    cache: "no-store",
                });
                const data = (await res.json()) as StatusResponse;
                if (cancelledRef.current) return;

                if (data.status === "paid" && data.token) {
                    setPhase("paid");
                    onPaidRef.current(data.token, intent);
                    return;
                }
                if (data.status === "failed") {
                    setPhase("error");
                    return;
                }
            } catch {

            }
            if (attempts >= MAX_POLLS) {
                if (!cancelledRef.current) setPhase("error");
                return;
            }
            timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        };

        timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    }, []);

    useEffect(() => {
        return () => {
            cancelledRef.current = true;
            clearTimer();
        };
    }, []);

    return { phase, pixCode, qrImage, start, reset };
};
