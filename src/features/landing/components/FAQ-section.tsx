import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import { ChevronDown } from "lucide-react";

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"];

function FAQSection() {
    const { t } = useTranslation("landing");
    const [openIndex, setOpenIndex] = useState<number | null>(1);
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: listRef, isVisible: listVisible } = useScrollAnimation();
    const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="relative z-50 py-16 lg:py-30 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-36">
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
                        {t("faq.title")}
                    </h2>
                    <p className="text-lg lg:text-[24px] lg:leading-[35px] text-gray-500">
                        {t("faq.description")}
                    </p>
                </div>

                {/* FAQ List */}
                <div
                    ref={listRef}
                    className="space-y-4 lg:space-y-6 mb-12 lg:mb-20"
                >
                    {faqKeys.map((key, index) => (
                        <div
                            key={key}
                            className={`bg-white rounded-[20px] overflow-hidden shadow-[0px_5px_8px_-1px_rgba(0,0,0,0.1),0px_2.5px_5px_-2.5px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-500 ${
                                listVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between px-6 lg:px-8 py-5 lg:py-6 text-left hover:bg-gray-50/50 transition-colors"
                            >
                                <span className="font-semibold text-lg lg:text-[30px] lg:leading-[42px] text-gray-800">
                                    {t(`faq.${key}.question`)}
                                </span>
                                <ChevronDown
                                    className={`w-6 h-6 lg:w-[30px] lg:h-[30px] shrink-0 transition-transform duration-300 ${
                                        openIndex === index ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${
                                    openIndex === index
                                        ? "max-h-[300px] opacity-100"
                                        : "max-h-0 opacity-0"
                                }`}
                            >
                                <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                                    <p className="text-base lg:text-[22px] lg:leading-[36px] text-gray-500">
                                        {t(`faq.${key}.answer`)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div
                    ref={ctaRef}
                    className={`bg-white rounded-[20px] p-8 lg:p-10 shadow-[0px_5px_8px_-1px_rgba(0,0,0,0.1),0px_2.5px_5px_-2.5px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-500 text-center ${
                        ctaVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h3 className="font-semibold text-xl lg:text-[30px] lg:leading-[42px] text-gray-800 mb-2 lg:mb-4">
                        {t("faq.stillHaveQuestions")}
                    </h3>
                    <p className="text-base lg:text-[24px] lg:leading-[38px] text-gray-500 mb-6 lg:mb-8">
                        {t("faq.supportTeam")}
                    </p>
                    <button className="bg-brand-500 text-white px-8 lg:px-12 py-3 lg:py-4 rounded-full font-medium text-lg lg:text-[22px] shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] hover:bg-brand-600 hover:scale-105 hover:shadow-xl transition-all duration-300">
                        {t("faq.contactSupport")}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default FAQSection;
