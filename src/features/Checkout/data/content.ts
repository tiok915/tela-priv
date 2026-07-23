import { mediaUrl } from "./mediaUrl";
import { PROFILE } from "./profile";

export type MediaKind = "photo" | "video";
export type MediaAccess = "subscription" | "paid";

export type MediaItem = {
    id: string;
    kind: MediaKind;
    src: string;
    poster: string;
    gallery: string[];
    count: number;
    access: MediaAccess;
    priceCents: number;
    priceLabel: string;
    showInPosts?: boolean;
    caption?: string;
    time?: string;
    likes?: string;
    mimo?: string;
};

// Medias
const PHOTO_POOL = 17; // private-media/photos/1..N.png
const VIDEO_POOL = 1; // private-media/videos/1..N.mp4

// Functions
const photoPath = (n: number): string => `photos/${((n - 1) % PHOTO_POOL) + 1}.png`;
const photoSrc = (n: number): string => mediaUrl(photoPath(n));
const videoPath = (n: number): string => `videos/${((n - 1) % VIDEO_POOL) + 1}.mp4`;
const videoSrc = (n: number): string => mediaUrl(videoPath(n));

const galleryOf = (start: number, count: number): string[] =>
    Array.from({ length: count }, (_, i) => photoSrc(start + i));

const brl = (cents: number): string =>
    `R$ ${(cents / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;


const subPhoto = (id: string, n: number, count = 1): MediaItem => ({
    id, kind: "photo", src: photoSrc(n), poster: photoSrc(n),
    gallery: galleryOf(n, count), count, access: "subscription", priceCents: 0, priceLabel: "",
});

const paidPhoto = (id: string, n: number, priceCents: number, count = 1): MediaItem => ({
    id, kind: "photo", src: photoSrc(n), poster: photoSrc(n),
    gallery: galleryOf(n, count), count, access: "paid", priceCents, priceLabel: brl(priceCents),
});

const paidVideo = (id: string, videoN: number, posterN: number, priceCents: number, count = 1): MediaItem => ({
    id, kind: "video", src: videoSrc(videoN), poster: photoSrc(posterN),
    gallery: [], count, access: "paid", priceCents, priceLabel: brl(priceCents),
});

const subVideo = (id: string, videoN: number, posterN: number, count = 1): MediaItem => ({
    id, kind: "video", src: videoSrc(videoN), poster: photoSrc(posterN),
    gallery: [], count, access: "subscription", priceCents: 0, priceLabel: "",
});

// Medias
export const MEDIA: MediaItem[] = [
    subPhoto("m1", 1, 5),
    { ...subPhoto("m2", 2, 1), showInPosts: true, caption: "Boa noite suxu... tenho uma novidade vindo aí 🏠 quer saber oque to aprontando dessa vez? Hehe", time: "Set 25", likes: "335", mimo: "R$ 593,00" },
    { ...paidVideo("m3", 1, 3, 29000), showInPosts: true, caption: "Oque achou desse roupinha?? rs 🔥🔥🔥", time: "Dez 15, 2025", likes: "438", mimo: "R$ 580,00" },
    paidPhoto("m4", 4, 20000, 8),
    subPhoto("m5", 5, 2),
    paidPhoto("m6", 6, 32000, 4),
    subPhoto("m7", 7, 1),
    paidPhoto("m8", 8, 25000, 6),
    subPhoto("m9", 9, 3),
    paidPhoto("m10", 10, 20000, 2),
    { ...paidPhoto("m11", 11, 30000, 7), showInPosts: true, caption: "Ensaio novo no closet 💕 vem ver tudinho", time: "Dez 02, 2025", likes: "512", mimo: "R$ 720,00" },
    subPhoto("m12", 12, 1),
    paidPhoto("m13", 13, 21000, 3),
    subPhoto("m14", 14, 2),
    { ...paidPhoto("m15", 15, 27500, 5), showInPosts: true, caption: "Quem quer o conteúdo completo? 😏", time: "Nov 20, 2025", likes: "289", mimo: "R$ 410,00" },
    paidPhoto("m16", 16, 18000, 1),
    { ...subPhoto("m17", 17, 4), showInPosts: true, caption: "Obrigada pelos mimos de ontem 🥰 vocês são incríveis", time: "Nov 08, 2025", likes: "604", mimo: "R$ 905,00" },
    paidVideo("m18", 1, 9, 35000),
    paidPhoto("m19", 1, 19000, 2),
    subVideo("m20", 1, 7, 1),
];

export type Post = {
    id: string;
    author: string;
    handle: string;
    avatar: string;
    time: string;
    caption: string;
    media: { kind: MediaKind; src: string; poster: string };
    likes: string;
    mimo: string;
};

export const POST_MEDIA = MEDIA.filter((m) => m.showInPosts);

export const mediaToPost = (item: MediaItem): Post => ({
    id: item.id,
    author: PROFILE.name,
    handle: PROFILE.handle,
    avatar: PROFILE.avatar,
    time: item.time ?? "",
    caption: item.caption ?? "",
    media: { kind: item.kind, src: item.src, poster: item.poster },
    likes: item.likes ?? "0",
    mimo: item.mimo ?? "R$ 0,00",
});

export const TOTAL_MEDIA = MEDIA.reduce((sum, m) => sum + m.count, 0);
export const TOTAL_POSTS = POST_MEDIA.length;


// Tabs
const TabsPostsIcon = `<svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.75108 3.76172C2.2587 3.76172 1.86401 4.15625 1.86401 4.64844V15.2852C1.86401 15.7773 2.2587 16.1719 2.75108 16.1719H9.84374C10.3361 16.1719 10.7308 15.7773 10.7308 15.2852V4.64844C10.7308 4.15625 10.3361 3.76172 9.84374 3.76172H2.75108ZM0.976944 4.64844C0.976944 3.67188 1.77413 2.875 2.75108 2.875H9.84374C10.8207 2.875 11.6179 3.67188 11.6179 4.64844V15.2852C11.6179 16.2617 10.8207 17.0586 9.84374 17.0586H2.75108C1.77413 17.0586 0.976944 16.2617 0.976944 15.2852V4.64844ZM10.3908 0.414062C10.3908 0.183594 10.2072 0 9.98051 0H2.61431C2.39157 0 2.2079 0.1875 2.2079 0.414062C2.2079 0.640625 2.39157 0.828125 2.61822 0.828125H9.98442C10.2111 0.828125 10.3947 0.640625 10.3947 0.414062H10.3908ZM10.3908 19.582C10.3908 19.3555 10.2072 19.168 9.98051 19.168H2.61431C2.38766 19.168 2.20399 19.3555 2.20399 19.582C2.20399 19.8086 2.39157 20 2.61431 20H9.98051C10.2072 20 10.3908 19.8125 10.3908 19.5859V19.582Z" fill="#333333"/>
</svg>`;

const TabsMidiasIcon = `<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.5722 4.85828V11.6583C14.5722 12.1948 14.1392 12.6305 13.6 12.6305H1.94172C1.40516 12.6305 0.969531 12.1975 0.969531 11.6583V4.85828H14.5695H14.5722ZM14.5722 3.88609H11.6158L14.2667 1.23516C14.4553 1.41047 14.5722 1.66281 14.5722 1.94172V3.88344V3.88609ZM7.00188 3.88609L9.91578 0.972187H13.1591L10.2452 3.88609H7.00188ZM5.62594 3.88609H2.38797L5.30188 0.972187H8.54516L5.63125 3.88609H5.62859H5.62594ZM1.94172 0.972187H3.92594L1.01203 3.88609H0.969531V1.94437C0.969531 1.40781 1.4025 0.972187 1.94172 0.972187ZM15.5417 3.88609V1.94437C15.5444 0.87125 14.6731 0 13.6 0H1.94172C0.87125 0 0 0.87125 0 1.94172V3.88344V4.36953V4.85563V11.6556C0 12.7261 0.87125 13.5973 1.94172 13.5973H13.6C14.6705 13.5973 15.5417 12.7261 15.5417 11.6556V4.85563V4.36953V3.88344V3.88609ZM6.56094 5.89422C6.41219 5.80656 6.22359 5.80656 6.07219 5.89156C5.92078 5.97656 5.82516 6.13859 5.82516 6.31391V11.1722C5.82516 11.3448 5.91813 11.5069 6.07219 11.5945C6.22625 11.6822 6.40953 11.6795 6.56094 11.5919L10.6888 9.16406C10.8375 9.07641 10.9278 8.91703 10.9278 8.74438C10.9278 8.57172 10.8375 8.41234 10.6888 8.32469L6.56094 5.89422ZM9.48281 8.74172L6.8 10.3195V7.16125L9.48281 8.73906V8.74172Z" fill="#333333"/>
</svg>`;

export const tabsData = [
    { icon: TabsPostsIcon, label: `${TOTAL_POSTS} Postagens` },
    { icon: TabsMidiasIcon, label: `${TOTAL_MEDIA} Mídias` },
];
