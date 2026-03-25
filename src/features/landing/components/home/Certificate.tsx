import { useLanguage } from "@/shared/hooks";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";
import { Icons } from "@/constants";
import { Images } from "@/constants/images";

function Certificate() {
    const { t, isRTL } = useLanguage("landing");
    const { ref: sectionRef, isVisible } = useScrollAnimation({
        threshold: 0.2,
    });
    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({
        threshold: 0.1,
    });

    return (
        <div className="w-full bg-white py-16 lg:py-32">
            <section
                id="accreditation"
                className={`relative w-full rounded-tr-landing-button ${isRTL ? "md:rounded-tl-[200px] rounded-br-landing-button md:rounded-br-[200px]" : "md:rounded-tr-[200px] rounded-bl-landing-button md:rounded-bl-[200px]"}  bg-[#e9f7fc] overflow-hidden shadow-sm`}
            >
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <img
                        src={Images.landing.certificate.certificateBg}
                        className="absolute w-full h-full object-cover object-bottom"
                        alt=""
                    />
                </div>

                {/* Corner Decorations */}
                <img
                    src={Images.landing.certificate.certificateTopCorner}
                    alt=""
                    className={`absolute top-0 ${
                        isRTL ? "left-0 transform scale-x-[-1]" : "right-0"
                    } w-[200px] lg:w-[350px] pointer-events-none z-10`}
                />

                <img
                    src={Images.landing.certificate.certificateBottomCorner}
                    alt=""
                    className={`absolute bottom-0 ${
                        isRTL ? "right-0 transform scale-x-[-1]" : "left-0"
                    } w-[150px] lg:w-[250px] pointer-events-none z-10`}
                />

                <img
                    src={
                        Images.landing.certificate.certificateBottomWavyPattern
                    }
                    alt=""
                    className={`absolute bottom-0 ${
                        isRTL ? "left-0" : "right-0"
                    } w-[100px] lg:w-[450px] pointer-events-none z-10`}
                />

                <div
                    ref={sectionRef}
                    className={`max-w-[1440px] mx-auto px-6 sm:px-12 pt-20 lg:pt-32 pb-24 w-full flex flex-col items-center relative z-20 transition-all duration-1000 ${
                        isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-12"
                    }`}
                >
                    {/* Header Text */}
                    <div
                        ref={headerRef}
                        className={`relative flex flex-col items-center justify-center text-center gap-3 z-30 w-full px-4 mb-0 lg:mb-16 transition-all duration-700 transform ${
                            isHeaderVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                        }`}
                    >
                        <div className="relative inline-block z-10 max-lg:w-full max-lg:max-w-[340px] max-lg:mx-auto">
                            {/* Wavy Stroke (Desktop ONLY) */}
                            <div
                                className={`hidden lg:block absolute top-0 rtl:top-[-10px] ${
                                    isRTL ? "right-[2%]" : "left-[-2%]"
                                } -z-10`}
                            >
                                <Icons.General.WavyStroke />
                            </div>

                            {/* Wavy Stroke (Mobile ONLY) */}
                            <div
                                className={`block lg:hidden absolute top-0 rtl:top-0 ${
                                    isRTL ? "right-0" : "left-0"
                                } -z-10 pointer-events-none w-[90px]`}
                            >
                                <Icons.General.WavyStroke size={80} />
                            </div>

                            <div className="relative m-0 z-10 drop-shadow-sm max-lg:flex max-lg:flex-wrap max-lg:justify-center max-lg:gap-x-2">
                                <ThemedText
                                    as="span"
                                    variant="heading"
                                    weight="semibold"
                                    className="text-[32px] md:text-[48px] leading-[normal] text-gray-700 capitalize max-lg:text-[28px]!"
                                >
                                    {t(
                                        "certificate.titleStart",
                                        "Every Student Earns A Professional"
                                    )}
                                </ThemedText>
                                <ThemedText
                                    as="span"
                                    variant="heading"
                                    weight="bold"
                                    className="text-[32px] md:text-[48px] leading-[normal] text-brand-500 capitalize max-lg:text-[28px]!"
                                >
                                    {t(
                                        "certificate.titleHighlight",
                                        "Certificate"
                                    )}
                                </ThemedText>
                            </div>
                        </div>

                        <ThemedText
                            as="p"
                            variant="caption"
                            weight="medium"
                            className="text-[18px] md:text-[24px] lg:text-[28px] text-landing-text-secondary lowercase px-4 mt-4 leading-[normal] max-lg:text-[14px]! max-lg:max-w-[280px] max-lg:mx-auto max-lg:leading-relaxed"
                        >
                            {t(
                                "certificate.subtitle",
                                "celebrating their journey and success in coding."
                            )}
                        </ThemedText>
                    </div>

                    {/* Central Graphics Container */}
                    <div className="relative w-[85%] sm:w-[80%] max-w-[800px] flex justify-center z-30 isolate mb-20 lg:mb-0 max-lg:mt-4">
                        {/* Certificate Image */}
                        <div className="relative w-full group">
                            {/* Blue Shadow Backdrop */}
                            <div
                                className={`absolute inset-0 bg-[#bbe6f6] border-2 md:border-[3px] border-[#24ade3] rounded-landing-icon md:rounded-landing-card-lg z-0 transition-all duration-500 ${
                                    isRTL
                                        ? "translate-y-2 translate-x-2 md:translate-y-5 md:translate-x-5 group-hover:translate-y-6 group-hover:translate-x-8"
                                        : "translate-y-2 -translate-x-2 md:translate-y-5 md:-translate-x-5 group-hover:translate-y-6 group-hover:-translate-x-8"
                                }`}
                            />
                            {/* Certificate Image */}
                            <img
                                src={Images.landing.certificate.certificate}
                                alt="3C Certificate"
                                className="w-full h-auto object-contain hover:-translate-y-2 transform transition-all duration-700 drop-shadow-xl z-20 relative"
                            />
                        </div>

                        {/* Left Floating Sticker "coding for kids" */}
                        <img
                            src={
                                Images.landing.certificate
                                    .certificateCodingForKids
                            }
                            alt="Coding for Kids"
                            className={`absolute top-60 lg:top-[80%] -translate-y-1/4 w-[120px] md:w-[150px] lg:w-[180px] pointer-events-none transform transition-transform duration-700 hover:scale-110 drop-shadow-lg z-30 max-lg:w-[70px]!  ${
                                isRTL
                                    ? "right-[-2%] md:right-[-34%]"
                                    : "left-[-2%] md:left-[-34%]"
                            }`}
                        />

                        {/* Right Floating Sticker "Coding" */}
                        <img
                            src={Images.landing.certificate.certificateCoding}
                            alt="Coding letters"
                            className={`absolute -top-6 md:-top-10 w-[60px] md:w-[180px] lg:w-[220px] pointer-events-none transform transition-transform duration-700 hover:scale-110 drop-shadow-md z-30 ${
                                isRTL
                                    ? "left-[-2%] md:left-[-30%]"
                                    : "right-[-2%] md:right-[-30%]"
                            }`}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Certificate;
