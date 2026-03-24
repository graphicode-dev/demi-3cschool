import ThemedText from "@/design-system/components/ThemedText";
import { Icons } from "@/constants";
import { useLanguage } from "@/shared/hooks";
import { useScrollAnimation } from "../../hooks";
import { Images } from "@/constants/images";

interface TrackCardProps {
    title: string;
    subtitle: string;
    image: string;
    variant: "blue" | "light";
    className?: string;
    style?: React.CSSProperties;
}

interface Track {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    variant: "blue" | "light";
    className?: string;
}

const InnerBridge = ({ y }: { y: number }) => (
    <div
        className="hidden lg:block absolute border-t-[3px] border-brand-500 opacity-60 -z-10"
        style={{ top: `${y}px`, left: "25%", right: "25%",borderStyle:"dashed" }}
    />
);

const IntraGridPipeStandard = () => (
    <div
        className="hidden lg:block absolute border-r-[3px] border-t-[3px] border-b-[3px] border-brand-500 opacity-60 rounded-tr-[40px] rounded-br-[40px] -z-10"
        style={{
            top: "105px",
            right: "-50px",
            width: "calc(50px + 15%)",
            height: "307px",
            borderStyle: "dashed",
        }}
    />
);

const IntraGridPipeProfessional = () => (
    <div
        className="hidden lg:block absolute border-l-[3px] border-t-[3px] border-b-[3px] border-brand-500 opacity-60 rounded-tl-[40px] rounded-bl-[40px] -z-10"
        style={{
            top: "105px",
            left: "-50px",
            width: "calc(50px + 15%)",
            height: "307px",
            borderStyle: "dashed",
        }}
    />
);


function TrackCard({
    title,
    subtitle,
    image,
    variant,
    className = "",
    style = {},
}: TrackCardProps) {
    const isBlue = variant === "blue";

    return (
        <div className={`relative w-full max-w-[450px] mx-auto ${className}`} style={style}>
            <img
                src={image}
                className="w-full h-auto block pointer-events-none"
                alt={`${title} Background`}
            />
            <div className="absolute inset-0 flex flex-col justify-center pl-[10%] pr-[35%]">
                <ThemedText
                    as="h3"
                    weight="semibold"
                    variant="heading"
                    className={`text-xl sm:text-2xl lg:text-[26px] mb-1 sm:mb-2 leading-tight ${isBlue ? "text-white" : "text-gray-700"}`}
                >
                    {title}
                </ThemedText>
                <ThemedText
                    as="p"
                    variant="label"
                    className={`text-xs sm:text-sm lg:text-[18px] leading-snug ${isBlue ? "text-gray-200" : "text-landing-text-secondary"}`}
                >
                    {subtitle}
                </ThemedText>
            </div>
        </div>
    );
}

export default function Tracks() {
    const { t, isRTL } = useLanguage();

    const { ref: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({ threshold: 0.1 });
    const { ref: standardRef, isVisible: isStandardVisible } = useScrollAnimation({ threshold: 0.1 });
    const { ref: professionalRef, isVisible: isProfessionalVisible } = useScrollAnimation({ threshold: 0.1 });

    const standardTracks: Track[] = [
        {
            id: "1",
            title: t("tracks.cards.scratch.title"),
            subtitle: t("tracks.cards.scratch.subtitle"),
            image: Images.landing.tracks.standard.standard1,
            variant: "blue",
        },
        {
            id: "2",
            title: t("tracks.cards.machineLearning.title"),
            subtitle: t("tracks.cards.machineLearning.subtitle"),
            image: Images.landing.tracks.standard.standard2,
            variant: "light",
        },
        {
            id: "3",
            title: t("tracks.cards.introToWeb.title"),
            subtitle: t("tracks.cards.introToWeb.subtitle"),
            image: Images.landing.tracks.standard.standard3,
            variant: "light",
        },
        {
            id: "4",
            title: t("tracks.cards.python.title"),
            subtitle: t("tracks.cards.python.subtitle"),
            image: Images.landing.tracks.standard.standard4,
            variant: "blue",
        },
    ];

    const professionalTracks: Track[] = [
        {
            id: "1",
            title: t("tracks.cards.webDev.title"),
            subtitle: t("tracks.cards.webDev.subtitle"),
            image: Images.landing.tracks.professional.professional1,
            variant: "blue",
        },
        {
            id: "2",
            title: t("tracks.cards.mobileApps.title"),
            subtitle: t("tracks.cards.mobileApps.subtitle"),
            image: Images.landing.tracks.professional.professional2,
            variant: "light",
        },
        {
            id: "3",
            title: t("tracks.cards.gameDev.title"),
            subtitle: t("tracks.cards.gameDev.subtitle"),
            image: Images.landing.tracks.professional.professional3,
            variant: "light",
        },
        {
            id: "4",
            title: t("tracks.cards.ai.title"),
            subtitle: t("tracks.cards.ai.subtitle"),
            image: Images.landing.tracks.professional.professional4,
            variant: "blue",
        },
    ];

    return (
        <section
            id="tracks"
            className="relative w-full py-20 lg:py-32 z-50 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-brand-50 -z-20" />
            <div className="absolute inset-0 opacity-[0.03] overflow-hidden -z-20 pointer-events-none">
                <img
                    src={Images.landing.tracks.bg}
                    className="absolute w-full h-[150%] object-cover top-[-25%] left-0"
                    alt=""
                />
            </div>

            {/* Header */}
            <div 
                ref={headerRef}
                className={`relative flex flex-col items-center justify-center text-center gap-3 z-10 w-full px-4 mb-20 lg:mb-32 transition-all duration-700 transform ${isHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="relative inline-block z-10">
                    {/* Wavy Stroke (Underneath "From First Code") */}
                    <div
                        className={`absolute top-0 ${isRTL ? "right-[2%]" : "left-[2%]"} -z-10`}
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
                            {t("tracks.title1")}
                        </ThemedText>
                        <ThemedText
                            as="span"
                            variant="heading"
                            weight="bold"
                            className="text-[36px] md:text-[48px] leading-[normal] text-brand-500 capitalize"
                        >
                            {t("tracks.titleHighlight")}
                        </ThemedText>
                    </h2>

                    {/* Robot Globe Decorator */}
                    <div className="absolute top-0 -left-10 md:top-0 md:-left-30 rotate-[-10deg] z-20">
                        <img
                            src={Images.landing.tracks.robotGlobe}
                            className="w-[50px] md:w-landing-section-x pointer-events-none drop-shadow-md"
                            alt="Globe Indicator"
                        />
                    </div>

                    {/* Robot Head Decorator */}
                    <div className="absolute top-0 -right-10 md:-top-5 md:-right-30 rotate-12 z-20">
                        <img
                            src={Images.landing.tracks.robotHead}
                            className="w-[60px] md:w-[100px] pointer-events-none drop-shadow-md"
                            alt="Robot Indicator"
                        />
                    </div>
                </div>

                <ThemedText
                    as="p"
                    variant="caption"
                    weight="medium"
                    className="text-[18px] md:text-[24px] lg:text-[28px] text-landing-text-secondary lowercase px-4 mt-4 leading-[normal]"
                >
                    {t("tracks.subtitle")}
                </ThemedText>
            </div>

            {/* Tracks Layout */}
            <div className="w-full relative max-w-5xl mx-auto px-4 z-10 flex flex-col pt-10">
                
                {/* Standard Track Group */}
                <div ref={standardRef} className="w-full">
                    {/* Standard Track */}
                    <div className={`text-right w-full mb-8 lg:-mr-12 transition-all duration-700 transform ${isStandardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                        <ThemedText
                            as="h3"
                            font="akaya-telivigala"
                            weight="medium"
                            className="text-brand-400 text-4xl lg:text-[42px] text-center lg:text-right"
                        >
                            {t("tracks.standardTrack")}
                        </ThemedText>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-y-landing-section-y lg:gap-x-16 mb-24 relative w-full transition-all duration-1000 delay-300 ${isStandardVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <InnerBridge y={105} />
                        <IntraGridPipeStandard />
                        <InnerBridge y={412} />

                        {standardTracks.map((track, i) => (
                            <TrackCard
                                key={track.id}
                                title={track.title}
                                subtitle={track.subtitle}
                                variant={track.variant}
                                image={track.image}
                                className={`transition-all duration-500 transform ${isStandardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                </div>

                {/* Professional Track Group */}
                <div ref={professionalRef} className="w-full">
                    {/* Professional Track */}
                    <div className={`text-left w-full mb-8 lg:-ml-12 mt-8 transition-all duration-700 transform ${isProfessionalVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                        <ThemedText
                            as="h3"
                            font="akaya-telivigala"
                            weight="medium"
                            className="text-brand-400 text-4xl lg:text-[42px] text-center lg:text-left"
                        >
                            {t("tracks.professionalTrack")}
                        </ThemedText>
                    </div>

                    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-y-16 lg:gap-y-landing-section-y lg:gap-x-16 relative w-full transition-all duration-1000 delay-300 ${isProfessionalVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <InnerBridge y={105} />
                        <IntraGridPipeProfessional />
                        <InnerBridge y={412} />

                        {professionalTracks.map((track, i) => (
                            <TrackCard
                                key={track.id}
                                title={track.title}
                                subtitle={track.subtitle}
                                variant={track.variant}
                                image={track.image}
                                className={`transition-all duration-500 transform ${isProfessionalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
