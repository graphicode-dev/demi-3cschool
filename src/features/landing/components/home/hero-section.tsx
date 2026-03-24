import { Images } from "@/constants/images";
import { useLanguage } from "@/shared/hooks";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";
import KidsSlider from "./kids-slider";

function HeroSection() {
    const { t, isRTL } = useLanguage("landing");
    const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
    const { ref: sliderRef, isVisible: sliderVisible } = useScrollAnimation({
        threshold: 0.1,
    });

    return (
        <section
            ref={heroRef}
            id="hero"
            className={`relative w-full min-h-screen overflow-hidden transition-opacity duration-700 ${
                heroVisible ? "opacity-100" : "opacity-0"
            } flex flex-col items-center justify-evenly text-center pt-20`}
            style={{
                background: `url(${Images.landing.hero.bg}) no-repeat center center/cover`,
            }}
        >
            {/* Titles */}
            <div
                ref={sliderRef}
                className={`relative z-20 transition-all duration-1000 ${
                    sliderVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                } max-w-[80%] py-20`}
            >
                {/* Tagline */}
                <ThemedText weight="medium" color="primary" as="h3" className="text-[16px] sm:text-[18px] md:text-2xl mb-2 lg:mb-0">
                    {t("hero.tagline")}
                </ThemedText>

                {/* Title */}
                <div className="leading-[1.2] lg:leading-tight">
                    <ThemedText as="h1" weight="medium" className="text-[32px] sm:text-[44px] md:text-[56px] xl:text-6xl inline">
                        {t("hero.title1")}
                        <ThemedText
                            as="span"
                            color="primary"
                            weight="bold"
                            className="text-[32px] sm:text-[44px] md:text-[56px] xl:text-6xl inline mx-1"
                        >
                            {t("hero.titleCode")}
                        </ThemedText>
                        <ThemedText as="span" weight="medium" className="text-[32px] sm:text-[44px] md:text-[56px] xl:text-6xl inline">
                            {t("hero.title2")}
                        </ThemedText>
                    </ThemedText>
                </div>

                <div className="leading-[1.2] lg:leading-tight mt-0 md:mt-2">
                    <ThemedText as="h1" color="primary" weight="bold" className="text-[32px] sm:text-[44px] md:text-[56px] xl:text-6xl inline">
                        {t("hero.titleCreative")}
                        <ThemedText
                            as="span"
                            className="text-black text-[32px] sm:text-[44px] md:text-[56px] xl:text-6xl inline ml-2"
                            weight="medium"
                        >
                            {t("hero.title3")}
                        </ThemedText>
                    </ThemedText>
                </div>

                {/* Subtitle */}
                {t("hero.subtitle") && (
                    <ThemedText
                        weight="medium"
                        color="secondary"
                        className="mt-4 lg:mt-6 text-[14px] sm:text-[16px] md:text-2xl"
                    >
                        {t("hero.subtitle")}
                    </ThemedText>
                )}
                {/* Images */}
                <>
                    <img
                        src={Images.landing.hero.coding}
                        alt="Coding badge"
                        className={`w-20 sm:w-28 lg:w-50 h-auto object-contain absolute opacity-90 lg:opacity-100 top-[-20px] lg:top-0 ${isRTL ? "-right-8 sm:-right-16 lg:-right-50" : "-left-8 sm:-left-16 lg:-left-50"}`}
                    />
                    <img
                        src={Images.landing.hero.leftCoding}
                        alt="Code block snippet"
                        className={`w-28 sm:w-36 lg:w-50 h-auto object-contain absolute opacity-90 lg:opacity-100 bottom-4 lg:bottom-0 ${isRTL ? "-right-12 sm:-right-24 lg:-right-50" : "-left-12 sm:-left-24 lg:-left-50"}`}
                    />
                    <img
                        src={Images.landing.hero.hello}
                        alt="Hello sticker"
                        className={`w-20 sm:w-28 lg:w-50 h-auto object-contain absolute opacity-90 lg:opacity-100 bottom-6 lg:bottom-0 ${isRTL ? "-left-6 sm:-left-16 lg:-left-50" : "-right-6 sm:-right-16 lg:-right-50"}`}
                    />
                    <img
                        src={Images.landing.hero.rightCoding}
                        alt="Decoration"
                        className={`w-16 sm:w-24 lg:w-50 h-auto object-contain absolute opacity-0 lg:opacity-100 top-10 lg:top-0 ${isRTL ? "-left-10 sm:-left-20 lg:-left-50" : "-right-10 sm:-right-20 lg:-right-50"}`}
                    />
                </>
            </div>

            {/* Auto-sliding Kid Cards */}
            <KidsSlider />
        </section>
    );
}

export default HeroSection;
