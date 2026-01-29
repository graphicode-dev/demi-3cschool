import { useState, useEffect, useRef, useCallback, memo, useMemo } from "react";
import { Play } from "lucide-react";
import type { PlayerState } from "../../types";

declare global {
    interface Window {
        playerjs?: {
            Player: new (iframe: HTMLIFrameElement) => PlayerJsInstance;
        };
    }
}

interface PlayerJsInstance {
    on: (event: string, callback: (...args: unknown[]) => void) => void;
    getDuration: (callback: (duration: number) => void) => void;
    getCurrentTime: (callback: (time: number) => void) => void;
}

function getIframeSrcFromEmbedHtml(embedHtml: string): string | null {
    const m = embedHtml.match(/src="([^"]+)"/i);
    return m?.[1] ?? null;
}

function setQueryParam(url: string, key: string, value: string) {
    try {
        const u = new URL(url);
        u.searchParams.set(key, value);
        return u.toString();
    } catch {
        return url;
    }
}

interface VideoPlayerProps {
    embedHtml: string;
    onStateChange: (state: PlayerState) => void;
    onVideoEnd: () => void;
}

export const VideoPlayer = memo(function VideoPlayer({
    embedHtml,
    onStateChange,
    onVideoEnd,
}: VideoPlayerProps) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<PlayerJsInstance | null>(null);
    const [isReady, setIsReady] = useState(false);

    const srcRaw = useMemo(
        () => getIframeSrcFromEmbedHtml(embedHtml),
        [embedHtml]
    );

    const src = useMemo(() => {
        if (!srcRaw) return null;
        let next = srcRaw;
        next = setQueryParam(next, "autoplay", "false");
        next = setQueryParam(next, "loop", "false");
        return next;
    }, [srcRaw]);

    const handleStateChange = useCallback(
        (state: PlayerState) => {
            onStateChange(state);
            if (state.isEnded) {
                onVideoEnd();
            }
        },
        [onStateChange, onVideoEnd]
    );

    useEffect(() => {
        if (!iframeRef.current || !src) return;

        let destroyed = false;

        const ensurePlayerJs = () =>
            new Promise<void>((resolve, reject) => {
                if (window.playerjs?.Player) return resolve();

                const existing = document.querySelector(
                    'script[data-playerjs="1"]'
                ) as HTMLScriptElement | null;

                if (existing) {
                    existing.addEventListener("load", () => resolve(), {
                        once: true,
                    });
                    return;
                }

                const s = document.createElement("script");
                s.src =
                    "https://assets.mediadelivery.net/playerjs/player-0.1.0.min.js";
                s.async = true;
                s.dataset.playerjs = "1";
                s.onload = () => resolve();
                s.onerror = () => reject(new Error("Failed to load PlayerJS"));
                document.body.appendChild(s);
            });

        ensurePlayerJs()
            .then(() => {
                if (destroyed) return;

                const P = window.playerjs;
                if (!P?.Player) {
                    console.error("playerjs.Player not ready");
                    return;
                }

                const iframe = iframeRef.current!;
                const player = new P.Player(iframe);
                playerRef.current = player;

                let duration = 0;
                let isPlaying = false;
                let currentTime = 0;

                player.on("ready", () => {
                    setIsReady(true);
                    player.getDuration((d: number) => {
                        duration = Number(d) || 0;
                        handleStateChange({
                            isPlaying,
                            isEnded: false,
                            currentTime: 0,
                            duration,
                        });
                    });
                });

                player.on("play", () => {
                    isPlaying = true;
                    handleStateChange({
                        isPlaying: true,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                player.on("pause", () => {
                    isPlaying = false;
                    handleStateChange({
                        isPlaying: false,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                player.on("timeupdate", () => {
                    player.getCurrentTime((t: number) => {
                        currentTime = Number(t) || 0;
                        handleStateChange({
                            isPlaying,
                            isEnded:
                                duration > 0
                                    ? currentTime >= duration - 0.25
                                    : false,
                            currentTime,
                            duration,
                        });
                    });
                });

                player.on("ended", () => {
                    isPlaying = false;
                    handleStateChange({
                        isPlaying: false,
                        isEnded: true,
                        currentTime: duration,
                        duration,
                    });
                });
            })
            .catch((err) => {
                console.error(err);
            });

        return () => {
            destroyed = true;
            playerRef.current = null;
        };
    }, [src, handleStateChange]);

    if (!src) {
        return (
            <div className="relative w-full aspect-video bg-gray-700 rounded-2xl flex items-center justify-center">
                <div className="bg-brand-500 rounded-full p-4 cursor-pointer hover:bg-brand-600 transition-colors">
                    <Play className="size-8 text-white" fill="currentColor" />
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-video bg-gray-700 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            <iframe
                ref={iframeRef}
                src={src}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                style={{ border: 0 }}
                title="video-player"
            />
            {!isReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                    <div className="bg-brand-500 rounded-full p-4">
                        <Play
                            className="size-8 text-white"
                            fill="currentColor"
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

export default VideoPlayer;
