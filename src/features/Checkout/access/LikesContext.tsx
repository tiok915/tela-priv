"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { loadSecureJSON, saveSecureJSON } from "./secureStore";

const STORAGE_KEY = "privacy.checkout.likes.v1";

type LikesState = {
    liked: string[];
    favorited: string[];
};

type LikesContextValue = {
    isLiked: (id: string) => boolean;
    isFavorited: (id: string) => boolean;
    toggleLike: (id: string) => void;
    toggleFavorite: (id: string) => void;
};

const LikesContext = createContext<LikesContextValue | null>(null);

const EMPTY: LikesState = { liked: [], favorited: [] };

const toggleIn = (list: string[], id: string): string[] =>
    list.includes(id) ? list.filter((x) => x !== id) : [...list, id];

export const LikesProvider = ({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element => {
    const [state, setState] = useState<LikesState>(EMPTY);

    useEffect(() => {
        let active = true;
        (async () => {
            const stored = await loadSecureJSON<LikesState>(STORAGE_KEY, EMPTY);
            if (!active) return;
            setState({
                liked: Array.isArray(stored.liked) ? stored.liked : [],
                favorited: Array.isArray(stored.favorited) ? stored.favorited : [],
            });
        })();
        return () => {
            active = false;
        };
    }, []);

    const update = useCallback((producer: (prev: LikesState) => LikesState) => {
        setState((prev) => {
            const next = producer(prev);
            void saveSecureJSON(STORAGE_KEY, next);
            return next;
        });
    }, []);

    const value: LikesContextValue = {
        isLiked: (id) => state.liked.includes(id),
        isFavorited: (id) => state.favorited.includes(id),
        toggleLike: (id) =>
            update((prev) => ({ ...prev, liked: toggleIn(prev.liked, id) })),
        toggleFavorite: (id) =>
            update((prev) => ({ ...prev, favorited: toggleIn(prev.favorited, id) })),
    };

    return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
};

export const useLikes = (): LikesContextValue => {
    const ctx = useContext(LikesContext);
    if (!ctx) {
        throw new Error("useLikes must be used within a LikesProvider");
    }
    return ctx;
};
