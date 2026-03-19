import { Icons } from "@/constants";
import { Images } from "@/constants/images";
import ThemedText from "@/design-system/components/ThemedText";
import { useScrollAnimation } from "../../hooks";

interface CardData {
    id: string;
    titleKey: string;
    descriptionKey: string;
    /** Whether this card is "prominent" (darker bg, index 0, 2, 4) */
    prominent: boolean;
}

// Card data based on Figma designs
const CARDS: CardData[] = [
    {
        id: "small-class",
        titleKey: "Small Class Sizes",
        descriptionKey:
            "Maximum 8 students per class for personalized attention",
        prominent: true,
    },
    {
        id: "project-based",
        titleKey: "Project-Based Learning",
        descriptionKey: "Build real games, apps, and websites you can show off",
        prominent: false,
    },
    {
        id: "industry-standard",
        titleKey: "Industry-Standard Tools",
        descriptionKey:
            "Learn with professional coding platforms and languages",
        prominent: false,
    },
    {
        id: "passion-mentors",
        titleKey: "Passion-Driven Mentors",
        descriptionKey: "Teachers who love coding and love teaching kids",
        prominent: false,
    },
    {
        id: "certification",
        titleKey: "Certification & Portfolio",
        descriptionKey: "Earn certificates and build a showcase of your work",
        prominent: false,
    },
];

interface Why3CCardProps {
    card: CardData;
    index: number;
    isVisible: boolean;
}

function Why3CCard({ card, index, isVisible }: Why3CCardProps) {
    const isEven = index % 2 === 0; // 0, 2, 4 → shifted RIGHT

    return (
        <div
            className={`
                transition-all duration-500
                w-[80%]
                ${isEven ? "ml-[20%]" : "ml-0"}
            `}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            <div
                className={`
                    relative px-5 py-4 lg:px-7 lg:py-5 w-full
                    ${
                        isEven
                            ? "rounded-[26px] rounded-bl-none"
                            : "rounded-[26px] rounded-tr-none"
                    }
                    ${index === 0 ? "bg-[#6cc8ec] shadow-[inset_0_4px_8px_#00000020,0_2px_8px_#00000020]" : "bg-[#bbe6f6]"}
                    ${
                        isVisible
                            ? "opacity-100 translate-x-0"
                            : isEven
                              ? "opacity-0 translate-x-8"
                              : "opacity-0 -translate-x-8"
                    }
                    transition-all duration-500
                    overflow-visible
                `}
                style={{
                    transitionDelay: `${index * 100}ms`,
                    // boxShadow: "inset 0 4px 8px #00000020, 0 2px 8px #00000020",
                }}
            >
                {/* Cursor decoration on first card */}
                {index === 0 && (
                    <div className="absolute -bottom-6 -right-4 lg:-right-6 z-10">
                        <img
                            src={Images.landing.whyChoose3c.cursor}
                            alt="cursor"
                        />
                    </div>
                )}

                <ThemedText
                    weight="semibold"
                    size="xl"
                    className="text-[#393838]"
                >
                    {card.titleKey}
                </ThemedText>
                <ThemedText
                    size="base"
                    className={`${isEven ? "text-[#4b4a4a]" : "text-[#616060]"}`}
                >
                    {card.descriptionKey}
                </ThemedText>
            </div>
        </div>
    );
}

function CardConnector() {
    return (
        <div className="flex justify-center my-1 pointer-events-none select-none">
            <Icons.Landing.Why3C.StrokeLine size={40} />
        </div>
    );
}

function Why3C() {
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();
    return (
        <section
            id="why-3c"
            className="relative w-full min-h-screen py-20 px-20 lg:py-20 mt-20 z-50 bg-brand-50"
        >
            {/* Header */}
            <div className="relative flex flex-col items-center justify-center gap-2">
                <div className="absolute -top-10 left-0 w-full">
                    <div className="absolute top-0 left-5">
                        <Icons.General.star />
                    </div>
                    <div className="absolute top-10 left-20">
                        <Icons.General.star size={35} />
                    </div>
                    <div className="absolute top-10 left-40">
                        <Icons.General.cloud />
                    </div>
                    <div className="absolute top-0 left-90">
                        <Icons.General.cloud />
                    </div>
                </div>

                <ThemedText
                    size="6xl"
                    as="h1"
                    variant="heading"
                    className="relative flex items-center justify-center gap-2 mb-5"
                    weight="semibold"
                >
                    Why Choose
                    <ThemedText
                        size="6xl"
                        variant="heading"
                        as="span"
                        color="primary"
                        weight="semibold"
                    >
                        {" "}
                        3C?
                    </ThemedText>
                    <div className="absolute top-0 left-[13%] -translate-x-1/2">
                        <Icons.General.WavyStroke />
                    </div>
                </ThemedText>

                <ThemedText
                    size="2xl"
                    as="p"
                    variant="caption"
                    color="secondary"
                >
                    We make learning to code exciting, interactive, and easy for
                    young minds.
                </ThemedText>

                <img
                    src={Images.landing.whyChoose3c.kidsThatCode}
                    alt="Kids that code"
                    className="absolute -bottom-40 right-0"
                />
            </div>

            {/* Content */}
            <div className="relative flex items-center justify-between gap-2">
                {/* Image */}
                <div className="relative w-1/2">
                    <img
                        src={Images.landing.whyChoose3c.banner}
                        alt="Kids that code"
                        className="w-full h-full"
                    />

                    <img
                        src={Images.landing.whyChoose3c.keyboard}
                        alt="Keyboard"
                        className="absolute -bottom-20 -left-20"
                    />
                </div>

                {/* Right – Staggered Cards */}
                <div ref={cardsRef} className="w-full lg:w-[55%] flex flex-col">
                    {CARDS.map((card, index) => (
                        <div key={card.id}>
                            <Why3CCard
                                card={card}
                                index={index}
                                isVisible={cardsVisible}
                            />

                            {/* Orange dashed connector between cards */}
                            {index < CARDS.length - 1 && <CardConnector />}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default Why3C;
