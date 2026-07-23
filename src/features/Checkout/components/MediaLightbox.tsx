"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MediaItem } from "../data";
import { VideoPlayer } from "./VideoPlayer";

const Texture = "/assets/icons/tile-texture.png";
const LockIcon = "/assets/icons/lock.svg";
const CountIcon = "/assets/icons/count.svg";

type Slide =
    | { key: string; itemId: string; type: "photo"; src: string; pos: number; total: number }
    | { key: string; itemId: string; type: "video"; src: string; poster: string }
    | { key: string; itemId: string; type: "locked"; item: MediaItem };

type MediaLightboxProps = {
    items: MediaItem[];
    isAccessible: (item: MediaItem) => boolean;
    openItemId: string | null;
    onClose: () => void;
    onUnlock: (item: MediaItem) => void;
};

const buildSlides = (
    items: MediaItem[],
    isAccessible: (item: MediaItem) => boolean,
): Slide[] => {
    const slides: Slide[] = [];
    for (const item of items) {
        if (!isAccessible(item)) {
            slides.push({ key: `${item.id}#locked`, itemId: item.id, type: "locked", item });
            continue;
        }
        if (item.kind === "video") {
            slides.push({ key: `${item.id}#v`, itemId: item.id, type: "video", src: item.src, poster: item.poster });
            continue;
        }
        const gallery = item.gallery.length ? item.gallery : [item.src];
        gallery.forEach((src, i) =>
            slides.push({
                key: `${item.id}#p${i}`,
                itemId: item.id,
                type: "photo",
                src,
                pos: i + 1,
                total: gallery.length,
            }),
        );
    }
    return slides;
};

export const MediaLightbox = ({
    items,
    isAccessible,
    openItemId,
    onClose,
    onUnlock,
}: MediaLightboxProps): JSX.Element | null => {
    const [currentKey, setCurrentKey] = useState<string | null>(null);

    const slides = useMemo(
        () => buildSlides(items, isAccessible),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items, isAccessible],
    );

    useEffect(() => {
        if (!openItemId) {
            setCurrentKey(null);
            return;
        }
        const first = slides.find((s) => s.itemId === openItemId);
        setCurrentKey(first ? first.key : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openItemId]);

    let index = currentKey ? slides.findIndex((s) => s.key === currentKey) : -1;
    if (index < 0 && currentKey) {
        const itemId = currentKey.split("#")[0];
        index = slides.findIndex((s) => s.itemId === itemId);
    }
    const isOpen = openItemId !== null && index >= 0;

    const go = useCallback(
        (dir: 1 | -1) => {
            if (index < 0 || slides.length === 0) return;
            const next = (index + dir + slides.length) % slides.length;
            setCurrentKey(slides[next].key);
        },
        [index, slides],
    );

    useEffect(() => {
        if (!isOpen) return;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [isOpen, go, onClose]);

    if (!isOpen || index < 0) return null;
    const slide = slides[index];

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
            onClick={onClose}
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
                <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
            </button>

            {slides.length > 1 && (
                <button
                    type="button"
                    aria-label="Anterior"
                    onClick={(e) => { e.stopPropagation(); go(-1); }}
                    className="absolute left-3 md:left-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}

            <div className="relative flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {slide.type === "video" ? (
                    <VideoPlayer
                        key={slide.key}
                        src={slide.src}
                        poster={slide.poster}
                        autoPlay
                        className="max-h-[88vh] max-w-[92vw] rounded-lg"
                        style={{ width: "min(92vw, 900px)" }}
                    />
                ) : slide.type === "photo" ? (
                    <>
                        <img
                            key={slide.key}
                            src={slide.src}
                            alt=""
                            className="max-h-[88vh] max-w-[92vw] rounded-lg object-contain"
                        />
                        {slide.total > 1 && (
                            <div className="mt-3 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
                                {slide.pos} / {slide.total}
                            </div>
                        )}
                    </>
                ) : (
                    <LockedSlide item={slide.item} onUnlock={onUnlock} />
                )}
            </div>

            {slides.length > 1 && (
                <button
                    type="button"
                    aria-label="Próxima"
                    onClick={(e) => { e.stopPropagation(); go(1); }}
                    className="absolute right-3 md:right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            )}
        </div>
    );
};

const LockedSlide = ({
    item,
    onUnlock,
}: {
    item: MediaItem;
    onUnlock: (item: MediaItem) => void;
}): JSX.Element => {
    const isPaid = item.access === "paid";
    return (
        <div className="relative w-[min(360px,84vw)] aspect-[449/513] overflow-hidden rounded-[12px] bg-[#f4eee5]">
            <img src={Texture} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
                <img src={LockIcon} alt="" aria-hidden="true" className="w-10 h-10" />
                <div className="flex items-center justify-center gap-[16px]">
                    <div className="flex items-center gap-[4px]">
                        <img src={CountIcon} alt="" aria-hidden="true" className="w-3 h-3" />
                        <span className="font-['Poppins',Helvetica] text-[13px] leading-[18px] text-[#6c757d]">
                            {item.count}
                        </span>
                    </div>
                    {isPaid && (
                        <span className="font-['Poppins',Helvetica] text-[13px] leading-[18px] text-[#6c757d]">
                            {item.priceLabel}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => onUnlock(item)}
                    className="btn-subscription mt-1 flex items-center justify-center"
                    style={{ width: "auto", height: "40px", padding: "0 22px", borderRadius: "100px" }}
                >
                    <span className="text-base font-medium leading-none text-subs whitespace-nowrap">
                        {isPaid ? "Desbloquear conteúdo" : "Assinar para ver"}
                    </span>
                </button>
            </div>
        </div>
    );
};
