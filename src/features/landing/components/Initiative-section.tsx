import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import { Icon } from "@iconify/react";
import LongArrow from "@/assets/images/landing/long-arrow.png";

const features = [
    {
        icon: "mingcute:earth-4-line",
        textColor: "text-brand-500",
        iconBg: "bg-brand-500/10",
        titleKey: "initiative.feature1.title",
        descKey: "initiative.feature1.description",
    },
    {
        icon: "mdi-light:heart",
        textColor: "text-success-500",
        iconBg: "bg-success-500/10",
        titleKey: "initiative.feature2.title",
        descKey: "initiative.feature2.description",
    },
    {
        icon: "stash:chart-trend-up-light",
        textColor: "text-warning-500",
        iconBg: "bg-warning-500/10",
        titleKey: "initiative.feature3.title",
        descKey: "initiative.feature3.description",
    },
];

function InitiativeSection() {
    const { t } = useTranslation("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

    return (
        <section
            id="about"
            className="relative z-50 py-16 lg:py-30 bg-brand-50 overflow-hidden"
        >
            {/* Decorative Elements - Left Swirl */}
            <div className="hidden lg:block absolute left-[8%] top-[20%]">
                <img
                    src={LongArrow}
                    alt=""
                    className="w-[136px] h-[120px] rotate-90 rotate-x-180"
                />
            </div>

            {/* Decorative Elements - Right Swirl */}
            <div className="hidden lg:block absolute right-[8%] top-[20%]">
                <img
                    src={LongArrow}
                    alt=""
                    className="w-[136px] h-[120px] rotate-90"
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 lg:mb-20 transition-all duration-700 ${
                        headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="font-bold text-3xl sm:text-4xl lg:text-[54px] lg:leading-[64px] text-gray-800 mb-4 lg:mb-6">
                        {t("initiative.title")}
                    </h2>
                    <p className="text-lg lg:text-[26px] lg:leading-[35px] text-gray-500 max-w-[874px] mx-auto">
                        {t("initiative.description")}
                    </p>
                </div>

                {/* Cards Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-white rounded-[30px] p-8 lg:p-10 shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group ${
                                cardsVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Icon */}
                            <div
                                className={`w-16 h-16 lg:w-20 lg:h-20 ${feature.iconBg} rounded-[20px] flex items-center justify-center mb-6 lg:mb-8 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <Icon
                                    icon={feature.icon}
                                    className={`w-8 h-8 lg:w-10 lg:h-10 ${feature.textColor}`}
                                />
                            </div>

                            {/* Title */}
                            <h3 className="font-semibold text-xl lg:text-[35px] lg:leading-[50px] text-gray-800 mb-3 lg:mb-4 group-hover:text-brand-500 transition-colors duration-300">
                                {t(feature.titleKey)}
                            </h3>

                            {/* Description */}
                            <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-500">
                                {t(feature.descKey)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default InitiativeSection;
