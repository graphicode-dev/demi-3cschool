import { ArrowRight } from "lucide-react";
import ThemedText from "@/design-system/components/ThemedText";
import { Icons } from "@/constants";
import { useLanguage } from "@/shared/hooks";
import { useScrollAnimation } from "../../hooks";
import { Images } from "@/constants/images";
import { Link } from "react-router-dom";

interface PlanFeature {
    text: string;
}

interface Plan {
    id: string;
    badge: string;
    duration: string;
    price: string;
    originalPrice: string;
    currency: string;
    features: PlanFeature[];
    variant: "default" | "featured";
    href: string;
}

function PlanCard({
    plan,
    index,
    isVisible,
}: {
    plan: Plan;
    index: number;
    isVisible: boolean;
}) {
    const isFeatured = plan.variant === "featured";

    return (
        <div
            className={`relative flex flex-col rounded-[32px] overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-500 transform ${
                isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
            } ${isFeatured ? " lg:-mt-4 lg:mb-4" : ""}`}
            style={{
                transitionDelay: `${index * 150}ms`,
                backgroundImage: `url(${
                    isFeatured
                        ? Images.landing.plans.featuredPlanBg
                        : Images.landing.plans.normalPlanBg
                })`,
            }}
        >

            {/* Upper White/Light Section */}
            <div
                className={`relative rounded-[32px] px-6 py-5 ${
                    isFeatured ? "bg-brand-50 mx-2 mt-2" : "bg-white mx-1 mt-1"
                }`}
            >
                {/* Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="rotate-6">
                        <div className="bg-linear-to-r from-brand-300 to-brand-100/35 px-3 py-1.5 rounded-[11px] shadow-[0px_-1px_7.6px_0px_rgba(0,0,0,0.14)]">
                            <div className="absolute inset-0 rounded-[11px] shadow-[inset_0px_4px_5.2px_0px_rgba(0,0,0,0.25)] pointer-events-none" />
                            <ThemedText
                                as="span"
                                font="akaya-telivigala"
                                className="text-gray-700 text-[20px] md:text-[24px] capitalize leading-[normal] relative z-10"
                            >
                                {plan.badge}
                            </ThemedText>
                        </div>
                    </div>
                </div>

                {/* Plan Duration */}
                <ThemedText
                    as="p"
                    weight="semibold"
                    className="text-brand-500 text-[18px] md:text-[20px] lowercase leading-[normal] mb-2"
                >
                    {plan.duration}
                </ThemedText>

                {/* Price */}
                <div className="flex items-center gap-3">
                    <ThemedText
                        as="span"
                        weight="semibold"
                        className="text-brand-500 text-[24px] md:text-[28px] lowercase leading-[normal]"
                    >
                        {plan.price}{" "}
                        <ThemedText
                            as="span"
                            weight="medium"
                            className="text-brand-500 capitalize"
                        >
                            {plan.currency}
                        </ThemedText>
                    </ThemedText>
                    <div className="relative">
                        <ThemedText
                            as="span"
                            className="text-gray-300 text-[14px] md:text-[16px] lowercase leading-[normal]"
                        >
                            {plan.originalPrice} {plan.currency}
                        </ThemedText>
                        {/* Strikethrough line */}
                        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gray-300 rotate-123" />
                    </div>
                </div>
            </div>

            {/* Features List */}
            <div className={`relative flex flex-col gap-4 pt-5 pb-4 flex-1 ${isFeatured ? 'px-8' : 'px-6'}`}>
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                        <Icons.General.doubleCheck
                            size={28}
                            color={`${isFeatured ? "white" : "var(--color-brand-500)"}`}
                            fill={`${isFeatured ? "white" : "var(--color-brand-500)"}`}
                        />
                        <ThemedText
                            as="span"
                            weight="semibold"
                            className={`text-[14px] md:text-[16px] capitalize leading-[normal] ${
                                isFeatured ? "text-white" : "text-brand-500"
                            }`}
                        >
                            {feature.text}
                        </ThemedText>
                    </div>
                ))}
            </div>

            {/* CTA Button */}
            <div className={`relative pb-5 ${isFeatured ? 'px-8 mb-5' : 'px-6'}`}>
                <Link
                    to={plan.href}
                    className={`flex items-center justify-between gap-2 min-w-30 px-1 ps-4 py-1 text-[18px] border border-black font-semibold rounded-full hover:bg-brand-600 transition-colors duration-300 ${
                        isFeatured
                            ? "bg-brand-50 text-brand-500 hover:bg-white"
                            : "bg-brand-500 text-brand-50 hover:bg-brand-600"
                    }`}
                >
                    REGISTER NOW
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isFeatured
                                ? "bg-brand-500 text-white"
                                : "bg-brand-50 text-brand-500"
                        }`}
                    >
                        <Icons.General.ChevronIcon
                            size={20}
                            color={`${isFeatured ? "white" : "var(--color-brand-500)"}`}
                            fill={`${isFeatured ? "white" : "var(--color-brand-500)"}`}
                        />
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default function Plans() {
    const { t, isRTL } = useLanguage();

    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({
        threshold: 0.1,
    });
    const { ref: cardsRef, isVisible: isCardsVisible } = useScrollAnimation({
        threshold: 0.1,
    });

    const plans: Plan[] = [
        {
            id: "quarter",
            badge: t("plans.cards.quarter.badge"),
            duration: t("plans.cards.quarter.duration"),
            price: t("plans.cards.quarter.price"),
            originalPrice: t("plans.cards.quarter.originalPrice"),
            currency: t("plans.cards.quarter.currency"),
            features: [
                { text: t("plans.features.liveOnline") },
                { text: t("plans.features.assessment") },
                { text: t("plans.features.certificate") },
                { text: t("plans.features.guidance") },
                { text: t("plans.features.limitedGroup") },
                { text: t("plans.features.graduation") },
                { text: t("plans.cards.quarter.completion") },
            ],
            variant: "default",
            href: "",
        },
        {
            id: "semiAnnual",
            badge: t("plans.cards.semiAnnual.badge"),
            duration: t("plans.cards.semiAnnual.duration"),
            price: t("plans.cards.semiAnnual.price"),
            originalPrice: t("plans.cards.semiAnnual.originalPrice"),
            currency: t("plans.cards.semiAnnual.currency"),
            features: [
                { text: t("plans.features.liveOnline") },
                { text: t("plans.features.assessment") },
                { text: t("plans.features.certificate") },
                { text: t("plans.features.guidance") },
                { text: t("plans.features.limitedGroup") },
                { text: t("plans.features.graduation") },
                { text: t("plans.cards.semiAnnual.completion") },
            ],
            variant: "featured",
            href: "",
        },
        {
            id: "annual",
            badge: t("plans.cards.annual.badge"),
            duration: t("plans.cards.annual.duration"),
            price: t("plans.cards.annual.price"),
            originalPrice: t("plans.cards.annual.originalPrice"),
            currency: t("plans.cards.annual.currency"),
            features: [
                { text: t("plans.features.liveOnline") },
                { text: t("plans.features.assessment") },
                { text: t("plans.features.certificate") },
                { text: t("plans.features.guidance") },
                { text: t("plans.features.limitedGroup") },
                { text: t("plans.features.graduation") },
                { text: t("plans.cards.annual.completion") },
            ],
            variant: "default",
            href: "",
        },
    ];

    return (
        <section
            id="plans"
            className="relative w-full py-20 lg:py-32 z-50 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-brand-50 -z-20" />
            <div className="absolute inset-0 opacity-[0.03] overflow-hidden -z-20 pointer-events-none">
                <img
                    src={Images.landing.plans.bg}
                    className="absolute w-full h-[150%] object-cover top-[-25%] left-0"
                    alt=""
                />
            </div>

            {/* Header */}
            <div
                ref={headerRef}
                className={`relative flex flex-col items-center justify-center text-center gap-3 z-10 w-full px-4 mb-20 lg:mb-32 transition-all duration-700 transform ${
                    isHeaderVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}
            >
                <div className="relative inline-block z-10">
                    {/* Wavy Stroke */}
                    <div
                        className={`absolute -top-5 ${
                            isRTL ? "right-[2%]" : "left-[2%]"
                        } -z-10`}
                    >
                        <Icons.General.WavyStroke />
                    </div>

                    <h2 className="relative flex flex-wrap items-baseline justify-center gap-x-3 m-0 z-10 drop-shadow-sm">
                        <ThemedText
                            as="span"
                            variant="heading"
                            weight="semibold"
                            className="text-[36px] md:text-[48px] leading-[normal] text-gray-700 capitalize"
                        >
                            {t("plans.title")}
                        </ThemedText>
                        <ThemedText
                            as="span"
                            variant="heading"
                            weight="bold"
                            className="text-[36px] md:text-[48px] leading-[normal] text-brand-500 capitalize"
                        >
                            {t("plans.titleHighlight")}
                        </ThemedText>
                    </h2>
                </div>

                <ThemedText
                    as="p"
                    variant="caption"
                    weight="medium"
                    className="text-[18px] md:text-[24px] lg:text-[28px] text-landing-text-secondary lowercase px-4 mt-4 leading-[normal]"
                >
                    {t("plans.subtitle")}
                </ThemedText>
            </div>

            {/* Plans Grid */}
            <div
                ref={cardsRef}
                className="w-full relative max-w-6xl mx-auto px-4 z-10"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 items-end">
                    {plans.map((plan, i) => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            index={i}
                            isVisible={isCardsVisible}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
