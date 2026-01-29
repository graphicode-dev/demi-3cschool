import { useTranslation } from "react-i18next";
import { useScrollAnimation, scrollToSection } from "../hooks";
import logo3C from "@/assets/images/landing/3c-white.png";
import MCAR from "@/assets/images/landing/MCAR.png";
import MCEN from "@/assets/images/landing/MCEN.png";
import { Icon } from "@iconify/react";

const quickLinkKeys = [
    { labelKey: "footer.aboutInitiative", href: "#about" },
    { labelKey: "footer.howItWorks", href: "#how-it-works" },
    { labelKey: "nav.faq", href: "#faq" },
    { labelKey: "footer.contactUs", href: "#contact" },
    { labelKey: "footer.privacyPolicy", href: "#privacy" },
    { labelKey: "footer.termsOfService", href: "#terms" },
];

const socialLinks = [
    { icon: "iconoir:facebook", label: "Facebook", href: "#facebook" },
    { icon: "si:twitter-line", label: "Twitter", href: "#twitter" },
    { icon: "line-md:instagram", label: "Instagram", href: "#instagram" },
    { icon: "line-md:tiktok", label: "Tiktok", href: "#tiktok" },
    { icon: "line-md:linkedin", label: "LinkedIn", href: "#linkedin" },
    { icon: "mingcute:earth-4-line", label: "Website", href: "#website" },
];

function LandingFooter() {
    const { t, i18n } = useTranslation("landing");
    const { ref: footerRef, isVisible: footerVisible } = useScrollAnimation();
    const isRTL = i18n.language === "ar";
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
        <footer id="contact" className="relative z-50 bg-brand-700 text-white">
            <div
                ref={footerRef}
                className={`max-w-7xl mx-auto px-4 sm:px-8 lg:px-8 py-12 lg:py-20 transition-all duration-700 ${
                    footerVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                }`}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
                    {/* Ministry Column */}
                    <div>
                        {isRTL ? (
                            <img
                                src={MCAR}
                                alt="Ministry of Communications"
                                className="h-20 lg:h-24 object-contain mb-4 lg:mb-6"
                            />
                        ) : (
                            <img
                                src={MCEN}
                                alt="Ministry of Communications"
                                className="h-20 lg:h-24 object-contain mb-4 lg:mb-6"
                            />
                        )}
                        <p className="text-white/80 text-base lg:text-[18px] lg:leading-[25px]">
                            {t("footer.ministryDesc")}
                        </p>
                    </div>

                    {/* 3C Logo Column */}
                    <div>
                        <img
                            src={logo3C}
                            alt="3C Online Coding School"
                            className="h-20 lg:h-24 object-contain mb-4 lg:mb-6"
                        />

                        <p className="text-white/80 text-base lg:text-[18px] lg:leading-[25px]">
                            {t("footer.schoolDesc")}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-2xl lg:text-[30px] lg:leading-[42px] mb-4 lg:mb-6">
                            {t("footer.quickLinks")}
                        </h4>
                        <ul className="space-y-2 lg:space-y-2.5">
                            {quickLinkKeys.map((link) => (
                                <li key={link.labelKey}>
                                    <a
                                        href={link.href}
                                        onClick={(e) =>
                                            handleLinkClick(e, link.href)
                                        }
                                        className="text-white/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-300 text-base lg:text-[18px] lg:leading-[25px]"
                                    >
                                        {t(link.labelKey)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div>
                        <h4 className="font-semibold text-2xl lg:text-[30px] lg:leading-[42px] mb-4 lg:mb-6">
                            {t("footer.contactUs")}
                        </h4>
                        <ul className="space-y-3 lg:space-y-4 mb-6 lg:mb-8">
                            <li className="flex items-center gap-3 lg:gap-4 group">
                                <Icon
                                    icon="flowbite:envelope-outline"
                                    className="w-5 h-5 lg:w-6 lg:h-6"
                                />
                                <a
                                    href="mailto:info@3cschool.net"
                                    className="text-white/80 text-base lg:text-[17px] lg:leading-[25px] group-hover:text-white transition-colors duration-300"
                                >
                                    info@3cschool.net
                                </a>
                            </li>
                            <li className="flex items-center gap-3 lg:gap-4 group">
                                <Icon
                                    icon="mdi-light:phone"
                                    className="w-5 h-5 lg:w-6 lg:h-6"
                                />
                                <a
                                    href="tel:+201023168167"
                                    className="text-white/80 text-base lg:text-[17px] lg:leading-[25px] group-hover:text-white transition-colors duration-300"
                                    dir="ltr"
                                >
                                    +20 10 23168167
                                </a>
                            </li>
                        </ul>

                        {/* Social Links */}
                        <div>
                            <h5 className="font-semibold text-base lg:text-[18px] lg:leading-[25px] mb-3 lg:mb-4">
                                {t("footer.followUs")}
                            </h5>
                            <div className="flex flex-wrap gap-3 lg:gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        className="w-10 h-10 lg:w-[50px] lg:h-[50px] bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-300"
                                    >
                                        <span className="sr-only">
                                            {social.label}
                                        </span>
                                        <Icon
                                            icon={social.icon}
                                            className="w-5 h-5 lg:w-6 lg:h-6"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 mt-12 lg:mt-16 pt-8 lg:pt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-white/70 text-base lg:text-[18px] lg:leading-[25px] text-center sm:text-left">
                        {t("footer.copyright", { year })}
                    </p>
                    <div className="flex items-center gap-6 lg:gap-8 flex-wrap justify-center">
                        <a
                            href="#privacy"
                            className="text-white/70 hover:text-white transition-colors text-base lg:text-[18px] lg:leading-[25px]"
                        >
                            {t("footer.privacyPolicy")}
                        </a>
                        <a
                            href="#terms"
                            className="text-white/70 hover:text-white transition-colors text-base lg:text-[18px] lg:leading-[25px]"
                        >
                            {t("footer.termsOfService")}
                        </a>
                        <a
                            href="#accessibility"
                            className="text-white/70 hover:text-white transition-colors text-base lg:text-[18px] lg:leading-[25px]"
                        >
                            {t("footer.accessibility")}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default LandingFooter;
