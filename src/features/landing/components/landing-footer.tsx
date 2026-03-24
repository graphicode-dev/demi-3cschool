import { useScrollAnimation, scrollToSection } from "../hooks";
import { Icon } from "@iconify/react";
import ThemedText from "@/design-system/components/ThemedText";
import { Images } from "@/constants/images";
import { useLanguage } from "@/shared/hooks";

const quickLinkKeys = [
    { labelKey: "nav.home", fallback: "Home", href: "#hero" },
    { labelKey: "nav.aboutUs", fallback: "About Us", href: "#about-us" },
    { labelKey: "nav.why3C", fallback: "Why 3C", href: "#why-3c" },
    {
        labelKey: "nav.accreditation",
        fallback: "Accreditation",
        href: "#accreditation",
    },
    { labelKey: "nav.ourPackages", fallback: "Our Packages", href: "#plans" },
];

const socialLinks = [
    { icon: "la:facebook-f", label: "Facebook", href: "#facebook" },
    { icon: "lucide:instagram", label: "Instagram", href: "#instagram" },
    { icon: "la:whatsapp", label: "WhatsApp", href: "#whatsapp" },
    { icon: "la:linkedin-in", label: "LinkedIn", href: "#linkedin" },
    { icon: "ic:baseline-tiktok", label: "Tiktok", href: "#tiktok" },
];

function LandingFooter() {
    const { t, isRTL } = useLanguage("landing");
    const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation();
    const year = new Date().getFullYear();

    const handleLinkClick = (
        e: React.MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        e.preventDefault();
        const sectionId = href.replace("#", "");
        scrollToSection(sectionId);
    };

    return (
        <footer
            id="contact"
            className="relative z-50 bg-[#e9f7fc] pt-[150px] lg:pt-[240px] pb-10 overflow-x-hidden"
        >
            {/* TopArch Circles for white wave cutout effect */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[45%] w-[120%] flex justify-center items-center pointer-events-none z-10">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="w-[200px] h-[200px] md:w-[320px] md:h-[320px] bg-white rounded-full shrink-0 -mx-[25px] md:-mx-[50px]"
                    />
                ))}
            </div>

            <div
                ref={footerRef}
                className="max-w-[1440px] mx-auto px-6 sm:px-12 relative z-20 flex flex-col justify-between h-full"
            >
                {/* TOP SECTION: Grid for Left and Right Content */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 xl:gap-8 w-full mb-12">
                    {/* LEFT COLUMN: Description & Logo */}
                    <div className={`xl:col-span-4 flex flex-col gap-12 lg:gap-20 xl:pr-6 mt-8 xl:-mt-10 transition-all duration-1000 delay-100 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <ThemedText
                            as="p"
                            weight="medium"
                            className="text-[#0098d5] italic capitalize text-[18px] md:text-[20px] leading-[1.6] max-w-[420px]"
                        >
                            {t(
                                "footer.schoolDesc",
                                "Inspiring young minds to learn coding, build creative projects, and explore the world of technology in a fun and engaging way."
                            )}
                        </ThemedText>

                        {/* 3C Logo */}
                        <img
                            src={
                                isRTL
                                    ? Images.logos.ArabicDark
                                    : Images.logos.EnglishDark
                            }
                            alt="3C Coding School Logo"
                            className="w-[60%] object-contain"
                        />
                    </div>

                    {/* RIGHT COLUMN: Sticker & Middle Section */}
                    <div className="xl:col-span-8 flex flex-col w-full xl:pl-4">
                        {/* RED BOX 1: Top Bar / Sticker Area */}
                        <div className={`relative min-h-[140px] md:min-h-[200px] w-full flex justify-end items-center lg:pr-10 mb-6 transition-all duration-1000 delay-200 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                            {/* Decorative sticker placeholder overlay */}
                            <div
                                className={`absolute ${isRTL ? "left-0" : "right-0"} top-0 lg:-top-16 z-10 w-[350px] h-[200px] pointer-events-none flex justify-center items-center`}
                            >
                                <img
                                    src={Images.landing.footer.robot}
                                    alt="Robot sticker"
                                    className="w-full h-auto"
                                />

                                {/* Text */}
                                <div
                                    className={`absolute top-[48%] left-[58%] transform -translate-x-1/2 -translate-y-1/2 -rotate-6 w-max`}
                                >
                                    <ThemedText
                                        as="p"
                                        weight="bold"
                                        className="text-[#24ade3] text-[18px] uppercase drop-shadow-sm"
                                    >
                                        {t("footer.letsCode", "let's code together")}
                                    </ThemedText>
                                </div>
                            </div>
                        </div>

                        {/* RED BOX 2: Middle Section (Flex Row) */}
                        <div className="flex flex-col md:flex-row justify-between w-full gap-12 lg:gap-8 items-start px-2">
                            {/* RED BOX 2.1: Quick Links */}
                            <div className={`flex flex-col gap-6 shrink-0 basis-[150px] xl:basis-[180px] transition-all duration-1000 delay-300 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <ThemedText
                                    as="h4"
                                    weight="normal"
                                    font="akaya-telivigala"
                                    className="text-[#24ade3] text-[26px] lg:text-[28px] capitalize"
                                >
                                    {t("footer.quickLinks", "Quick Links")}
                                </ThemedText>
                                <ul className="space-y-4">
                                    {quickLinkKeys.map((link) => (
                                        <li
                                            key={link.labelKey}
                                            className="flex items-center gap-3"
                                        >
                                            <div className="w-[5px] h-[5px] rounded-full bg-[#7a7a7a]" />
                                            <a
                                                href={link.href}
                                                onClick={(e) =>
                                                    handleLinkClick(
                                                        e,
                                                        link.href
                                                    )
                                                }
                                                className="text-[#7a7a7a] hover:text-[#24ade3] transition-colors text-[16px] font-semibold capitalize"
                                            >
                                                {t(
                                                    link.labelKey,
                                                    link.fallback
                                                )}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* RED BOX 2.2: Connect With Us */}
                            <div className={`flex flex-col gap-6 flex-1 min-w-[280px] max-w-[400px] transition-all duration-1000 delay-400 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <ThemedText
                                    as="h4"
                                    weight="normal"
                                    font="akaya-telivigala"
                                    className="text-[#24ade3] text-[26px] lg:text-[28px] capitalize"
                                >
                                    {t(
                                        "footer.connectWithUs",
                                        "Connect With Us"
                                    )}
                                </ThemedText>

                                <div className="flex flex-col gap-4">
                                    <ThemedText
                                        as="p"
                                        weight="semibold"
                                        className="text-[#7a7a7a] text-[16px] flex items-center gap-2"
                                    >
                                        <span
                                            role="img"
                                            aria-label="email"
                                            className="text-[12px]"
                                        >
                                            💌
                                        </span>{" "}
                                        {t("footer.stayInLoop", "Stay In The Loop C3")}
                                    </ThemedText>

                                    <div className="relative group w-full max-w-[340px]">
                                        <input
                                            type="email"
                                            placeholder={t("footer.emailPlaceholder", "Email")}
                                            className="w-full bg-transparent border-[1.5px] border-[#c2c1c1] rounded-full px-5 py-2.5 outline-none focus:border-[#24ade3] transition-colors text-[#24ade3] placeholder-[#24ade3] font-semibold text-[14px]"
                                        />
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex flex-wrap gap-2.5 mt-2 max-w-[340px]">
                                    {socialLinks.map((social) => (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className="w-[38px] h-[38px] rounded-full border border-[#24ade3] text-[#24ade3] flex items-center justify-center hover:bg-[#24ade3] hover:text-white transition-all overflow-hidden shrink-0"
                                            aria-label={social.label}
                                        >
                                            <Icon
                                                icon={social.icon}
                                                className="w-5 h-5"
                                            />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* 2.3: "We're Exploring Coding" text */}
                            <div className={`shrink-0 pt-6 xl:pt-10 transition-all duration-1000 delay-500 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                                <img
                                    src={Images.landing.footer.exploringCode}
                                    alt="exploring code graphic"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM SECTION: Full Width Bottom Bar (Guarantees Alignment of Copyright and Designed By text) */}
                <div className={`w-full flex flex-col xl:flex-row justify-between items-end mt-12 relative pb-2 md:pb-6 transition-all duration-1000 delay-600 ${footerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    
                    {/* Left side: Copyright perfectly isolated */}
                    <div className="w-full xl:w-[33%] mb-8 xl:mb-2">
                        <ThemedText
                            as="p"
                            weight="semibold"
                            className="text-[#a4a3a3] text-[15px] xl:text-[16px] lowercase leading-snug"
                        >
                            © {year} {t("footer.copyright1", "3c coding school.")}
                            <br />
                            {t("footer.copyright2", "all rights reserved.")}
                        </ThemedText>
                    </div>

                    {/* Right side: Phone, Address, Line, Designed with love */}
                    <div className="w-full xl:w-[67%] flex flex-col xl:pl-4">
                        {/* Phone & Address */}
                        <div className="flex flex-col md:flex-row items-start lg:items-center justify-between xl:justify-start w-full gap-4 md:gap-14 px-2">
                            {/* Phone */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="w-[5px] h-[5px] rounded-full bg-[#24ade3]" />
                                <div className="flex items-center gap-2">
                                    <ThemedText
                                        as="span"
                                        weight="semibold"
                                        className="text-[#24ade3] text-[15px] xl:text-[16px] capitalize"
                                    >
                                        {t("footer.giveCall", "give us a call")}
                                    </ThemedText>
                                    <ThemedText
                                        as="span"
                                        weight="bold"
                                        className="text-[#7a7a7a] text-[15px] xl:text-[16px]"
                                    >
                                        (+20 10 91092623)
                                    </ThemedText>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start md:items-center gap-3 text-left">
                                <div className="w-[5px] h-[5px] rounded-full bg-[#7a7a7a] mt-2.5 md:mt-0 shrink-0" />
                                <ThemedText
                                    as="p"
                                    weight="bold"
                                    className="text-[#7a7a7a] text-[14px] xl:text-[15px] leading-tight"
                                >
                                    {t("footer.address", "171 El Tahrir, Ad Dawawin, Abdeen, Cairo Governorate 4280102, Egypt")}
                                </ThemedText>
                            </div>
                        </div>

                        {/* Pseudo decorative line */}
                        <div className="hidden xl:block w-full h-[3px] my-10 bg-linear-to-r from-transparent via-[#91d9f6] to-transparent rounded-full" />

                        {/* Designed With Love text pushed to bottom right */}
                        <div className="text-end w-full px-2 mt-4 xl:mt-0 mb-2">
                            <ThemedText
                                as="p"
                                weight="semibold"
                                className="text-[#a4a3a3] text-[14px] xl:text-[15px] lowercase"
                            >
                                {t("footer.designedBy", "designed with love to inspire the next generation of innovators")}
                            </ThemedText>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;
