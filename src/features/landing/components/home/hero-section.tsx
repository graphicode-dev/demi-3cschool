import { useEffect, useState } from "react";
import { Images } from "@/constants/images";
import { useLanguage } from "@/shared/hooks";
import ThemedText from "@/design-system/components/ThemedText";
import KidsSlider from "./kids-slider";

function HeroSection() {
    const { t, isRTL } = useLanguage("landing");

    return (
        <section
            id="home"
            className="w-full min-h-screen flex flex-col items-center justify-evenly text-center pt-20"
            style={{
                background: `url(${Images.landing.hero.bg}) no-repeat center center/cover`,
            }}
        >
            {/* Titles */}
            <div className="relative max-w-[80%] py-20">
                {/* Tagline */}
                <ThemedText weight="medium" size="2xl" color="primary" as="h3">
                    {t("hero.tagline")}
                </ThemedText>

                {/* Title */}
                <ThemedText as="h1" size="6xl" weight="medium">
                    {t("hero.title1")}
                    <ThemedText
                        as="span"
                        size="6xl"
                        color="primary"
                        weight="bold"
                    >
                        {t("hero.titleCode")}
                    </ThemedText>
                    <ThemedText as="span" size="6xl" weight="medium">
                        {t("hero.title2")}
                    </ThemedText>
                </ThemedText>

                <ThemedText as="h1" size="6xl" color="primary" weight="bold">
                    {t("hero.titleCreative")}
                    <ThemedText
                        as="span"
                        size="6xl"
                        className="text-black"
                        weight="medium"
                    >
                        {t("hero.title3")}
                    </ThemedText>
                </ThemedText>

                {/* Subtitle */}
                <ThemedText
                    weight="medium"
                    size="2xl"
                    color="secondary"
                    className="mt-4"
                >
                    {t("hero.subtitle")}
                </ThemedText>
                {/* Images */}
                <>
                    <img
                        src={Images.landing.hero.coding}
                        alt="Kid 1"
                        className={`w-50 h-50 object-contain hidden lg:block absolute top-0 ${isRTL ? "-right-50" : "-left-50"}`}
                    />
                    <img
                        src={Images.landing.hero.leftCoding}
                        alt="Kid 3"
                        className={`w-50 h-50 object-contain hidden lg:block absolute bottom-0 ${isRTL ? "-right-50" : "-left-50"}`}
                    />
                    <img
                        src={Images.landing.hero.hello}
                        alt="Kid 2"
                        className={`w-50 h-50 object-contain hidden lg:block absolute bottom-0 ${isRTL ? "-left-50" : "-right-50"}`}
                    />
                    <img
                        src={Images.landing.hero.rightCoding}
                        alt="Kid 3"
                        className={`w-50 h-50 object-contain hidden lg:block absolute top-0 ${isRTL ? "-left-50" : "-right-50"}`}
                    />
                </>
            </div>

            {/* Auto-sliding Kid Cards */}
            <KidsSlider />
        </section>
    );
}

export default HeroSection;
