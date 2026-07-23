"use client";

import { CSSProperties, useRef, useState } from "react";

type VideoPlayerProps = {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    className?: string;
    style?: CSSProperties;
};

export const VideoPlayer = ({
    src,
    poster,
    autoPlay,
    className,
    style,
}: VideoPlayerProps): JSX.Element => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) void v.play();
        else v.pause();
    };

    const toggleFullscreen = () => {
        const el = wrapRef.current;
        if (!el) return;
        if (document.fullscreenElement) void document.exitFullscreen();
        else void el.requestFullscreen?.();
    };

    return (
        <div
            ref={wrapRef}
            className={`group relative overflow-hidden bg-black ${className ?? ""}`}
            style={style}
        >
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                playsInline
                onClick={togglePlay}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                className="h-full w-full cursor-pointer object-contain"
            />

            {!playing && (
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label="Reproduzir"
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-black/55 backdrop-blur-sm transition-transform hover:scale-105">
                        <svg width={26} height={26} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" fill="#fff" />
                        </svg>
                    </span>
                </button>
            )}

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pausar" : "Reproduzir"}
                    className="pointer-events-auto text-white transition-opacity hover:opacity-80"
                >
                    {playing ? (
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                    ) : (
                        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 5.5v13a1 1 0 0 0 1.5.86l11-6.5a1 1 0 0 0 0-1.72l-11-6.5A1 1 0 0 0 8 5.5Z" />
                        </svg>
                    )}
                </button>
                <div className="flex-1" />
                <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Tela cheia"
                    className="pointer-events-auto text-white transition-opacity hover:opacity-80"
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
