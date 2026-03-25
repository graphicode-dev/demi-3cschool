import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";
import StatsSection from "./Statssection";
import { useLanguage } from "@/shared/hooks";

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
    const { t } = useLanguage("landing");
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
                        alt="Coding Cloud"
                        className="absolute top-4 right-0 sm:top-8 sm:-right-4 lg:top-12 lg:-right-8 w-[140px] sm:w-[180px] lg:w-[240px] object-contain pointer-events-none z-10"
                    />
                    {/* Heading */}
                    <div>
                        <ThemedText className="text-[36px] md:text-5xl" weight="bold" variant="heading">
                            {t("about.title")}{" "}
                            <ThemedText
                                className="text-[36px] md:text-5xl"
                                weight="bold"
                                color="primary"
                                as="span"
                            >
                                {t("about.titleHighlight")}
                            </ThemedText>
                        </ThemedText>

                        {/* Body paragraph */}
                        <div className="mt-6 sm:mt-8 mb-10 lg:mb-16 w-full flex justify-center px-1 sm:px-8 lg:px-16 relative z-20">
                            <div
                                className="text-center text-[14px] sm:text-[16px] md:text-2xl lg:text-3xl leading-relaxed capitalize w-full"
                                style={{ color: "var(--color-landing-text-secondary, #666666)" }}
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
                        className={`flex w-full overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 gap-4 sm:overflow-visible sm:pb-0 sm:flex-row sm:items-start sm:justify-center sm:gap-6 lg:gap-10 transition-all duration-700 ${
                            cardsVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8"
                        }`}
                    >
                        {cardsData.map((card, i) => (
                            <div
                                key={i}
                                className={`
                                w-[85%] max-w-[300px] snap-center shrink-0
                                sm:w-[260px] lg:w-[330px]
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

                    {/* Bottom Left Boy & Sticker Decorations */}
                    <div className="flex md:hidden absolute bottom-[-10px] sm:bottom-[-20px] lg:bottom-[-60px] left-[-10px] sm:left-[-20px] lg:left-0 z-30 pointer-events-none flex-col items-start translate-y-[20%] sm:translate-y-[15%]">
                        <img 
                            src={Images.landing.about.coding1}
                            alt="Start Coding Sticker"
                            className="w-landing-section-x sm:w-[110px] lg:w-[160px] object-contain ml-8 sm:ml-16 lg:ml-24 mb-[-10px] sm:mb-[-15px] lg:mb-[-25px] z-40 transform hover:scale-105 transition-transform"
                        />
                        <img 
                            src={Images.landing.about.kid}
                            alt="Kid with laptop"
                            className="w-[180px] sm:w-[250px] lg:w-[380px] object-contain z-30 drop-shadow-md"
                        />
                    </div>

                </div>
            </section>

            <div className="px-4 sm:px-8 lg:px-20 pt-10 sm:pt-18 w-full max-w-7xl mx-auto overflow-hidden">
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
            className="w-full px-5 sm:px-8 lg:px-12 pt-10 sm:pt-12 lg:pt-16 pb-16 lg:pb-20 flex flex-col items-center text-center"
            style={{
                backgroundImage: `url(${card.image})`,
                backgroundSize: "contain",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
                aspectRatio: "330 / 300",
            }}
        >
            <ThemedText className="text-[17px] sm:text-[20px] lg:text-[24px] leading-tight mb-3 sm:mb-4" weight="bold" variant="heading">
                {card.title}
            </ThemedText>
            <ThemedText className="text-[13px] sm:text-[15px] lg:text-[18px] leading-relaxed text-landing-text-secondary" variant="body" font="segoe-arabic">
                {card.description}
            </ThemedText>
        </div>
    );
}

export default AboutSection;
