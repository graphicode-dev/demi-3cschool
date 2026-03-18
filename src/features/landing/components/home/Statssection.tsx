import { Icons } from "@/constants";
import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useTranslation } from "react-i18next";

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

    return (
        <div
            className="flex items-center justify-between w-full px-15 py-3.5 rounded-tr-[124px] rounded-bl-lg"
            style={{
                backgroundImage: `url(${Images.landing.about.statsBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {STATS.map((stat, index) => (
                <div
                    className="flex items-center justify-evenly gap-5"
                    key={index}
                >
                    <div className="flex flex-col items-center text-center">
                        <ThemedText
                            as="h2"
                            weight="bold"
                            color="primary"
                            size="6xl"
                        >
                            {stat.value}
                        </ThemedText>
                        <ThemedText as="p" className="text-gray-400" size="3xl">
                            {stat.label}
                        </ThemedText>
                    </div>

                    {index < STATS.length - 1 && (
                        <Icons.Landing.About.SlashSeparator size={150} />
                    )}
                </div>
            ))}
        </div>
    );
}

export default StatsSection;
