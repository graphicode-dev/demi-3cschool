import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-phone-input-2/lib/bootstrap.css";
import Providers from "./providers/index.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routeRegistry, RouteErrorBoundary } from "@/router";
import { RootLayout, AuthLayout, SiteLayout, DashboardLayout } from "@/layouts";
import "./i18n";

// Import router to trigger feature registration
import "@/router";
import ErrorBoundaryClass from "./shared/observability/ErrorBoundary.tsx";
import { LoadingState } from "./design-system/index.ts";

function AppRouter() {
    const router = useMemo(() => {
        // Get routes grouped by layout type
        const routesByLayout = routeRegistry.getRoutesByLayout();

        // Create data router with layout-based route structure
        return createBrowserRouter([
            {
                path: "/",
                element: <RootLayout />,
                errorElement: <RouteErrorBoundary />,
                hydrateFallbackElement: <LoadingState />,
                children: [
                    // Site routes (public landing pages)
                    {
                        element: <SiteLayout />,
                        children: routesByLayout.site,
                    },
                    // Auth routes (login, signup, etc.)
                    {
                        element: <AuthLayout />,
                        children: routesByLayout.auth,
                    },
                    // Dashboard routes (authenticated)
                    {
                        element: <DashboardLayout />,
                        children: routesByLayout.dashboard,
                    },
                    // Routes without layout wrapper
                    ...routesByLayout.none,
                ],
            },
        ]);
    }, []);

    return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <ErrorBoundaryClass>
                <AppRouter />
            </ErrorBoundaryClass>
        </Providers>
    </StrictMode>
);
