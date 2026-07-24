const AVATAR = "/assets/images/avatar.png";
const COVER = "/assets/images/cover-image.png";

export type SocialLink = {
    label: string;
    icon: string;
    url: string;
};

export type StatItem = {
    icon: string;
    value: string;
};

export type PlanItem = {
    label: string;
    price: string;
};

export type OfferItem = {
    active: boolean;
    title: string;
    price: string;
    originalPrice: string;
    discount: string;
};

export type ProfileStatus = "online" | "live" | "offline";

export const PROFILE = {
    status: "online" as ProfileStatus,
    name: "Julinha Santos",
    handle: "@eujulinhasantos",
    bio: "",
    avatar: AVATAR,
    cover: COVER,

    socials: [
        { label: "Instagram", icon: "/assets/icons/insta.svg", url: "https://instagram.com/witchpleasure" },
       
    ] as SocialLink[],

    stats: [
        { icon: "/assets/icons/photos.svg", value: "19" },
        { icon: "/assets/icons/midias.svg", value: "49" },
        { icon: "/assets/icons/heart.svg", value: "353" },
    ] as StatItem[],

    lockedStats: [
        { icon: "/assets/icons/photos-gray.svg", value: "19" },
        { icon: "/assets/icons/midias-gray.svg", value: "49" },
        { icon: "/assets/icons/heart-gray.svg", value: "353" },
    ] as StatItem[],

    subscription: {
        offer: {
            active: true,
            title: "Promoçãozinha💕💕",
            price: "R$ 20,00",
            originalPrice: "R$ 100,00",
            discount: "Economize 80%",
        } as OfferItem,
        monthly: { label: "1 mês", price: "R$ 39,90" } as PlanItem,
        promotions: [
            { label: "3 meses", price: "R$ 119,70" },
            { label: "6 meses", price: "R$ 239,40" },
        ] as PlanItem[],
    },
} as const;
