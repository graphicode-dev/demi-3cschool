/**
 * Route Error Boundary
 *
 * Error boundary component for route-level error handling.
 * Displays a user-friendly error message when a route fails.
 */

import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API_CONFIG } from "@/shared/api";

/**
 * Error boundary for routes
 *
 * @example
 * ```tsx
 * {
 *     path: '/courses',
 *     errorElement: <RouteErrorBoundary />,
 *     children: [...],
 * }
 * ```
 */
export function RouteErrorBoundary() {
    const error = useRouteError();
    const { t } = useTranslation();

    let title = t("errors.unexpected", "Something went wrong");
    let message = t("errors.tryAgain", "Please try again later.");
    let statusCode: number | undefined;

    if (isRouteErrorResponse(error)) {
        statusCode = error.status;

        switch (error.status) {
            case 404:
                title = t("errors.notFound", "Page Not Found");
                message = t(
                    "errors.notFoundMessage",
                    "The page you're looking for doesn't exist."
                );
                break;
            case 401:
                title = t("errors.unauthorized", "Unauthorized");
                message = t(
                    "errors.unauthorizedMessage",
                    "You need to log in to access this page."
                );
                break;
            case 403:
                title = t("errors.forbidden", "Access Denied");
                message = t(
                    "errors.forbiddenMessage",
                    "You don't have permission to access this page."
                );
                break;
            case 500:
                title = t("errors.serverError", "Server Error");
                message = t(
                    "errors.serverErrorMessage",
                    "Something went wrong on our end."
                );
                break;
            default:
                message = error.statusText || message;
        }
    } else if (error instanceof Error) {
        // Only show error message in development
        if (API_CONFIG.ENV_MODE == "DEV") {
            message = error.message;
        }
    }

    return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
            <div className="text-center">
                {statusCode && (
                    <p className="text-6xl font-bold text-gray-300 dark:text-gray-700">
                        {statusCode}
                    </p>
                )}
                <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    {title}
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {message}
                </p>
                <div className="mt-6 flex gap-4 justify-center">
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        {t("actions.retry", "Try Again")}
                    </button>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        {t("actions.goHome", "Go Home")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RouteErrorBoundary;
