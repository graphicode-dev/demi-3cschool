/**
 * Root Layout
 *
 * Wraps all routes with common providers and hooks.
 * This component is inside the router context, so it can use router hooks.
 */

import { Outlet } from "react-router-dom";
import { useTitle } from "@/shared/hooks/useTitle";
import { AuthSyncProvider } from "@/auth";

function RootLayout() {
    useTitle();

    return (
        <AuthSyncProvider>
            <div className="w-full h-full bg-white dark:bg-gray-800">
                <Outlet />
            </div>
        </AuthSyncProvider>
    );
}

export default RootLayout;
