"use client";

import { useEffect } from "react";
import { MediaKind } from "../data";
import { VideoPlayer } from "./VideoPlayer";

type FullscreenMediaProps = {
    open: boolean;
    kind: MediaKind;
    src: string;
    poster?: string;
    onClose: () => void;
};

export const FullscreenMedia = ({
    open,
    kind,
    src,
    poster,
    onClose,
}: FullscreenMediaProps): JSX.Element | null => {
    useEffect(() => {
        if (!open) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
            </button>

            <div
                className="relative flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
            >
                {kind === "video" ? (
                    <VideoPlayer
                        src={src}
                        poster={poster}
                        autoPlay
                        className="max-h-[88vh] max-w-[92vw] rounded-lg"
                        style={{ width: "min(92vw, 900px)" }}
                    />
                ) : (
                    <img
                        src={src}
                        alt=""
                        className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
                    />
                )}
            </div>
        </div>
    );
};
