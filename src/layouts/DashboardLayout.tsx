/**
 * Dashboard Layout
 *
 * Layout for authenticated dashboard pages.
 * Includes sidebar, navbar, and content area.
 * Redirects to login if not authenticated.
 *
 * TODO: Add Sidebar, Navbar, and Backdrop components when available
 */

import { lazy, Suspense, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
import { CLASSROOM_PATH } from "@/features/dashboard/classroom/navigation/constant";
import { ADMIN_PATH } from "@/features/dashboard/admin/navigation/constant";

const NavbarSessionCountdown = lazy(
    () => import("@/shared/components/dashboard/navbar/NavbarSessionCountdown")
);

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const user = authStore((state) => state.user);
    const roleName = user?.role?.name?.toLowerCase().trim();
    const canSeeSessionBanner =
        roleName === "student" || roleName === "teacher";

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
                {canSeeSessionBanner && (
                    <Suspense fallback={null}>
                        <div className="sticky top-[72px] z-10 w-full px-10 pt-6 pb-2 bg-white dark:bg-gray-900/70 dark:supports-backdrop-filter:bg-gray-900/50">
                            <NavbarSessionCountdown />
                        </div>
                    </Suspense>
                )}
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
    const location = useLocation();

    const isAuthenticated = authStore((state) => state.isAuthenticated);
    const hasHydrated = authStore((state) => state._hasHydrated);
    const user = authStore((state) => state.user);

    const userRole = user?.role?.name?.toLowerCase();
    const isAdmin = userRole === "admin" || userRole === "super_admin";

    useEffect(() => {
        // Wait for store to hydrate before checking auth
        if (hasHydrated && !isAuthenticated) {
            navigate(paths.auth.login());
        }
    }, [isAuthenticated, hasHydrated, navigate]);

    useEffect(() => {
        // Role-based route protection
        if (!hasHydrated || !isAuthenticated || !user) return;

        const { pathname } = location;

        // Admin trying to access classroom routes -> redirect to admin
        if (isAdmin && pathname.startsWith(CLASSROOM_PATH)) {
            navigate(`${ADMIN_PATH}/profile`, { replace: true });
            return;
        }

        // Student/Teacher trying to access admin routes -> redirect to classroom
        if (!isAdmin && pathname.startsWith(ADMIN_PATH)) {
            navigate(`${CLASSROOM_PATH}/profile`, { replace: true });
            return;
        }
    }, [hasHydrated, isAuthenticated, user, isAdmin, location, navigate]);

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
