"use client";

import { useState } from "react";
import { useAccess } from "../access/AccessContext";
import { PaymentIntent } from "../access/config";
import { PROFILE } from "../data";
import { MimoModal } from "./MimoModal";
import { PaymentModal } from "./PaymentModal";

type MimoFlowProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
};

export const MimoFlow = ({
    open,
    onClose,
    title = "Enviar mimo",
}: MimoFlowProps): JSX.Element => {
    const { addToken } = useAccess();
    const [intent, setIntent] = useState<PaymentIntent | null>(null);

    return (
        <>
            <MimoModal
                open={open}
                title={title}
                onClose={onClose}
                onPay={(mimo) => {
                    onClose();
                    setIntent(mimo);
                }}
            />
            <PaymentModal
                intent={intent}
                onClose={() => setIntent(null)}
                onPaid={(token) => void addToken(token)}
                checkoutName={PROFILE.name}
            />
        </>
    );
};
