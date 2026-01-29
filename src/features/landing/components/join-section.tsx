import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import { Star } from "lucide-react";

const grades = [
    {
        number: 4,
        colorClass: "bg-brand-500",
        borderColor: "border-brand-500",
        titleKey: "whoCanJoin.grade4.title",
        descKey: "whoCanJoin.grade4.description",
        dotColor: "bg-brand-500",
    },
    {
        number: 5,
        colorClass: "bg-warning-500",
        borderColor: "border-warning-500",
        titleKey: "whoCanJoin.grade5.title",
        descKey: "whoCanJoin.grade5.description",
        dotColor: "bg-warning-500",
    },
    {
        number: 6,
        colorClass: "bg-success-500",
        borderColor: "border-success-500",
        titleKey: "whoCanJoin.grade6.title",
        descKey: "whoCanJoin.grade6.description",
        dotColor: "bg-success-500",
    },
];

function WhoCanJoinSection() {
    const { t } = useTranslation("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

    return (
        <section className="relative z-50 py-16 lg:py-30 bg-linear-to-b from-brand-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-20">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-8 lg:mb-10 transition-all duration-700 ${
                        headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="font-bold text-3xl sm:text-4xl lg:text-[54px] lg:leading-[64px] text-gray-800 mb-4 lg:mb-6">
                        {t("whoCanJoin.title")}
                    </h2>
                    <p className="text-lg lg:text-[26px] lg:leading-[35px] text-gray-500">
                        {t("whoCanJoin.description")}
                    </p>
                </div>

                {/* No Experience Badge */}
                <div className="flex justify-center mb-10 lg:mb-16">
                    <div className="bg-success-500 rounded-full px-4 lg:px-6 py-3 lg:py-4 shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] flex items-center gap-2 lg:gap-3 hover:scale-105 transition-transform duration-300">
                        <Star
                            className="w-5 h-5 lg:w-6 lg:h-6 text-white"
                            fill="white"
                        />
                        <span className="font-semibold text-base lg:text-[20px] lg:leading-[32px] text-white">
                            {t("whoCanJoin.noExperience")}
                        </span>
                    </div>
                </div>

                {/* Grades Grid */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 mb-10 lg:mb-16"
                >
                    {grades.map((grade, index) => (
                        <div
                            key={grade.number}
                            className={`bg-white rounded-[30px] border-2 ${
                                grade.borderColor
                            } p-8 lg:p-10 text-center shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group ${
                                gridVisible
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-10"
                            }`}
                            style={{ transitionDelay: `${index * 150}ms` }}
                        >
                            {/* Grade Circle with Icon */}
                            <div className="flex justify-center mb-6 lg:mb-8">
                                <div
                                    className={`relative w-24 h-24 lg:w-[120px] lg:h-[120px] rounded-full flex items-center justify-center shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] group-hover:scale-110 transition-transform duration-300 ${grade.colorClass}`}
                                >
                                    {/* Graduation Cap Icon */}
                                    <svg
                                        className="absolute top-2 lg:top-2.5 right-2 lg:right-2.5 w-8 h-8 lg:w-10 lg:h-10 text-white opacity-90"
                                        viewBox="0 0 40 40"
                                        fill="none"
                                    >
                                        <path
                                            d="M20 8L4 16L20 24L36 16L20 8Z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M10 20V28C10 28 14 32 20 32C26 32 30 28 30 28V20"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M36 16V26"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    {/* Number */}
                                    <span className="font-bold text-5xl lg:text-[60px] text-white">
                                        {grade.number}
                                    </span>
                                </div>
                            </div>

                            {/* Grade Title */}
                            <h3 className="font-semibold text-2xl lg:text-[36px] lg:leading-[50px] text-gray-800 mb-2 lg:mb-4">
                                {t(grade.titleKey)}
                            </h3>

                            {/* Description */}
                            <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-500 mb-6 lg:mb-8">
                                {t(grade.descKey)}
                            </p>

                            {/* Progress Dots */}
                            <div className="flex justify-center gap-1.5">
                                <div
                                    className={`w-2.5 h-2.5 rounded-full ${grade.dotColor}`}
                                />
                                <div
                                    className={`w-2.5 h-2.5 rounded-full opacity-50 ${grade.dotColor}`}
                                />
                                <div
                                    className={`w-2.5 h-2.5 rounded-full opacity-25 ${grade.dotColor}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Note Box */}
                <div className="flex justify-center">
                    <div className="bg-white rounded-[20px] px-6 lg:px-8 py-4 lg:py-5 shadow-[0px_5px_8px_-1px_rgba(0,0,0,0.1),0px_2.5px_5px_-2.5px_rgba(0,0,0,0.1)]">
                        <p className="text-base lg:text-[22px] lg:leading-[38px] text-gray-500 text-center">
                            {t("whoCanJoin.note")}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default WhoCanJoinSection;
