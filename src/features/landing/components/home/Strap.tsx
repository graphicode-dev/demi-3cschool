import { Icon } from "@iconify/react";
import { useScrollAnimation } from "../../hooks";
import { useLanguage } from "@/shared/hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StrapItem {
    id: string;
    labelKey: string;
    /** Optional iconify icon string */
    icon?: string;
    /** Optional image src (for ISO badge, Code.org logo, etc.) */
    imageSrc?: string;
    imageAlt?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STRAP_ITEMS: StrapItem[] = [
    {
        id: "iste",
        labelKey: "strap.iste",
        icon: "fluent:hat-graduation-24-regular",
    },
    {
        id: "iso",
        labelKey: "strap.iso",
        icon: "material-symbols:verified-outline-rounded",
    },
    {
        id: "codeorg-partner",
        labelKey: "strap.codeorgPartner",
        icon: "simple-icons:codeforces",
    },
    {
        id: "certified-educators",
        labelKey: "strap.certifiedEducators",
        icon: "fluent:certificate-24-regular",
    },
    {
        id: "stem",
        labelKey: "strap.stem",
        icon: "carbon:skill-level-advanced",
    },
    {
        id: "ministry",
        labelKey: "strap.ministry",
        icon: "carbon:badge",
    },
];

// ─── Separator ────────────────────────────────────────────────────────────────

function Separator() {
    return (
        <span
            className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300 mx-6 shrink-0 align-middle"
            aria-hidden="true"
        />
    );
}

// ─── Single Item ─────────────────────────────────────────────────────────────

function StrapBadge({
    item,
    t,
}: {
    item: StrapItem;
    t: (key: string) => string;
}) {
    return (
        <span className="inline-flex items-center gap-2.5 shrink-0 whitespace-nowrap">
            {item.imageSrc ? (
                <img
                    src={item.imageSrc}
                    alt={item.imageAlt ?? t(item.labelKey)}
                    className="h-6 w-auto object-contain opacity-60"
                />
            ) : item.icon ? (
                <Icon
                    icon={item.icon}
                    className="w-5 h-5 text-gray-400 shrink-0"
                />
            ) : null}

            <span className="text-[18px] sm:text-[22px] lg:text-base font-bold lg:font-medium text-gray-500 lg:text-gray-400 tracking-wide">
                {t(item.labelKey)}
            </span>
        </span>
    );
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────
// Duplicates items to create seamless infinite loop

function MarqueeRow({ t }: { t: (key: string) => string }) {
    // Duplicate 3× to ensure no gap at any screen width
    const items = [...STRAP_ITEMS, ...STRAP_ITEMS, ...STRAP_ITEMS];

    return (
        <div className="flex items-center animate-strap-scroll">
            {items.map((item, index) => (
                <span
                    key={`${item.id}-${index}`}
                    className="inline-flex items-center"
                >
                    <StrapBadge item={item} t={t} />
                    <Separator />
                </span>
            ))}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function Strap() {
    const { t } = useLanguage("landing");
    const { ref: strapRef, isVisible: strapVisible } = useScrollAnimation({
        threshold: 0.1,
    });
    return (
        <section
            ref={strapRef}
            className={`relative mt-20 w-full z-50 bg-[#dff1fb] border-y border-[#c5e4f5]/60 overflow-hidden transition-all duration-700 ${
                strapVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
            }`}
            aria-label="Accreditations and partnerships"
        >
            {/* Fade masks on left and right edges */}
            <div
                className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
                style={{
                    background:
                        "linear-gradient(to right, #dff1fb 0%, transparent 100%)",
                }}
            />
            <div
                className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
                style={{
                    background:
                        "linear-gradient(to left, #dff1fb 0%, transparent 100%)",
                }}
            />

            {/* Scrolling track */}
            <div
                className={`flex items-center py-4 lg:py-5 select-none transition-all duration-1000 ${
                    strapVisible ? "opacity-100" : "opacity-0"
                }`}
            >
                <MarqueeRow t={t} />
            </div>

            {/* Keyframe animation injected via style tag */}
            <style>{`
                @keyframes strap-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-33.3333%); }
                }
                .animate-strap-scroll {
                    animation: strap-scroll 28s linear infinite;
                    will-change: transform;
                    /* Pause on hover for accessibility */
                }
                @media (prefers-reduced-motion: reduce) {
                    .animate-strap-scroll {
                        animation: none;
                    }
                }
            `}</style>
        </section>
    );
}

export default Strap;
