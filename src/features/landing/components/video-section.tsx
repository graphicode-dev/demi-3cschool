import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../hooks";
import { Play, ArrowRight } from "lucide-react";

function VideoSection() {
    const { t } = useTranslation("landing");
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
    const { ref: videoRef, isVisible: videoVisible } = useScrollAnimation();

    return (
        <section className="relative py-16 lg:py-24 bg-white overflow-hidden">
            {/* Background Decorative Blurs */}
            <div
                className="absolute -top-24 right-0 w-80 h-80 rounded-full blur-[50px] opacity-50"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(0, 174, 237, 0.05) 0%, rgba(43, 182, 115, 0.05) 100%)",
                }}
            />
            <div
                className="absolute -bottom-24 left-0 w-80 h-80 rounded-full blur-[50px] opacity-50"
                style={{
                    background:
                        "linear-gradient(135deg, rgba(244, 196, 48, 0.05) 0%, rgba(0, 174, 237, 0.05) 100%)",
                }}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div
                    ref={headerRef}
                    className={`text-center mb-10 lg:mb-16 transition-all duration-700 ${
                        headerVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <h2 className="font-bold text-3xl sm:text-4xl lg:text-[50px] lg:leading-[72px] text-gray-800 mb-4 lg:mb-6">
                        {t("video.title1")}{" "}
                        <span className="text-brand-500">
                            {t("video.titleHighlight")}
                        </span>{" "}
                        {t("video.title2")}
                    </h2>
                    <p className="text-lg lg:text-[24px] lg:leading-[35px] text-gray-500 max-w-[900px] mx-auto">
                        {t("video.description")}
                    </p>
                </div>

                {/* Video Container */}
                <div
                    ref={videoRef}
                    className={`transition-all duration-700 ${
                        videoVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                    }`}
                >
                    <div className="relative bg-white border-4 border-brand-500/10 rounded-[32px] shadow-[0px_31px_63px_-15px_rgba(0,0,0,0.25)] overflow-hidden aspect-video group cursor-pointer">
                        {/* Gradient Overlay */}
                        <div
                            className="absolute inset-0 z-10"
                            style={{
                                background:
                                    "linear-gradient(150deg, rgba(0, 174, 237, 0.2) 0%, rgba(0, 0, 0, 0) 50%, rgba(30, 93, 184, 0.2) 100%)",
                            }}
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            {/* Outer glow ring */}
                            <div className="absolute w-[170px] h-[170px] bg-white/30 rounded-full opacity-80 group-hover:scale-110 transition-transform duration-300" />
                            {/* Inner glow ring */}
                            <div className="absolute w-[140px] h-[140px] bg-white/20 rounded-full opacity-50" />
                            {/* Play button */}
                            <div className="relative w-[140px] h-[140px] bg-brand-500 rounded-full shadow-[0px_31px_63px_-15px_rgba(0,0,0,0.25)] flex items-center justify-center ps-1 group-hover:scale-105 transition-transform duration-300">
                                <Play
                                    className="w-[60px] h-[60px] text-white fill-white"
                                    strokeWidth={0}
                                />
                            </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-6 start-6 bg-black/70 rounded-full px-5 py-3 z-20">
                            <span className="text-white text-lg font-medium">
                                ⏱️ {t("video.duration")}
                            </span>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <div className="w-2.5 h-2.5 bg-success-500/50 rounded-full" />
                        <p className="text-gray-500 text-lg text-center">
                            {t("video.caption")}
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <div className="flex justify-center mt-10">
                    <button className="bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xl lg:text-2xl px-12 py-5 rounded-full shadow-[0px_12px_19px_-4px_rgba(0,0,0,0.1),0px_5px_8px_-5px_rgba(0,0,0,0.1)] hover:shadow-lg transition-all duration-300 flex items-center gap-4 group">
                        {t("video.cta")}
                        <ArrowRight className="w-7 h-7 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform duration-300" />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default VideoSection;
