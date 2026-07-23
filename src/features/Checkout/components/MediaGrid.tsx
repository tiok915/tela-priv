"use client";

import { useCallback, useMemo, useState } from "react";
import { useAccess } from "../access/AccessContext";
import {
    PaymentIntent,
    mediaUnlockIntent,
    subscriptionIntent,
} from "../access/config";
import { MEDIA, MediaItem, NON_SUBSCRIBER_MEDIA_ROWS, PROFILE } from "../data";
import { PaymentModal } from "./PaymentModal";
import { MediaLightbox } from "./MediaLightbox";

const Texture = "/assets/icons/tile-texture.png";
const LockIcon = "/assets/icons/lock.svg";
const CountIcon = "/assets/icons/count.svg";

const TABS = ["Todos", "Fotos", "Vídeos", "Pagos"] as const;
type Tab = (typeof TABS)[number];

const PlayBadge = (): JSX.Element => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black/45">
            <svg width={14} height={14} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 6.13a1 1 0 0 1 0 1.74l-9 5.05A1 1 0 0 1 .75 12.05V1.95A1 1 0 0 1 2.25 1.08l9 5.05Z" fill="#fff" />
            </svg>
        </div>
    </div>
);

type TileProps = {
    item: MediaItem;
    accessible: boolean;
    showDetails: boolean;
    onOpen: (item: MediaItem) => void;
};

const MediaTile = ({ item, accessible, showDetails, onOpen }: TileProps): JSX.Element => {
    if (accessible) {
        return (
            <button
                type="button"
                onClick={() => onOpen(item)}
                className="relative aspect-square overflow-hidden cursor-pointer group"
            >
                <img
                    src={item.poster}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                />
                {item.kind === "video" && <PlayBadge />}
            </button>
        );
    }

    const showPrice = item.access === "paid";
    return (
        <button
            type="button"
            onClick={() => onOpen(item)}
            className="relative aspect-square overflow-hidden bg-[#f4eee5] cursor-pointer group"
        >
            <img
                src={Texture}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-opacity group-hover:opacity-80"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <img src={LockIcon} alt="" aria-hidden="true" className="w-10 h-10" />
                {showDetails && (
                    <div className="flex items-center justify-center gap-[16px] h-[18px] mt-[16px]">
                        <div className="flex items-center gap-[4px]">
                            <img src={CountIcon} alt="" aria-hidden="true" className="w-3 h-3" />
                            <span className="font-['Poppins',Helvetica] text-[12px] leading-[18px] text-[#6c757d] whitespace-nowrap">
                                {item.count}
                            </span>
                        </div>
                        {showPrice && (
                            <span className="font-['Poppins',Helvetica] text-[12px] leading-[18px] text-[#6c757d] whitespace-nowrap">
                                {item.priceLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
};

export const MediaGrid = (): JSX.Element => {
    const { subscription, isPhotoUnlocked, addToken } = useAccess();
    const [activeTab, setActiveTab] = useState<Tab>("Todos");
    const [intent, setIntent] = useState<PaymentIntent | null>(null);
    const [openItemId, setOpenItemId] = useState<string | null>(null);

    const isAccessible = useCallback(
        (item: MediaItem): boolean =>
            item.access === "subscription" ? subscription : isPhotoUnlocked(item.id),
        [subscription, isPhotoUnlocked],
    );

    const items = useMemo(() => {
        switch (activeTab) {
            case "Fotos":
                return MEDIA.filter((m) => m.kind === "photo");
            case "Vídeos":
                return MEDIA.filter((m) => m.kind === "video");
            case "Pagos":
                return MEDIA.filter((m) => m.access === "paid");
            default:
                return MEDIA;
        }
    }, [activeTab]);

    const handleUnlock = (item: MediaItem) => {
        setIntent(
            item.access === "paid" ? mediaUnlockIntent(item) : subscriptionIntent(),
        );
    };

    const handleTileOpen = (item: MediaItem) => {
        if (!subscription) {
            setIntent(subscriptionIntent());
            return;
        }
        setOpenItemId(item.id);
    };

    return (
        <div className="w-full bg-white border border-[#ddd] rounded-[24px] overflow-hidden">
            <PaymentModal
                intent={intent}
                onClose={() => setIntent(null)}
                onPaid={(token) => void addToken(token)}
                checkoutName={PROFILE.name}
            />

            <MediaLightbox
                items={items}
                isAccessible={isAccessible}
                openItemId={openItemId}
                onClose={() => setOpenItemId(null)}
                onUnlock={handleUnlock}
            />

            <div className="flex items-center justify-center gap-1 pt-3 pb-2 px-4">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center justify-center px-3 py-2 rounded-[100px] transition-colors cursor-pointer ${isActive ? "bg-[#f6f1ea]" : "hover:bg-[#f6f1ea]/50"
                                }`}
                        >
                            <span
                                className={`font-['Poppins',Helvetica] text-[16px] leading-[24px] text-center whitespace-nowrap ${isActive ? "text-[#f68d3d]" : "text-[#333]"
                                    }`}
                            >
                                {tab}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className={`grid gap-[3px] grid-cols-3 ${subscription ? "sm:grid-cols-4" : ""}`}>
                {(subscription ? items : items.slice(0, NON_SUBSCRIBER_MEDIA_ROWS * 3)).map((item) => (
                    <MediaTile
                        key={item.id}
                        item={item}
                        accessible={isAccessible(item)}
                        showDetails={subscription}
                        onOpen={handleTileOpen}
                    />
                ))}
            </div>
        </div>
    );
};
