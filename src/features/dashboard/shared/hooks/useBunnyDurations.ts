import { useEffect, useRef, useState } from "react";

/**
 * Extract iframe src from an embed HTML string.
 */
function getIframeSrc(embedHtml: string): string | null {
    const m = embedHtml.match(/src="([^"]+)"/i);
    return m?.[1] ?? null;
}

/**
 * Ensure the PlayerJS script is loaded (shared with BunnyStreamPlayer).
 */
function ensurePlayerJs(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).playerjs?.Player) return resolve();

        const existing = document.querySelector(
            'script[data-playerjs="1"]'
        ) as HTMLScriptElement | null;

        if (existing) {
            if ((window as any).playerjs?.Player) return resolve();
            existing.addEventListener("load", () => resolve(), { once: true });
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
}

interface VideoEmbedInfo {
    id: number;
    embedHtml: string;
}

/**
 * Fetches durations for a list of Bunny-hosted videos by creating
 * tiny hidden iframes, asking PlayerJS for the duration, then
 * immediately destroying them.
 *
 * Returns a Record<videoId, durationInSeconds>.
 */
export function useBunnyDurations(
    videos: VideoEmbedInfo[],
    existingDurations: Record<number, number>
) {
    const [durations, setDurations] = useState<Record<number, number>>({});
    const fetchedRef = useRef<Set<number>>(new Set());
    const existingDurationsRef = useRef(existingDurations);
    existingDurationsRef.current = existingDurations;

    // Stable key: only re-run when the set of video IDs changes
    const videosKey = videos.map((v) => v.id).join(",");

    useEffect(() => {
        if (videos.length === 0) return;

        let cancelled = false;
        const iframes: HTMLIFrameElement[] = [];

        const fetchAll = async () => {
            try {
                await ensurePlayerJs();
            } catch {
                return;
            }
            if (cancelled) return;

            const P = (window as any).playerjs;
            if (!P?.Player) return;

            // Build list of videos that need duration fetching
            const toFetch = videos.filter((video) => {
                const existing = existingDurationsRef.current[video.id];
                if (fetchedRef.current.has(video.id) || (existing && existing > 0)) {
                    return false;
                }
                return !!getIframeSrc(video.embedHtml);
            });

            if (toFetch.length === 0) return;

            // Launch ALL iframes in parallel
            const promises = toFetch.map((video) => {
                const src = getIframeSrc(video.embedHtml)!;
                let url: string;
                try {
                    const u = new URL(src);
                    u.searchParams.set("autoplay", "false");
                    u.searchParams.set("preload", "true");
                    url = u.toString();
                } catch {
                    return Promise.resolve();
                }

                return new Promise<void>((resolve) => {
                    if (cancelled) { resolve(); return; }

                    const iframe = document.createElement("iframe");
                    iframe.src = url;
                    iframe.style.cssText =
                        "width:1px;height:1px;position:absolute;left:-9999px;top:-9999px;opacity:0;pointer-events:none;";
                    iframe.setAttribute("tabindex", "-1");
                    iframe.setAttribute("aria-hidden", "true");
                    document.body.appendChild(iframe);
                    iframes.push(iframe);

                    const timeout = setTimeout(() => {
                        cleanup();
                        resolve();
                    }, 10000);

                    const cleanup = () => {
                        clearTimeout(timeout);
                        try { iframe.remove(); } catch {}
                    };

                    try {
                        const player = new P.Player(iframe);
                        player.on("ready", () => {
                            player.getDuration((d: number) => {
                                const duration = Number(d) || 0;
                                cleanup();
                                if (duration > 0 && !cancelled) {
                                    fetchedRef.current.add(video.id);
                                    setDurations((prev) => ({
                                        ...prev,
                                        [video.id]: duration,
                                    }));
                                }
                                resolve();
                            });
                        });
                        player.on("error", () => {
                            cleanup();
                            resolve();
                        });
                    } catch {
                        cleanup();
                        resolve();
                    }
                });
            });

            await Promise.allSettled(promises);
        };

        fetchAll();

        return () => {
            cancelled = true;
            iframes.forEach((iframe) => {
                try { iframe.remove(); } catch {}
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videosKey]);

    return durations;
}
