import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    HeroSection,
    InitiativeSection,
    VideoSection,
    HowItWorksSection,
    LearningModeSection,
    WhoCanJoinSection,
    FAQSection,
} from "../components";
import { scrollToSection } from "../hooks";

function HomePage() {
    const location = useLocation();

    // Scroll to section when navigating from another page with hash
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.replace("#", "");
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                scrollToSection(sectionId);
            }, 100);
        }
    }, [location.hash]);

    return (
        <div className="min-h-screen">
            <HeroSection />
            <InitiativeSection />
            <VideoSection />
            <HowItWorksSection />
            <LearningModeSection />
            <WhoCanJoinSection />
            <FAQSection />
        </div>
    );
}

export default HomePage;
