import { Icons } from "@/constants";
import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useTranslation } from "react-i18next";
import { useScrollAnimation } from "../../hooks";

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
    const { t } = useTranslation("landing");
    const { ref: statsRef, isVisible: statsVisible } = useScrollAnimation({
        threshold: 0.2,
    });

    return (
        <section
            ref={statsRef}
            className={`relative w-full py-20 px-20 lg:py-30 z-50 transition-all duration-700 ${
                statsVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
        >
            <div
                className="flex items-center justify-between w-full px-15 py-3.5 rounded-tr-[124px] rounded-bl-lg"
                style={{
                    backgroundImage: `url(${Images.landing.about.statsBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div
                    className={`grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16 transition-all duration-700 ${
                        statsVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                    }`}
                >
                    {STATS.map((stat, index) => (
                        <div
                            key={index}
                            className={`flex flex-col items-center justify-center text-center transition-all duration-700 ${
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
                                size="6xl"
                            >
                                {stat.value}
                            </ThemedText>
                            <ThemedText
                                as="p"
                                className="text-gray-400"
                                size="3xl"
                            >
                                {stat.label}
                            </ThemedText>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default StatsSection;
