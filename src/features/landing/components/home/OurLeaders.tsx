import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useScrollAnimation } from "../../hooks";
import ThemedText from "@/design-system/components/ThemedText";
import { Icons } from "@/constants";
import { useLanguage } from "@/shared/hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Leader {
    id: string;
    nameKey: string;
    imageSrc?: string;
    videoSrc?: string;
    /** vertical offset from baseline — alternates high/low */
    yOffset: string;
    /** blob shape variant */
    blob: 1 | 2 | 3 | 4;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

// Using sample MP4 logic for demonstration, allowing native playback
const LEADERS: Leader[] = [
    {
        id: "alya",
        nameKey: "ourLeaders.leaders.alya",
        yOffset: "120px",
        blob: 1,
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
        id: "omar",
        nameKey: "ourLeaders.leaders.omar",
        yOffset: "50px",
        blob: 2,
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
        id: "zein",
        nameKey: "ourLeaders.leaders.zein",
        yOffset: "130px",
        blob: 3,
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
        id: "farida",
        nameKey: "ourLeaders.leaders.farida",
        yOffset: "0px",
        blob: 4,
        videoSrc: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
];

// ─── Blob SVG Masks ───────────────────────────────────────────────────────────
// Each blob is a unique organic shape rendered as an SVG clipPath

function BlobShape({ variant }: { variant: 1 | 2 | 3 | 4 }) {
    const paths: Record<1 | 2 | 3 | 4, string> = {
        1: "M130,20 C160,0 200,10 210,50 C225,80 220,120 200,145 C175,175 130,185 95,175 C60,165 30,140 20,105 C8,65 20,30 55,15 C80,5 105,35 130,20 Z",
        2: "M125,15 C158,0 195,20 208,58 C222,95 210,135 185,158 C158,182 115,188 80,172 C45,156 18,125 12,88 C5,50 25,18 62,8 C90,0 100,27 125,15 Z",
        3: "M120,18 C152,2 192,18 208,55 C225,92 215,138 188,162 C160,186 118,190 82,175 C46,160 15,128 10,90 C4,50 22,16 60,8 C88,2 95,30 120,18 Z",
        4: "M128,22 C160,4 198,16 212,54 C228,88 218,132 192,158 C164,185 120,192 84,178 C48,163 18,130 12,92 C4,52 24,18 62,10 C90,2 102,36 128,22 Z",
    };

    return (
        <svg
            viewBox="0 0 240 200"
            className="absolute inset-0 w-full h-full"
            aria-hidden="true"
        >
            <path d={paths[variant]} fill="#bde8f8" />
        </svg>
    );
}

// ─── Winding Road SVG ─────────────────────────────────────────────────────────

function WindingRoad() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1549 558"
            fill="none"
            className="w-full h-auto opacity-90"
            preserveAspectRatio="xMidYMid meet"
        >
            <path
                d="M18.8335 525.178C97.4274 382.446 332.547 116.884 487.362 340.046C496.675 395.192 443.301 574.231 335.35 528.615C227.398 483 319.899 264.852 556.487 367.791C813.321 479.539 891.74 449.997 965.885 306.77C1017.08 207.87 1001.15 -27.8839 840.501 35.7292C690.323 95.1976 872.236 319.289 1140.54 274.034C1430.5 225.126 1503.6 131.397 1533.81 101.292"
                stroke="#24ADE3"
                strokeWidth="43"
            />
            <path
                d="M18.8335 525.177C97.4274 382.446 332.547 116.883 487.362 340.046C496.675 395.192 443.301 574.231 335.35 528.615C227.398 483 319.899 264.852 556.487 367.791C813.321 479.539 891.74 449.997 965.885 306.77C1017.08 207.87 1002.03 -25.5985 840.501 35.729C683.866 95.1976 872.236 319.289 1140.54 274.034C1430.5 225.126 1503.6 131.397 1533.81 101.292"
                stroke="#E9F7FC"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 12 18 24"
            />
        </svg>
    );
}

// ─── Background Pattern ───────────────────────────────────────────────────────

function BackgroundPattern() {
    const icons = [
        { x: 30, y: 60, r: 0, icon: "⌨" },
        { x: 120, y: 20, r: -15, icon: "🖥" },
        { x: 950, y: 40, r: 10, icon: "💡" },
        { x: 1050, y: 80, r: -8, icon: "⚙" },
        { x: 60, y: 280, r: 12, icon: "🔧" },
        { x: 1100, y: 260, r: -5, icon: "📱" },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none max-lg:hidden">
            {icons.map((ic, i) => (
                <span
                    key={i}
                    className="absolute text-3xl opacity-[0.06]"
                    style={{
                        left: ic.x,
                        top: ic.y,
                        transform: `rotate(${ic.r}deg)`,
                        fontSize: 40,
                    }}
                >
                    {ic.icon}
                </span>
            ))}
        </div>
    );
}

// ─── Speech Bubble ────────────────────────────────────────────────────────────

function SpeechBubble({ t }: { t: (key: string) => string }) {
    return (
        <div
            className="absolute z-20 pointer-events-none transition-all duration-700 max-lg:left-[15%] max-lg:top-[2%]"
            style={{ left: "14%", top: "0%" }}
        >
            <div
                className="relative bg-white border-2 border-[#5bc8e8] rounded-[18px] px-5 py-3 text-center shadow-md"
                style={{ minWidth: 140 }}
            >
                <p className="text-[15px] max-lg:text-[13px] font-bold text-[#44769F] leading-snug">
                    {t("ourLeaders.speechBubble.line1")}
                    <br />
                    {t("ourLeaders.speechBubble.line2")}
                </p>
                <svg
                    className="absolute -bottom-[15px] left-6"
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                >
                    <path d="M0,0 L20,0 L5,16 Z" fill="white" />
                    <path
                        d="M0,0 L5,16 L20,0"
                        fill="none"
                        stroke="#5bc8e8"
                        strokeWidth="2"
                    />
                </svg>
            </div>
        </div>
    );
}

// ─── Leader Card ──────────────────────────────────────────────────────────────

interface LeaderCardProps {
    leader: Leader;
    index: number;
    isVisible: boolean;
    t: (key: string) => string;
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
}

function LeaderCard({
    leader,
    index,
    isVisible,
    t,
    isPlaying,
    onPlay,
    onPause,
}: LeaderCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Sync media playback state explicitly per user play command
    useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play().catch(() => {});
        } else if (!isPlaying && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div
            className={`
                relative flex flex-col items-center
                transition-all duration-700
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{
                transitionDelay: `${index * 120}ms`,
            }}
        >
            <div
                className="relative w-[220px] h-[185px] lg:mt-[var(--y-offset)] max-lg:w-[260px] max-lg:h-[220px]"
                style={
                    {
                        "--y-offset": leader.yOffset,
                        marginTop: leader.yOffset,
                    } as React.CSSProperties
                }
            >
                <BlobShape variant={leader.blob} />

                <div
                    className="absolute inset-0 flex items-end justify-center overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                >
                    {/* Native Video Element */}
                    {leader.videoSrc && (
                        <video
                            ref={videoRef}
                            src={leader.videoSrc}
                            playsInline
                            loop
                            muted // Playback rules depend on typical browser configurations without strict interaction requirement prior to sound playing, but muted enables flawless auto-testing
                            onClick={isPlaying ? onPause : onPlay}
                            className={`absolute inset-0 w-[80%] h-[80%] my-auto mx-auto object-cover rounded-[15px] transition-all duration-300 cursor-pointer ${isPlaying ? "opacity-100 z-10 scale-110 shadow-lg" : "opacity-0 -z-10"}`}
                            onPlay={onPlay}
                            onPause={onPause}
                            onEnded={onPause}
                        />
                    )}

                    {leader.imageSrc ? (
                        <img
                            src={leader.imageSrc}
                            alt={t(leader.nameKey)}
                            className={`relative z-10 h-[95%] w-auto object-contain object-bottom transition-opacity duration-300 ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                        />
                    ) : (
                        <div
                            className={`relative z-10 w-28 h-36 bg-[#e1e1e1]/30 rounded-t-full flex items-end justify-center transition-opacity duration-300 ${isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                        >
                            <div className="w-16 h-20 bg-[#a4a3a3]/20 rounded-t-full" />
                        </div>
                    )}
                </div>

                {!isPlaying && (
                    <button
                        onClick={onPlay}
                        aria-label={`Play ${t(leader.nameKey)}'s video`}
                        className="
                            absolute z-20 bottom-4 left-4 max-lg:bottom-6 max-lg:left-6
                            w-11 h-11 max-lg:w-12 max-lg:h-12 rounded-full
                            bg-white shadow-lg
                            flex items-center justify-center
                            hover:scale-110 transition-transform duration-200
                            ring-2 ring-white/60
                        "
                    >
                        <Play className="w-4 h-4 max-lg:w-5 max-lg:h-5 text-[#24ade3] fill-[#24ade3] ml-0.5" />
                    </button>
                )}
            </div>

            <p className="mt-5 text-[16px] max-lg:pb-4 font-bold text-[#24ade3] tracking-wide max-lg:text-[15px] max-lg:mt-4">
                {t(leader.nameKey)}
            </p>
        </div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

function OurLeaders() {
    const { t, isRTL } = useLanguage("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollAbs = Math.abs(container.scrollLeft);
            const scrollWidth = container.scrollWidth - container.clientWidth;
            if (scrollWidth <= 0) {
                setActiveIndex(0);
                return;
            }
            const progress = scrollAbs / scrollWidth;
            const index = Math.min(
                LEADERS.length - 1,
                Math.max(0, Math.round(progress * (LEADERS.length - 1)))
            );
            setActiveIndex(index);
        };

        container.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => container.removeEventListener("scroll", handleScroll);
    }, [isRTL]);

    const scrollToLeader = (index: number) => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const children = container.children;
        // The embedded background SVG sits at children[0], so the leader cards begin dynamically at index + 1
        const childNode = children[index + 1];
        if (childNode) {
            childNode.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    };

    return (
        <section
            id="our-leaders"
            className="relative w-full py-16 lg:py-20 pb-16 z-50 bg-white overflow-hidden max-lg:bg-[#f6fdff]/40"
        >
            <BackgroundPattern />

            {/* ── Header ── */}
            <div
                ref={headerRef}
                className={`relative flex flex-col items-center justify-center gap-2 transition-all duration-700 delay-100 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                <div
                    className={`hidden lg:flex absolute top-0 ${isRTL ? "-right-[10%]" : "-left-[18%]"}  translate-x-0 w-full justify-center`}
                >
                    <Icons.General.WavyStroke />
                </div>

                <div
                    className={`lg:hidden absolute top-0 ${isRTL ? "-right-[25%]" : "-left-[20%]"}  translate-x-0 w-full flex justify-center`}
                >
                    <Icons.General.WavyStroke size={80} />
                </div>

                <ThemedText
                    size="6xl"
                    as="h1"
                    variant="heading"
                    className="relative flex items-center justify-center gap-2 mb-5 font-bold text-[#111111] max-lg:text-[34px] flex-wrap max-lg:w-full tracking-tight"
                    weight="bold"
                >
                    {t("ourLeaders.title")}
                    <ThemedText
                        size="6xl"
                        variant="heading"
                        as="span"
                        color="primary"
                        weight="bold"
                        className="text-brand-500 max-lg:text-[34px] relative tracking-tight whitespace-nowrap"
                    >
                        {" "}
                        {t("ourLeaders.titleHighlight")} {" ?"}
                    </ThemedText>
                </ThemedText>

                <ThemedText
                    size="2xl"
                    as="p"
                    variant="caption"
                    color="secondary"
                    className="text-[#7a7a7a] max-w-xl text-center font-semibold max-lg:text-[17px] max-lg:px-6"
                >
                    {t("ourLeaders.subtitle")}
                </ThemedText>
            </div>

            {/* ── Leaders + Road ── */}
            <div
                ref={gridRef}
                className="relative z-10 mx-auto px-6 mt-20 lg:px-12 max-lg:mt-12"
                style={{ maxWidth: 1200, minHeight: 380 }}
            >
                {/* Winding road behind cards (Desktop FIXED mode) */}
                <div
                    className="absolute inset-0 max-lg:hidden pointer-events-none max-lg:top-[20%] flex justify-center items-center w-full shadow-inner lg:min-w-[1200px]"
                    style={{ top: "30%", bottom: 0 }}
                >
                    <WindingRoad />
                </div>

                {/* Speech bubble */}
                <SpeechBubble t={t} />

                {/* 4 leader cards in a row */}
                <div
                    ref={scrollContainerRef}
                    className="relative flex flex-row lg:items-start lg:justify-between overflow-x-auto snap-x snap-mandatory no-scrollbar pb-10 lg:pb-0 gap-6 lg:gap-8 pt-8 max-lg:pt-20 max-lg:px-4"
                >
                    {/* Winding road embedded for Mobile Scroll-syncing natively. Absolutely docked into the left container padding edge scaling its width safely over child tracks */}
                    <div 
                        className="hidden max-lg:flex absolute top-[20%] pointer-events-none -z-10 items-start w-[360vw] sm:w-[1500px]"
                        style={{ left: isRTL ? 'auto' : 0, right: isRTL ? 0 : 'auto' }}
                    >
                        <WindingRoad />
                    </div>

                    {LEADERS.map((leader, index) => (
                        <div
                            key={leader.id}
                            className="flex-[0_0_auto] w-[85%] sm:w-[320px] lg:flex-1 lg:w-auto flex justify-center snap-center shrink-0"
                        >
                            <LeaderCard
                                leader={leader}
                                index={index}
                                isVisible={gridVisible}
                                t={t}
                                isPlaying={playingVideoId === leader.id}
                                onPlay={() => setPlayingVideoId(leader.id)}
                                onPause={() =>
                                    setPlayingVideoId((prev) =>
                                        prev === leader.id ? null : prev
                                    )
                                }
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile pagination dots (Exclusive to mobile view) */}
                <div className="flex lg:hidden justify-center items-center gap-3 mt-4 pb-4">
                    {LEADERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollToLeader(idx)}
                            className={`rounded-full transition-all duration-300 ${activeIndex === idx ? "w-[10px] h-[10px] bg-[#24ade3]" : "w-[8px] h-[8px] bg-[#e1e1e1] hover:bg-[#c2c1c1]"}`}
                            aria-label={`Go to leader ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OurLeaders;
