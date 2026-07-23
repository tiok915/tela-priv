"use client";

import { useCallback, useState } from "react";
import { useAccess } from "../access/AccessContext";
import {
    PaymentIntent,
    mediaUnlockIntent,
    subscriptionIntent,
} from "../access/config";
import { POST_MEDIA, mediaToPost, PROFILE, MediaItem } from "../data";
import { PaymentModal } from "./PaymentModal";
import { PostCard } from "./PostCard";

export const PostFeed = (): JSX.Element => {
    const { subscription, isPhotoUnlocked, addToken } = useAccess();
    const [intent, setIntent] = useState<PaymentIntent | null>(null);

    const posts = subscription ? POST_MEDIA : POST_MEDIA.slice(0, 1);

    const isMediaLocked = useCallback(
        (item: MediaItem): boolean => {
            if (!subscription) return true;
            if (item.access === "subscription") return false;
            return !isPhotoUnlocked(item.id);
        },
        [subscription, isPhotoUnlocked],
    );

    const handleLockedClick = (item: MediaItem) => {
        if (!subscription) {
            setIntent(subscriptionIntent());
        } else {
            setIntent(mediaUnlockIntent(item));
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <PaymentModal
                intent={intent}
                onClose={() => setIntent(null)}
                onPaid={(token) => void addToken(token)}
                checkoutName={PROFILE.name}
            />

            {posts.map((item) => (
                <PostCard
                    key={item.id}
                    post={mediaToPost(item)}
                    locked={isMediaLocked(item)}
                    onLockedClick={() => handleLockedClick(item)}
                />
            ))}
        </div>
    );
};
