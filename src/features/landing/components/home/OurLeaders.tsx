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
    /** vertical offset from baseline — alternates high/low */
    yOffset: string;
    /** blob shape variant */
    blob: 1 | 2 | 3 | 4;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const LEADERS: Leader[] = [
    { id: "alya", nameKey: "ourLeaders.leaders.alya", yOffset: "0px", blob: 1 },
    {
        id: "omar",
        nameKey: "ourLeaders.leaders.omar",
        yOffset: "80px",
        blob: 2,
    },
    {
        id: "zein",
        nameKey: "ourLeaders.leaders.zein",
        yOffset: "60px",
        blob: 3,
    },
    {
        id: "farida",
        nameKey: "ourLeaders.leaders.farida",
        yOffset: "0px",
        blob: 4,
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
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1200 380"
            preserveAspectRatio="none"
            aria-hidden="true"
            style={{ zIndex: 0 }}
        >
            {/* Road base – thick blue stroke */}
            <path
                d="M -20,180 C 80,180 120,130 200,140 C 280,150 310,200 380,210 C 440,218 480,170 560,160 C 640,150 670,220 750,230 C 820,238 860,175 940,165 C 1020,155 1060,200 1140,190 C 1180,185 1210,180 1240,175"
                fill="none"
                stroke="#5bc8e8"
                strokeWidth="28"
                strokeLinecap="round"
            />
            {/* Dashed white center line */}
            <path
                d="M -20,180 C 80,180 120,130 200,140 C 280,150 310,200 380,210 C 440,218 480,170 560,160 C 640,150 670,220 750,230 C 820,238 860,175 940,165 C 1020,155 1060,200 1140,190 C 1180,185 1210,180 1240,175"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="18 14"
            />
        </svg>
    );
}

// ─── Background Pattern ───────────────────────────────────────────────────────

function BackgroundPattern() {
    // Faint tech/coding icon silhouettes
    const icons = [
        { x: 30, y: 60, r: 0, icon: "⌨" },
        { x: 120, y: 20, r: -15, icon: "🖥" },
        { x: 950, y: 40, r: 10, icon: "💡" },
        { x: 1050, y: 80, r: -8, icon: "⚙" },
        { x: 60, y: 280, r: 12, icon: "🔧" },
        { x: 1100, y: 260, r: -5, icon: "📱" },
    ];

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
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
            className="absolute z-20 pointer-events-none"
            style={{ left: "23%", top: "2%" }}
        >
            <div
                className="relative bg-white border-2 border-brand-400 rounded-[18px] px-5 py-3 text-center shadow-md"
                style={{ minWidth: 140 }}
            >
                <p className="text-sm font-semibold text-gray-700 leading-snug">
                    {t("ourLeaders.speechBubble.line1")}
                    <br />
                    {t("ourLeaders.speechBubble.line2")}
                </p>
                {/* Tail pointing down-left */}
                <svg
                    className="absolute -bottom-4 left-6"
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
}

function LeaderCard({ leader, index, isVisible, t }: LeaderCardProps) {
    return (
        <div
            className={`
                relative flex flex-col items-center
                transition-all duration-700
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            `}
            style={{
                transitionDelay: `${index * 120}ms`,
                marginTop: leader.yOffset,
            }}
        >
            {/* Blob + kid photo */}
            <div className="relative" style={{ width: 220, height: 185 }}>
                {/* Blob background */}
                <BlobShape variant={leader.blob} />

                {/* Kid image — replace src with real asset */}
                <div
                    className="absolute inset-0 flex items-end justify-center overflow-hidden"
                    style={{ borderRadius: "inherit" }}
                >
                    {leader.imageSrc ? (
                        <img
                            src={leader.imageSrc}
                            alt={t(leader.nameKey)}
                            className="relative z-10 h-[95%] w-auto object-contain object-bottom"
                        />
                    ) : (
                        // Placeholder silhouette
                        <div className="relative z-10 w-28 h-36 bg-brand-300/30 rounded-t-full flex items-end justify-center">
                            <div className="w-16 h-20 bg-brand-400/20 rounded-t-full" />
                        </div>
                    )}
                </div>

                {/* Play button */}
                <button
                    aria-label={`Play ${t(leader.nameKey)}'s video`}
                    className="
                        absolute z-20 bottom-4 left-4
                        w-11 h-11 rounded-full
                        bg-white shadow-lg
                        flex items-center justify-center
                        hover:scale-110 transition-transform duration-200
                        ring-2 ring-white/60
                    "
                >
                    <Play className="w-4 h-4 text-brand-500 fill-brand-500 ml-0.5" />
                </button>
            </div>

            {/* Name */}
            <p className="mt-3 text-base font-semibold text-brand-500 tracking-wide">
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

    return (
        <section
            id="our-leaders"
            className="relative w-full py-16 lg:py-20 pb-16 z-50 bg-white overflow-hidden"
        >
            <BackgroundPattern />

            {/* ── Header ── */}
            <div className="relative flex flex-col items-center justify-center gap-2">
                <ThemedText
                    size="6xl"
                    as="h1"
                    variant="heading"
                    className="relative flex items-center justify-center gap-2 mb-5"
                    weight="semibold"
                >
                    {t("ourLeaders.title")}
                    <ThemedText
                        size="6xl"
                        variant="heading"
                        as="span"
                        color="primary"
                        weight="semibold"
                    >
                        {" "}
                        {t("ourLeaders.titleHighlight")}
                    </ThemedText>
                    <div
                        className={`absolute top-0 ${isRTL ? "-right-[25%]" : "left-[13%]"}  -translate-x-1/2`}
                    >
                        <Icons.General.WavyStroke />
                    </div>
                </ThemedText>

                <ThemedText
                    size="2xl"
                    as="p"
                    variant="caption"
                    color="secondary"
                >
                    {t("ourLeaders.subtitle")}
                </ThemedText>
            </div>

            {/* ── Leaders + Road ── */}
            <div
                ref={gridRef}
                className="relative z-10 mx-auto px-6 mt-20 lg:px-12"
                style={{ maxWidth: 1200, minHeight: 380 }}
            >
                {/* Winding road behind cards */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ top: "30%", bottom: 0 }}
                >
                    <WindingRoad />
                </div>

                {/* Speech bubble above 2nd kid */}
                <SpeechBubble t={t} />

                {/* 4 leader cards in a row */}
                <div className="relative flex items-start justify-between gap-4 lg:gap-8 pt-8">
                    {LEADERS.map((leader, index) => (
                        <div
                            key={leader.id}
                            className="flex-1 flex justify-center"
                        >
                            <LeaderCard
                                leader={leader}
                                index={index}
                                isVisible={gridVisible}
                                t={t}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OurLeaders;
