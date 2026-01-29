import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import HeroImage from "@/assets/images/landing/hero.png";
import { Rocket, StarIcon } from "lucide-react";

function HeroSection() {
    const { t } = useTranslation("landing");
    const { ref: leftRef, isVisible: leftVisible } = useScrollAnimation();
    const { ref: rightRef, isVisible: rightVisible } = useScrollAnimation();

    return (
        <section
            id="home"
            className="relative min-h-[600px] lg:min-h-[800px] bg-brand-50 overflow-hidden"
        >
            {/* Decorative Elements - Hidden on mobile */}
            <div className="hidden md:block absolute left-[5%] lg:left-[140px] top-[100px] lg:top-[142px] w-12 lg:w-20 h-12 lg:h-20 bg-warning-500 rounded-full opacity-[0.23] animate-pulse" />
            <div
                className="hidden md:block absolute right-[5%] lg:right-[100px] bottom-[100px] lg:bottom-[200px] w-20 lg:w-32 h-20 lg:h-32 bg-success-500 rounded-full opacity-[0.47] animate-pulse"
                style={{ animationDelay: "1s" }}
            />
            <div
                className="hidden md:block absolute right-[10%] lg:right-[150px] top-[80px] lg:top-[154px] w-10 lg:w-16 h-10 lg:h-16 bg-brand-500 rounded-full opacity-10 animate-pulse"
                style={{ animationDelay: "0.5s" }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 lg:pt-16">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8">
                    {/* Left Content */}
                    <div
                        ref={leftRef}
                        className={`max-w-2xl pt-4 lg:pt-16 text-center lg:text-left transition-all duration-700 ${
                            leftVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        {/* Main Heading */}
                        <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[50px] lg:leading-[96px] text-gray-900 mb-4 lg:mb-6 rtl:text-right">
                            {t("hero.title1")}{" "}
                            <span className="text-warning-500">
                                {t("hero.future")}
                            </span>
                            {t("hero.title2")}
                            <br className="hidden lg:block" />
                            <span className="lg:hidden"> </span>
                            <span className="text-brand-500">
                                {t("hero.level")}
                            </span>{" "}
                            {t("hero.title3")}
                        </h1>

                        {/* Description */}
                        <p className="text-start text-base sm:text-lg lg:text-[24px] lg:leading-[28px] text-gray-500 mb-6 lg:mb-8 max-w-[662px] mx-auto lg:mx-0 ">
                            {t("hero.description")}
                        </p>

                        {/* Stats Info */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 sm:gap-16 lg:gap-[116px] mb-6 lg:mb-8">
                            <div className="text-center">
                                <p className="font-bold text-2xl lg:text-[30px] lg:leading-[36px] text-brand-500">
                                    {t("hero.termsCount")}
                                </p>
                                <p className="text-sm lg:text-[14px] lg:leading-[20px] text-gray-500">
                                    {t("hero.terms")}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-2xl lg:text-[30px] lg:leading-[36px] text-success-500">
                                    {t("hero.live")}
                                </p>
                                <p className="text-sm lg:text-[14px] lg:leading-[20px] text-gray-500">
                                    {t("hero.sessions")}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-2xl lg:text-[30px] lg:leading-[36px] text-warning-500">
                                    {t("hero.free")}
                                </p>
                                <p className="text-sm lg:text-[14px] lg:leading-[20px] text-gray-500">
                                    {t("hero.education")}
                                </p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
                            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-500 text-white px-6 sm:px-8 py-4 lg:py-5 rounded-full font-medium text-base lg:text-[18px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] hover:bg-brand-600 hover:scale-105 hover:shadow-xl transition-all duration-300">
                                {t("hero.applyNow")}
                                <Rocket className="w-5 h-5 lg:w-6 lg:h-6" />
                            </button>
                            <button className="w-full sm:w-auto flex items-center justify-center bg-white text-brand-700 px-6 sm:px-8 py-4 lg:py-5 rounded-full font-medium text-base lg:text-[18px] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)] border border-brand-500/30 hover:bg-gray-50 hover:scale-105 hover:shadow-xl transition-all duration-300">
                                {t("hero.learnMore")}
                            </button>
                        </div>
                    </div>

                    {/* Right Content - Hero Image */}
                    <div
                        ref={rightRef}
                        className={`relative w-full max-w-md lg:max-w-none lg:w-auto transition-all duration-700 delay-300 ${
                            rightVisible
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-10"
                        }`}
                    >
                        {/* Rotated Background */}
                        <div className="hidden lg:block absolute -left-[60px] -top-[27px] w-[570px] h-[411px] bg-brand-500 opacity-10 rounded-[48px] rotate-6" />

                        {/* Main Image Container */}
                        <div className="relative w-full lg:w-[536px] h-[250px] sm:h-[300px] lg:h-[357px] rounded-3xl lg:rounded-[48px] overflow-hidden shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] hover:shadow-2xl transition-shadow duration-300">
                            <img
                                src={HeroImage}
                                alt="Students learning to code"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Floating Card */}
                        <div className="absolute left-4 sm:-left-6 bottom-[-30px] lg:bottom-[-40px] bg-white rounded-[16px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] px-5 lg:px-6 py-4 lg:py-5 border-[1.6px] border-warning-500 w-64 sm:w-72 hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-bounce-slow">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-warning-500 rounded-full flex items-center justify-center shrink-0">
                                    <StarIcon
                                        className="w-5 h-5 text-white lg:w-6 lg:h-6"
                                        fill="white"
                                    />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800 text-sm lg:text-[16px] lg:leading-[25.6px]">
                                        {t("hero.noExperience")}
                                    </p>
                                    <p className="text-xs lg:text-[14px] lg:leading-[20px] text-gray-500">
                                        {t("hero.startFromZero")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
