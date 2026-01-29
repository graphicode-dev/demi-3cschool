/**
 * Site Layout
 *
 * Layout for public site pages (landing, about, contact, etc.).
 * Provides a clean wrapper for public-facing content.
 */

import { LandingFooter, LandingNavbar } from "@/features/landing/components";
import { Outlet } from "react-router-dom";

function SiteLayout() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-800">
            <LandingNavbar />
            <Outlet />
            <LandingFooter />
        </div>
    );
}

export default SiteLayout;
