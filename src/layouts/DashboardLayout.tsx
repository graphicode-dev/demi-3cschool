/**
 * Dashboard Layout
 *
 * Layout for authenticated dashboard pages.
 * Includes sidebar, navbar, and content area.
 * Redirects to login if not authenticated.
 *
 * TODO: Add Sidebar, Navbar, and Backdrop components when available
 */

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { authStore } from "@/auth/auth.store";
import { paths } from "@/router/paths";
import { Loading } from "@/shared/components/ui/Loading";
import Sidebar from "@/shared/components/dashboard/sidebar";
import { SidebarProvider, useSidebar } from "@/shared/context/SidebarContext";
import Navbar from "@/shared/components/dashboard/navbar";
import Backdrop from "@/shared/components/dashboard/Backdrop";
import { Breadcrumb, ConfirmDialogProvider } from "@/design-system";
import { SearchProvider, SearchModal } from "@/search";
import "@/search/init";

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    return (
        <div className="dashboard min-h-screen xl:flex bg-white">
            <div>
                <Sidebar />
                <Backdrop />
            </div>
            <div
                className={`flex-1 min-w-0 transition-all duration-300 ease-in-out bg-gray-50 dark:bg-gray-900 ${
                    isExpanded || isHovered ? "lg:ms-[290px]" : "lg:ms-[90px]"
                } ${isMobileOpen ? "ms-0" : ""}`}
            >
                <Navbar />
                <div className="mx-auto bg-gray-50 dark:bg-gray-900 max-w-(--breakpoint-3xl) overflow-x-hidden">
                    <Breadcrumb />
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export const DashboardLayout = () => {
    const navigate = useNavigate();

    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const hasHydrated = authStore((state) => state._hasHydrated);

    useEffect(() => {
        // Wait for store to hydrate before checking auth
        if (hasHydrated && !isAuthenticated) {
            navigate(paths.auth.login());
        }
    }, [isAuthenticated, hasHydrated, navigate]);

    // Show loading while store is hydrating
    if (!hasHydrated) {
        return <Loading />;
    }

    return (
        <SidebarProvider>
            <ConfirmDialogProvider>
                <SearchProvider>
                    <LayoutContent />
                    <SearchModal />
                </SearchProvider>
            </ConfirmDialogProvider>
        </SidebarProvider>
    );
};

export default DashboardLayout;
