import { memo, useEffect, useMemo, useRef } from "react";
import { PlayerJsInstance, PlayerState } from "../types";

const StableEmbedPlayer = memo(function StableEmbedPlayer({
    embedHtml,
}: {
    embedHtml: string;
}) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const lastHtmlRef = useRef<string>("");

    // keep the string stable + apply small transform once
    const html = useMemo(() => {
        return (embedHtml || "").replace("autoplay=true", "autoplay=false");
    }, [embedHtml]);

    useEffect(() => {
        if (!containerRef.current) return;
        if (lastHtmlRef.current === html) return; // ✅ don't touch DOM if unchanged

        lastHtmlRef.current = html;
        containerRef.current.innerHTML = html;
    }, [html]);

    return <div ref={containerRef} className="w-full h-full" />;
});

function getIframeSrcFromEmbedHtml(embedHtml: string): string | null {
    // grabs src="..."
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

export const BunnyStreamPlayer = memo(function BunnyStreamPlayer({
    embedHtml,
    onState,
}: {
    embedHtml: string;
    onState: (s: PlayerState) => void;
}) {
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const playerRef = useRef<PlayerJsInstance | null>(null);

    const srcRaw = useMemo(
        () => getIframeSrcFromEmbedHtml(embedHtml),
        [embedHtml]
    );

    // IMPORTANT: stop autoplay so "playing" is real user action
    const src = useMemo(() => {
        if (!srcRaw) return null;
        let next = srcRaw;
        next = setQueryParam(next, "autoplay", "false");
        next = setQueryParam(next, "loop", "false");
        return next;
    }, [srcRaw]);

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
                // from Bunny/mediadelivery (PlayerJS bridge)
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
                    // ask duration once
                    player.getDuration((d: number) => {
                        duration = Number(d) || 0;
                        onState({
                            isPlaying,
                            isEnded: false,
                            currentTime: 0,
                            duration,
                        });
                    });
                });

                player.on("play", () => {
                    isPlaying = true;
                    onState({
                        isPlaying: true,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                player.on("pause", () => {
                    isPlaying = false;
                    onState({
                        isPlaying: false,
                        isEnded: false,
                        currentTime,
                        duration,
                    });
                });

                // Bunny emits timeupdate - use getCurrentTime() for accurate time
                player.on("timeupdate", () => {
                    player.getCurrentTime((t: number) => {
                        currentTime = Number(t) || 0;
                        onState({
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

                // (some players emit ended, but timeupdate is enough)
                player.on?.("ended", () => {
                    isPlaying = false;
                    onState({
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
    }, [src, onState]);

    if (!src) return <StableEmbedPlayer embedHtml={embedHtml} />;

    return (
        <iframe
            ref={iframeRef}
            src={src}
            className="w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            style={{ border: 0 }}
            title="bunny-stream-player"
        />
    );
});
