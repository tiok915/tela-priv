"use client";

import { useState } from "react";
import { MediaGrid } from "./components/MediaGrid";
import { PostFeed } from "./components/PostFeed";
import { ProfileCard } from "./components/ProfileCard";
import { Tabs } from "./components/Tabs";
import { tabsData } from "./data";
import { CheckoutHeader } from "./components/CheckoutHeader";
import { CheckoutSkeleton } from "./components/CheckoutSkeleton";
import { AccessProvider, useAccess } from "./access/AccessContext";
import { LikesProvider } from "./access/LikesContext";

type CheckoutScreenProps = {
    name?: string;
};

const CheckoutBody = (): JSX.Element => {
    const { ready } = useAccess();
    const [activeTab, setActiveTab] = useState(0);
    const [promoOpen, setPromoOpen] = useState(true);

    if (!ready) {
        return <CheckoutSkeleton />;
    }

    return (
        <div className="mx-auto flex w-full max-w-[716px] flex-col gap-4">
            <ProfileCard
                promoOpen={promoOpen}
                onTogglePromo={() => setPromoOpen(!promoOpen)}
            />

            <Tabs activeTab={activeTab} onChange={setActiveTab} tabs={tabsData} />

            {activeTab === 1 && <MediaGrid />}
            {activeTab === 0 && <PostFeed />}
        </div>
    );
};

export const CheckoutScreen = (_props: CheckoutScreenProps): JSX.Element => {
    return (
        <AccessProvider>
            <LikesProvider>
                <div className="w-full min-h-screen bg-[#f9f6f2] flex flex-col items-stretch">
                    <CheckoutHeader />

                    <main className="flex-1 pt-[65px]">
                        <div className="mx-auto w-full max-w-[1140px] px-4 pb-12 pt-[8px]">
                            <CheckoutBody />
                        </div>
                    </main>
                </div>
            </LikesProvider>
        </AccessProvider>
    );
};
