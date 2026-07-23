"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { loadTokens, saveTokens } from "./secureStore";

type AccessSummary = {
    subscription: boolean;
    unlockedPhotos: string[];
};

type AccessContextValue = {
    ready: boolean;
    subscription: boolean;
    unlockedPhotos: string[];
    isPhotoUnlocked: (photoId: string) => boolean;
    addToken: (token: string) => Promise<void>;
};

const AccessContext = createContext<AccessContextValue | null>(null);

const EMPTY: AccessSummary = { subscription: false, unlockedPhotos: [] };

const verifyTokens = async (tokens: string[]): Promise<AccessSummary> => {
    if (tokens.length === 0) return EMPTY;
    try {
        const res = await fetch("/api/access", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokens }),
        });
        if (!res.ok) return EMPTY;
        return (await res.json()) as AccessSummary;
    } catch {
        return EMPTY;
    }
};

export const AccessProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const tokensRef = useRef<string[]>([]);
    const [summary, setSummary] = useState<AccessSummary>(EMPTY);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let active = true;
        (async () => {
            const tokens = await loadTokens();
            tokensRef.current = tokens;
            const verified = await verifyTokens(tokens);
            if (!active) return;
            setSummary(verified);
            setReady(true);
        })();
        return () => {
            active = false;
        };
    }, []);

    const addToken = useCallback(async (token: string) => {
        const tokens = [...tokensRef.current, token];
        tokensRef.current = tokens;
        await saveTokens(tokens);
        const verified = await verifyTokens(tokens);
        setSummary(verified);
    }, []);

    const value = useMemo<AccessContextValue>(
        () => ({
            ready,
            subscription: summary.subscription,
            unlockedPhotos: summary.unlockedPhotos,
            isPhotoUnlocked: (photoId: string) =>
                summary.unlockedPhotos.includes(photoId),
            addToken,
        }),
        [ready, summary, addToken],
    );

    return (
        <AccessContext.Provider value={value}>{children}</AccessContext.Provider>
    );
};

export const useAccess = (): AccessContextValue => {
    const ctx = useContext(AccessContext);
    if (!ctx) {
        throw new Error("useAccess must be used within an AccessProvider");
    }
    return ctx;
};
