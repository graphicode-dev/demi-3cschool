import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import OnlineImage from "@/assets/images/landing/learning-1.png";
import OfflineImage from "@/assets/images/landing/learning-2.png";
import { Check, Monitor, Users } from "lucide-react";

const onlineFeatures = [
    { icon: Check, textKey: "learningMode.online.feature1" },
    { icon: Check, textKey: "learningMode.online.feature2" },
    { icon: Check, textKey: "learningMode.online.feature3" },
    { icon: Check, textKey: "learningMode.online.feature4" },
];

const offlineFeatures = [
    { icon: Check, textKey: "learningMode.offline.feature1" },
    {
        icon: Check,
        textKey: "learningMode.offline.feature2",
    },
    { icon: Check, textKey: "learningMode.offline.feature3" },
    { icon: Check, textKey: "learningMode.offline.feature4" },
];

function LearningModeSection() {
    const { t } = useTranslation("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

    return (
        <section className="relative z-50 py-16 lg:py-30 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-8">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-12 lg:mb-20 transition-all duration-700 ${
                        headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="font-bold text-3xl sm:text-4xl lg:text-[50px] lg:leading-[65px] text-gray-800 mb-4 lg:mb-6">
                        {t("learningMode.title")}
                    </h2>
                    <p className="text-lg lg:text-[26px] lg:leading-[35px] text-gray-500">
                        {t("learningMode.description")}
                    </p>
                </div>

                {/* Learning Modes Grid */}
                <div
                    ref={cardsRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10"
                >
                    {/* Online Learning Card */}
                    <div
                        className={`rounded-[30px] border-2 border-brand-500/20 p-6 lg:p-10 transition-all duration-700 hover:shadow-xl ${
                            cardsVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{
                            background:
                                "linear-linear(136deg, rgba(0, 174, 237, 0.05) 0%, rgba(30, 93, 184, 0.05) 100%)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-500 rounded-[20px] flex items-center justify-center shrink-0">
                                <Monitor className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-2xl lg:text-[35px] lg:leading-[49px] text-gray-800">
                                    {t("learningMode.online.title")}
                                </h3>
                                <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-500">
                                    {t("learningMode.online.subtitle")}
                                </p>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="rounded-[20px] overflow-hidden mb-6 lg:mb-8 group">
                            <img
                                src={OnlineImage}
                                alt="Online learning"
                                className="w-full h-48 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 lg:space-y-4">
                            {onlineFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 lg:gap-4 group"
                                >
                                    <div className="w-7 h-7 lg:w-[30px] lg:h-[30px] bg-brand-500 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                    </div>
                                    <span className="text-base lg:text-[20px] lg:leading-[32px] text-gray-800">
                                        {t(feature.textKey)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Offline Learning Card */}
                    <div
                        className={`rounded-[30px] border-2 border-success-500/20 p-6 lg:p-10 transition-all duration-700 delay-200 hover:shadow-xl ${
                            cardsVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                        style={{
                            background:
                                "linear-linear(136deg, rgba(43, 182, 115, 0.05) 0%, rgba(43, 182, 115, 0.1) 100%)",
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-success-500 rounded-[20px] flex items-center justify-center shrink-0">
                                <Users className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-2xl lg:text-[35px] lg:leading-[49px] text-gray-800">
                                    {t("learningMode.offline.title")}
                                </h3>
                                <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-500">
                                    {t("learningMode.offline.subtitle")}
                                </p>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="rounded-[20px] overflow-hidden mb-6 lg:mb-8 group">
                            <img
                                src={OfflineImage}
                                alt="Offline learning"
                                className="w-full h-48 lg:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 lg:space-y-4">
                            {offlineFeatures.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 lg:gap-4 group"
                                >
                                    <div className="w-7 h-7 lg:w-[30px] lg:h-[30px] bg-success-500 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                                    </div>
                                    <span className="text-base lg:text-[20px] lg:leading-[32px] text-gray-800">
                                        {t(feature.textKey)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default LearningModeSection;
