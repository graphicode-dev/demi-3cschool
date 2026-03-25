import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";
import { useLanguage } from "@/shared/hooks";

interface StatItem {
    value: string;
    labelKey: string;
    label: string; // fallback English label
}

const STATS: StatItem[] = [
    { value: "+12k", labelKey: "stats.happyParents", label: "Happy Parents" },
    {
        value: "+40",
        labelKey: "stats.teachers",
        label: "Professional Teachers",
    },
    {
        value: "10+",
        labelKey: "stats.experience",
        label: "Years Of Experience",
    },
    { value: "20+", labelKey: "stats.families", label: "Families Prefer Us" },
];

function StatsSection() {
    const { t } = useLanguage("landing");
    const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({
        threshold: 0.2,
    });

    return (
        <section
            ref={statsRef}
            className={`relative w-full z-50 transition-all duration-700 ${
                statsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
        >
            <div
                className="relative w-full max-w-6xl mx-auto rounded-[32px] md:rounded-[40px] rounded-tl-[20px] rounded-br-[20px] rounded-tr-landing-button md:rounded-tr-[140px] rounded-bl-landing-button md:rounded-bl-[140px] px-6 py-16 md:px-16 md:py-24"
                style={{
                    backgroundColor: "#e9f7fc", // Fallback color closely matching design
                    backgroundImage: `url(${Images.landing.about.statsBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    className={`w-full relative grid grid-cols-2 gap-x-4 gap-y-16 sm:gap-y-24 max-w-4xl mx-auto justify-items-center items-center transition-all duration-700 ${
                        statsVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                    }`}
                >
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center justify-start text-center w-full transition-all duration-700 ${
                                statsVisible
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-90"
                            }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <ThemedText
                                as="h2"
                                weight="bold"
                                color="primary"
                                className="text-[44px] sm:text-[56px] md:text-[64px] lg:text-[76px] leading-[1.1] mb-2 sm:mb-4 tracking-tight font-poppins"
                            >
                                {stat.value}
                            </ThemedText>
                            <ThemedText
                                as="p"
                                weight="medium"
                                className="text-gray-500 text-[16px] sm:text-[20px] md:text-[24px] max-w-[140px] sm:max-w-[180px] leading-snug"
                            >
                                {t(stat.labelKey)}
                            </ThemedText>
                        </div>
                    ))}
                    
                    {/* Centered Slanted Dividers for 2x2 Grid */}
                    <div className="absolute top-[8%] sm:top-[12%] left-1/2 -translate-x-1/2 w-[3px] h-[60px] sm:h-landing-section-x bg-brand-500 rounded-full rotate-15 pointer-events-none opacity-90" />
                    <div className="absolute bottom-[8%] sm:bottom-[12%] left-1/2 -translate-x-1/2 w-[3px] h-[60px] sm:h-landing-section-x bg-brand-500 rounded-full rotate-15 pointer-events-none opacity-90" />
                </div>
            </div>
        </section>
    );
}

export default StatsSection;
