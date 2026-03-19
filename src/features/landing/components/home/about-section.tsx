import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../hooks";
import StatsSection from "./Statssection";

/**
 * AboutSection — Background Image Strategy
 * ─────────────────────────────────────────
 *
 * ROOT CAUSE (why red was disappearing):
 *   The sectionBg image has WHITE at the top and RED in the lower/middle area.
 *   Using `object-position: top` with an <img> was showing only the white top,
 *   hiding the red entirely.
 *   Using `object-position: center` was fine visually at one viewport but
 *   the section had no defined height, so the image had no room to render.
 *
 * FIX — Intrinsic-ratio locking via CSS background-image:
 *
 *   1. Apply background-image directly on the section element (not an <img> tag).
 *      This makes it a TRUE decorative background, fully controllable via CSS.
 *
 *   2. Use `background-size: cover` + `background-position: center bottom`.
 *      "center bottom" anchors the bottom of the image (where the white wave
 *      sits) to the bottom of the section, and centers horizontally.
 *      The red blob in the middle/lower area is always visible this way.
 *
 *   3. Lock the section to the image's natural aspect ratio using a
 *      percentage padding-bottom trick:
 *        padding-bottom = (imageHeight / imageWidth) * 100%
 *      The Figma design canvas is ~1440×900 → ratio = 900/1440 = 62.5%
 *      So `padding-bottom: 62.5%` makes the section always the same shape
 *      as the source image, on EVERY viewport width. Zero cropping.
 *
 *   4. Content is placed inside an absolutely-positioned inner div
 *      that covers the same space, so text and cards overlay correctly.
 *
 * CARD STAGGER:
 *   Figma shows each card offset 70px lower than the previous (cascade effect).
 *   We use Tailwind arbitrary `mt-[Npx]` with `sm:` prefix so:
 *     - Mobile  → vertical stack, no stagger (legible on small screens)
 *     - sm+     → horizontal row with 70px-per-card downward cascade
 */

// Per-card top offset in the staggered row (matches Figma)
const CARD_STAGGER_CLASSES = [
    "sm:mt-0",
    "sm:mt-[70px]",
    "sm:mt-[140px]",
] as const;

interface CardData {
    title: string;
    description: string;
    image: string;
}

function AboutSection() {
    const { t } = useTranslation("landing");
    const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({
        threshold: 0.2,
    });

    const cardsData: CardData[] = [
        {
            title: t("about.cards.funLearning.title"),
            description: t("about.cards.funLearning.description"),
            image: Images.landing.about.cardBlue,
        },
        {
            title: t("about.cards.ageAppropriate.title"),
            description: t("about.cards.ageAppropriate.description"),
            image: Images.landing.about.cardOrange,
        },
        {
            title: t("about.cards.safeEnvironment.title"),
            description: t("about.cards.safeEnvironment.description"),
            image: Images.landing.about.cardWhite,
        },
    ];

    return (
        <>
            <section
                ref={sectionRef}
                id="about-us"
                className={`relative w-full z-50 transition-opacity duration-700 ${
                    sectionVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{
                    paddingBottom: "62.5%",
                    backgroundImage: `url(${Images.landing.about.sectionBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center bottom",
                    backgroundRepeat: "no-repeat",
                    minHeight: "100vh",
                }}
            >
                <div className="absolute inset-0 w-full h-full flex flex-col px-4 sm:px-10 lg:px-20 pt-16 lg:pt-20">
                    <img
                        src={Images.landing.about.coding2}
                        alt=""
                        className="w-1/5 object-cover self-end"
                    />
                    {/* Heading */}
                    <div>
                        <ThemedText size="5xl" weight="bold" variant="heading">
                            {t("about.title")}{" "}
                            <ThemedText
                                size="5xl"
                                weight="bold"
                                color="primary"
                                as="span"
                            >
                                {t("about.titleHighlight")}
                            </ThemedText>
                        </ThemedText>

                        {/* Body paragraph */}
                        <div className="mt-4 ps-0 sm:ps-8 lg:ps-20 mb-8 lg:mb-14">
                            <div
                                className="text-justify text-3xl"
                                style={{ color: "var(--secondary)" }}
                                dangerouslySetInnerHTML={{
                                    __html: t("about.description", {
                                        highlight:
                                            '<span style="font-weight: bold; color: var(--color-brand-500);">',
                                        "/highlight": "</span>",
                                    }),
                                }}
                            />
                        </div>
                    </div>

                    {/* Cards */}
                    <div
                        ref={cardsRef}
                        className={`flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-6 lg:gap-10 transition-all duration-700 ${
                            cardsVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}
                    >
                        {cardsData.map((card, i) => (
                            <div
                                key={i}
                                className={`
                                w-full max-w-[330px]
                                sm:w-[260px] lg:w-[330px]
                                shrink-0
                                ${CARD_STAGGER_CLASSES[i]}
                                transition-all duration-700
                                ${cardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                            `}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <AboutCard card={card} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="px-20 pt-18">
                <StatsSection />
            </div>
        </>
    );
}

interface AboutCardProps {
    card: CardData;
}

function AboutCard({ card }: AboutCardProps) {
    return (
        <div
            className="w-full px-6 sm:px-8 lg:px-13 pt-5 lg:pt-6 pb-16 lg:pb-20"
            style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                aspectRatio: "330 / 280",
            }}
        >
            <ThemedText size="xl" weight="bold" variant="heading">
                {card.title}
            </ThemedText>
            <ThemedText size="xl" variant="body" font="segoe-arabic">
                {card.description}
            </ThemedText>
        </div>
    );
}

export default AboutSection;
