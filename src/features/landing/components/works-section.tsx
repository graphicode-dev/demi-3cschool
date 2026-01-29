import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import { Award, BookOpen, CheckCircle2, Upload, Video } from "lucide-react";

const term1Steps = [
    { icon: Video, textKey: "howItWorks.term1.step1" },
    { icon: BookOpen, textKey: "howItWorks.term1.step2" },
    { icon: Upload, textKey: "howItWorks.term1.step3" },
    { icon: Video, textKey: "howItWorks.term1.step4" },
    { icon: Award, textKey: "howItWorks.term1.step5" },
];

const term2Steps = [
    { icon: Video, textKey: "howItWorks.term2.step1" },
    { icon: BookOpen, textKey: "howItWorks.term2.step2" },
    { icon: Upload, textKey: "howItWorks.term2.step3" },
    { icon: Video, textKey: "howItWorks.term2.step4" },
    { icon: Award, textKey: "howItWorks.term2.step5" },
];

function HowItWorksSection() {
    const { t } = useTranslation("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

    return (
        <section
            id="how-it-works"
            className="relative z-50 py-16 lg:py-30 bg-linear-to-b from-gray-50 to-brand-50"
        >
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
                    <h2 className="font-bold text-3xl sm:text-4xl lg:text-[50px] lg:leading-[64px] text-gray-800 mb-4 lg:mb-6">
                        {t("howItWorks.title")}
                    </h2>
                    <p className="text-lg lg:text-[26px] lg:leading-[35px] text-gray-500 max-w-[920px] mx-auto">
                        {t("howItWorks.description")}
                    </p>
                </div>

                {/* Terms Container */}
                <div ref={cardsRef} className="relative">
                    {/* Connecting Line (hidden on mobile) */}
                    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 w-[90%] h-[5px] bg-linear-to-r from-brand-500 to-success-500" />

                    {/* Terms Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                        {/* Term 1 Card */}
                        <div
                            className={`bg-white rounded-[30px] border-[5px] border-brand-500 shadow-[0px_25px_31px_-6px_rgba(0,0,0,0.1),0px_10px_13px_-8px_rgba(0,0,0,0.1)] p-6 lg:p-10 transition-all duration-700 hover:shadow-xl ${
                                cardsVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                        >
                            {/* Term Header */}
                            <div className="text-center mb-8 lg:mb-10">
                                <div className="inline-block bg-brand-500 rounded-full px-8 lg:px-10 py-3 lg:py-4 mb-4">
                                    <span className="font-semibold text-2xl lg:text-[35px] text-white">
                                        {t("howItWorks.term1.title")}
                                    </span>
                                </div>
                                <p className="text-lg lg:text-[22px] text-gray-500">
                                    {t("howItWorks.term1.subtitle")}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="space-y-4 lg:space-y-6">
                                {term1Steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 bg-gray-50 rounded-[20px] p-4 group hover:bg-brand-50 transition-colors duration-300"
                                    >
                                        <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-brand-500/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <step.icon className="w-6 h-6 lg:w-[25px] lg:h-[26px] text-brand-500" />
                                        </div>
                                        <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-800">
                                            {t(step.textKey)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Step Badge */}
                            <div className="flex justify-center mt-8">
                                <div className="inline-flex items-center gap-2 bg-linear-to-r from-warning-500 to-warning-400 rounded-full px-6 py-3">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="font-semibold text-lg lg:text-[20px] text-gray-800">
                                        {t("howItWorks.term1.badge")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Term 2 Card */}
                        <div
                            className={`bg-white rounded-[30px] border-[5px] border-success-500 shadow-[0px_25px_31px_-6px_rgba(0,0,0,0.1),0px_10px_13px_-8px_rgba(0,0,0,0.1)] p-6 lg:p-10 transition-all duration-700 delay-200 hover:shadow-xl ${
                                cardsVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                        >
                            {/* Term Header */}
                            <div className="text-center mb-8 lg:mb-10">
                                <div className="inline-block bg-success-500 rounded-full px-8 lg:px-10 py-3 lg:py-4 mb-4">
                                    <span className="font-semibold text-2xl lg:text-[35px] text-white">
                                        {t("howItWorks.term2.title")}
                                    </span>
                                </div>
                                <p className="text-lg lg:text-[22px] text-gray-500">
                                    {t("howItWorks.term2.subtitle")}
                                </p>
                            </div>

                            {/* Steps */}
                            <div className="space-y-4 lg:space-y-6">
                                {term2Steps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-4 bg-gray-50 rounded-[20px] p-4 group hover:bg-success-50 transition-colors duration-300"
                                    >
                                        <div className="w-12 h-12 lg:w-[50px] lg:h-[50px] bg-success-500/10 rounded-full flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                                            <step.icon className="w-6 h-6 lg:w-[25px] lg:h-[25px] text-success-500" />
                                        </div>
                                        <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-800">
                                            {t(step.textKey)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Step Badge */}
                            <div className="flex justify-center mt-8">
                                <div className="inline-flex items-center gap-2 bg-linear-to-r from-warning-500 to-warning-400 rounded-full px-6 py-3">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="font-semibold text-lg lg:text-[20px] text-gray-800">
                                        {t("howItWorks.term2.badge")}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;
