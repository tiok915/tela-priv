"use client";

import { useState } from "react";
import { useAccess } from "../access/AccessContext";
import { useLikes } from "../access/LikesContext";
import { PROFILE, Post } from "../data";
import { MimoFlow } from "./MimoFlow";
import { FullscreenMedia } from "./FullscreenMedia";

const LockedIcon = "/assets/icons/locked.svg";
const Container = "/assets/images/Container.svg";

const LikeIcon = "/assets/icons/like.svg";
const LikedIcon = "/assets/icons/liked.svg";
const CommentIcon = "/assets/icons/comment.svg";
const MoneyIcon = "/assets/icons/money.svg";
const FavoriteIcon = "/assets/icons/favorite.svg";
const FavoritedIcon = "/assets/icons/favorited.svg";

const MarginIcon = "/assets/icons/margin.svg";

type PostCardProps = {
    post: Post;
    locked?: boolean;
    onLockedClick?: () => void;
};

export const PostCard = ({ post, locked, onLockedClick }: PostCardProps): JSX.Element => {
    const { subscription } = useAccess();
    const { isLiked, isFavorited, toggleLike, toggleFavorite } = useLikes();
    const [mimoOpen, setMimoOpen] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);

    const mediaLocked = locked ?? !subscription;

    const liked = isLiked(post.id);
    const favorited = isFavorited(post.id);
    const baseLikes = Number(post.likes.replace(/\D/g, "")) || 0;
    const likeCount = baseLikes + (liked ? 1 : 0);

    return (
        <div className="flex flex-col bg-white rounded-2xl border border-[#dddddd] overflow-hidden">
            <MimoFlow open={mimoOpen} onClose={() => setMimoOpen(false)} />

            {!mediaLocked && (
                <FullscreenMedia
                    open={viewerOpen}
                    kind={post.media.kind}
                    src={post.media.src}
                    poster={post.media.poster}
                    onClose={() => setViewerOpen(false)}
                />
            )}
            <div className="flex items-start justify-between px-5 pt-6 pb-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-[62px] h-[62px] rounded-full border-4 border-white overflow-hidden shrink-0 shadow-sm">
                        <img className="w-full h-full bg-cover bg-center object-cover" src={post.avatar} alt="" />
                    </div>
                    <div className="flex flex-col gap-0.5 -mt-1">
                        <span className="font-[family-name:var(--privacy-com-br-cambria-math-regular-font-family)] font-[number:var(--privacy-com-br-cambria-math-regular-font-weight)] text-[length:var(--privacy-com-br-cambria-math-regular-font-size)] leading-[var(--privacy-com-br-cambria-math-regular-line-height)] text-slate-800 whitespace-nowrap">
                            {post.author}
                        </span>
                        <span className="[font-family:'Poppins',Helvetica] font-normal text-[#333] text-sm leading-4">
                            {post.handle}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3 -mt-1">
                    <span className="[font-family:'Poppins',Helvetica] text-xs text-[#a8abb2] whitespace-nowrap">
                        {post.time}
                    </span>
                    <img className="h-5 object-contain" alt="More" src={MarginIcon} />
                </div>
            </div>

            {subscription && post.caption && (
                <p className="px-5 pb-3 [font-family:'Poppins',Helvetica] text-sm leading-5 text-[#333]">
                    {post.caption}
                </p>
            )}

            <div className="relative w-full">
                {!mediaLocked ? (
                    <button
                        type="button"
                        onClick={() => setViewerOpen(true)}
                        className="group relative block w-full cursor-pointer"
                    >
                        <img
                            className="w-full object-cover"
                            style={{ maxHeight: 420 }}
                            alt="Post"
                            src={post.media.poster}
                        />
                        {post.media.kind === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-105">
                                    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" fill="#fff" />
                                    </svg>
                                </span>
                            </div>
                        )}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onLockedClick}
                        className="relative w-full cursor-pointer"
                    >
                        <img
                            className="w-full object-cover"
                            style={{ maxHeight: 420 }}
                            alt="Post"
                            src={Container}
                        />

                        <div className="absolute mt-16 inset-0 flex flex-col items-center justify-center gap-5">
                            <img className="w-[44px] h-[50px]" alt="Locked" src={LockedIcon} />
                            <div className="flex items-center gap-3">
                                {PROFILE.lockedStats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <img className="w-[17px] h-[17px] object-contain" alt="" src={stat.icon} />
                                        <span className="font-[family-name:var(--privacy-com-br-poppins-regular-font-family)] text-[length:var(--privacy-com-br-poppins-regular-font-size)] text-[#67748e] text-center">
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between self-stretch flex-grow-0 flex-shrink-0 relative px-4 pt-6 pb-2">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2">
                    <img
                        src={liked ? LikedIcon : LikeIcon}
                        onClick={() => toggleLike(post.id)}
                        className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px] relative hover:cursor-pointer fill-[#F6842C]"
                    />
                    {subscription && (
                        <img
                            src={MoneyIcon}
                            onClick={() => setMimoOpen(true)}
                            className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px] relative hover:cursor-pointer"
                        />
                    )}
                </div>
                <img
                    src={favorited ? FavoritedIcon : FavoriteIcon}
                    onClick={() => toggleFavorite(post.id)}
                    className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px] relative hover:cursor-pointer fill-[#F6842C]"
                />
            </div>

            {subscription && (
                <div className="px-4 pb-4 [font-family:'Poppins',Helvetica] text-sm text-[#333]">
                    <span className="font-medium">{likeCount} curtidas</span>
                    <span className="text-[#a8abb2]"> · {post.mimo} mimo</span>
                </div>
            )}
        </div>
    );
};
