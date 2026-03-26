import React, { useState, useRef, useCallback } from "react";
import { Icons } from "@/constants";
import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";
import { useLanguage } from "@/shared/hooks";
interface CardData {
    id: number;
    titleKey: string;
    descriptionKey: string;
    /** Whether this card is "prominent" (darker bg, index 0, 2, 4) */
    prominent: boolean;
}

// Card data based on Figma designs
const CARDS: CardData[] = [
    {
        id: 1,
        titleKey: "why3C.cards.smallClass.title",
        descriptionKey: "why3C.cards.smallClass.description",
        prominent: true,
    },
    {
        id: 2,
        titleKey: "why3C.cards.projectBased.title",
        descriptionKey: "why3C.cards.projectBased.description",
        prominent: false,
    },
    {
        id: 3,
        titleKey: "why3C.cards.industryStandard.title",
        descriptionKey: "why3C.cards.industryStandard.description",
        prominent: false,
    },
    {
        id: 4,
        titleKey: "why3C.cards.passionMentors.title",
        descriptionKey: "why3C.cards.passionMentors.description",
        prominent: false,
    },
    {
        id: 5,
        titleKey: "why3C.cards.certification.title",
        descriptionKey: "why3C.cards.certification.description",
        prominent: false,
    },
];

interface Why3CCardProps {
    card: CardData;
    index: number;
    isVisible: boolean;
    isRtl: boolean;
    t: (key: string) => string;
    onSelectBanner: (banner: number) => void;
}

function Why3CCard({
    card,
    index,
    isVisible,
    isRtl,
    t,
    onSelectBanner,
}: Why3CCardProps) {
    const isEven = index % 2 === 0;

    return (
        <div
            className={`
                transition-all duration-500
                w-full lg:w-[80%] max-w-[280px] sm:max-w-[340px] lg:max-w-none shrink-0 snap-center lg:shrink lg:snap-align-none
                ${isEven ? (isRtl ? "lg:mr-[20%] lg:ml-0" : "lg:ml-[20%]") : isRtl ? "lg:mr-0" : "lg:ml-0"}
                mx-auto lg:mx-0 cursor-pointer hover:scale-105 transition-all duration-300
            `}
            style={{ transitionDelay: `${index * 80}ms` }}
            onClick={() => onSelectBanner(card.id)}
        >
            <div
                className={`
                    relative px-4 py-6 sm:px-6 lg:px-7 lg:py-5 w-full flex lg:block flex-col lg:flex-none items-center lg:items-stretch text-center lg:text-left
                    ${
                        isEven
                            ? "rounded-[32px] lg:rounded-[26px] lg:rounded-bl-none"
                            : "rounded-[32px] lg:rounded-[26px] lg:rounded-tr-none"
                    }
                    ${index === 0 ? "bg-[#90d4ed] lg:bg-[#6cc8ec] lg:shadow-[inset_0_4px_8px_#00000020,0_2px_8px_#00000020]" : "bg-[#bbe6f6]"}
                    ${
                        isVisible
                            ? "opacity-100 translate-x-0"
                            : isEven
                              ? "opacity-0 translate-x-8"
                              : "opacity-0 -translate-x-8"
                    }
                    transition-all duration-500
                    overflow-visible
                `}
                style={{
                    transitionDelay: `${index * 100}ms`,
                    // boxShadow: "inset 0 4px 8px #00000020, 0 2px 8px #00000020",
                }}
            >
                {/* Desktop Cursor */}
                {index === 0 && (
                    <div className="absolute -bottom-6 -right-4 lg:-right-6 z-10 hidden lg:block">
                        <img
                            src={Images.landing.whyChoose3c.cursor}
                            alt="cursor"
                        />
                    </div>
                )}

                {/* Desktop Text */}
                <ThemedText
                    weight="semibold"
                    size="xl"
                    className="text-[#393838] hidden lg:block"
                >
                    {t(card.titleKey)}
                </ThemedText>
                <ThemedText
                    size="base"
                    className={`${isEven ? "text-[#4b4a4a]" : "text-[#616060]"} hidden lg:block`}
                >
                    {t(card.descriptionKey)}
                </ThemedText>

                {/* Mobile Text */}
                <ThemedText
                    weight="bold"
                    className="text-[17px] sm:text-[20px] text-[#393838] mb-1 sm:mb-2 lg:hidden"
                >
                    {t(card.titleKey)}
                </ThemedText>
                <ThemedText
                    className={`text-[13px] sm:text-[14px] leading-snug ${isEven ? "text-[#4b4a4a]" : "text-[#616060]"} lg:hidden`}
                >
                    {t(card.descriptionKey)}
                </ThemedText>
            </div>
        </div>
    );
}

function CardConnector() {
    return (
        <div className="flex justify-center my-1 pointer-events-none select-none">
            <Icons.Landing.Why3C.StrokeLine size={40} />
        </div>
    );
}

function Why3C() {
    const { t, isRTL } = useLanguage("landing");
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

    const banners = [
        { id: 1, img: Images.landing.whyChoose3c.banner1 },
        { id: 2, img: Images.landing.whyChoose3c.banner2 },
        { id: 3, img: Images.landing.whyChoose3c.banner3 },
        { id: 4, img: Images.landing.whyChoose3c.banner4 },
        { id: 5, img: Images.landing.whyChoose3c.banner5 },
    ];

    const [selectedBanner, setSelectedBanner] = useState<string>(
        banners[0].img
    );

    const handleSelectBanner = useCallback((cardid: number) => {
        const banner = banners.find((banner) => banner.id === cardid);
        if (banner) {
            setSelectedBanner(banner.img);
        }
    }, []);

    const carouselRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = () => {
        if (!carouselRef.current) return;
        const { scrollLeft, clientWidth } = carouselRef.current;
        const index = Math.round(Math.abs(scrollLeft) / clientWidth);
        setActiveIndex(index);
    };

    const scrollTo = (index: number) => {
        if (!carouselRef.current) return;
        const { clientWidth } = carouselRef.current;
        carouselRef.current.scrollTo({
            left: (isRTL ? -1 : 1) * index * clientWidth,
            behavior: "smooth",
        });
        setActiveIndex(index);
    };

    return (
        <section
            id="why-3c"
            className="relative w-full py-20 px-20 pb-70 mt-20 z-50 bg-brand-50"
        >
            {/* Header */}
            <div className="relative flex flex-col items-center justify-center gap-2">
                {/* Background stars & clouds */}
                <div className="absolute -top-10 left-0 w-full pointer-events-none z-0 hidden lg:block">
                    <div className="absolute top-0 left-5">
                        <Icons.General.star />
                    </div>
                    <div className="absolute top-10 left-20">
                        <Icons.General.star size={35} />
                    </div>
                    <div className="absolute top-10 left-40">
                        <Icons.General.cloud />
                    </div>
                    <div className="absolute top-0 left-90">
                        <Icons.General.cloud />
                    </div>
                </div>

                {/* Mobile version clouds (fainter/positioned specifically) */}
                <div className="absolute -top-10 left-0 w-full lg:hidden pointer-events-none z-0">
                    <div className="absolute top-0 left-[10%] opacity-70">
                        <Icons.General.star />
                    </div>
                    <div className="absolute top-10 left-[25%] opacity-70">
                        <Icons.General.star size={35} />
                    </div>
                    <div className="absolute top-8 left-[40%] opacity-50">
                        <Icons.General.cloud />
                    </div>
                    <div className="absolute top-0 right-[10%] opacity-50">
                        <Icons.General.cloud />
                    </div>
                </div>

                <ThemedText
                    as="h1"
                    variant="heading"
                    className="relative flex items-center justify-center gap-1 sm:gap-2 lg:mb-5 text-[28px] sm:text-[36px] lg:text-[60px] leading-tight text-center z-20 whitespace-nowrap"
                    weight="bold"
                >
                    {t("why3C.title")}
                    <ThemedText
                        variant="heading"
                        as="span"
                        color="primary"
                        weight="bold"
                        className="text-[28px] sm:text-[36px] lg:text-[60px] leading-tight"
                    >
                        {" "}
                        {t("why3C.titleHighlight")}
                    </ThemedText>
                    {/* Wavy Stroke (Mobile + Desktop variants) */}
                    <div
                        className={`hidden lg:block absolute top-0 ${isRTL ? "-right-[25%]" : "left-[13%]"} -translate-x-1/2 pointer-events-none -z-10`}
                    >
                        <Icons.General.WavyStroke />
                    </div>
                    <div
                        className={`block lg:hidden absolute -bottom-12 ${isRTL ? "-right-[25%]" : "left-[13%]"} -translate-x-1/2 pointer-events-none -z-10`}
                    >
                        <Icons.General.WavyStroke size={80} />
                    </div>
                </ThemedText>

                <ThemedText
                    as="p"
                    variant="caption"
                    className="text-center text-[13px] sm:text-[15px] lg:text-[24px] max-w-[280px] sm:max-w-md lg:max-w-none mx-auto leading-relaxed lg:leading-normal text-landing-text-secondary lg:text-[#616060] w-full lowercase opacity-90 lg:opacity-100 z-20 mt-1 lg:mt-0"
                >
                    {t("why3C.subtitle")}
                </ThemedText>

                {/* Kids That Code sticker */}
                <img
                    src={Images.landing.whyChoose3c.kidsThatCode}
                    alt="Kids that code"
                    className="absolute -bottom-40 right-0 hidden lg:block pointer-events-none z-30"
                />

                <div className="w-full relative flex justify-end mt-2 max-w-[320px] sm:max-w-md mx-auto h-[50px] sm:h-[60px] lg:hidden mb-2 sm:mb-6 z-30">
                    <img
                        src={Images.landing.whyChoose3c.kidsThatCode}
                        alt="Kids that code"
                        className="absolute top-0 right-2 sm:right-10 w-landing-section-x sm:w-[100px] object-contain pointer-events-none"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-2 lg:mt-32">
                {/* Image */}
                <div className="relative w-full max-w-[320px] sm:max-w-md lg:max-w-none lg:w-1/2 mx-auto lg:mx-0">
                    <img
                        src={selectedBanner}
                        alt="Kids that code"
                        className="w-full h-[300px] sm:h-[400px] lg:h-[550px] relative z-20 object-cover rounded-2xl drop-shadow-sm lg:drop-shadow-none transition-all duration-300"
                    />

                    <img
                        src={Images.landing.whyChoose3c.keyboard}
                        alt="Keyboard"
                        className="hidden lg:block absolute -bottom-30 -left-10 w-30 z-30 pointer-events-none"
                    />
                </div>

                {/* Right – Staggered Cards */}
                <div
                    ref={cardsRef}
                    className={`w-full lg:w-1/2 relative ${isRTL ? "lg:-mr-[8%]" : "lg:-ml-[8%]"} lg:mt-16 flex flex-col items-center lg:items-stretch overflow-visible z-50`}
                >
                    {/* Mobile Carousel Wrapper */}
                    <div
                        ref={carouselRef}
                        onScroll={handleScroll}
                        className="w-screen lg:w-full lg:ml-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none no-scrollbar pb-6 lg:pb-0 scroll-smooth"
                    >
                        {CARDS.map((card, index) => (
                            <div
                                key={card.id}
                                className="flex shrink-0 lg:shrink flex-row lg:flex-col justify-center items-center lg:items-stretch w-screen lg:w-auto px-4 sm:px-8 lg:px-0 scroll-ml-0 lg:scroll-ml-auto"
                            >
                                <Why3CCard
                                    card={card}
                                    index={index}
                                    isVisible={cardsVisible}
                                    isRtl={isRTL}
                                    t={t}
                                    onSelectBanner={() =>
                                        handleSelectBanner(card.id)
                                    }
                                />

                                {/* Orange dashed connector between cards */}
                                {index < CARDS.length - 1 && (
                                    <div className="hidden lg:block w-full">
                                        <CardConnector />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Visual Mobile Pagination Dots */}
                    <div className="flex lg:hidden items-center justify-center gap-2 mt-2 z-40 relative w-full mb-8">
                        {CARDS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={`h-[8px] rounded-full drop-shadow-sm transition-all duration-300 ${
                                    activeIndex === i
                                        ? "bg-brand-500 w-[14px] opacity-100"
                                        : "bg-white opacity-70 w-[8px]"
                                }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Arch Circles */}
            <div
                className={
                    "absolute -bottom-[12%] left-1/2 transform -translate-x-1/2 translate-y-[15%] rotate-180 w-full flex justify-center items-center overflow-hidden pointer-events-none z-50"
                }
            >
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="w-100 h-100 bg-white rounded-full"
                    />
                ))}
            </div>
        </section>
    );
}
export default Why3C;
