import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
    HeroSection,
    AboutSection,
    Why3C,
    Strap,
    OurLeaders,
    Tracks,
    Plans,
    Certificate,
    Register,
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
            <AboutSection />
            <Why3C />
            <Strap />
            <OurLeaders />
            <Tracks />
            <Plans />
            <Certificate />
            <Register />
        </div>
    );
}

export default HomePage;
