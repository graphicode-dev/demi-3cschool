import { useNavigate } from "react-router-dom";
import { paths } from "@/router/paths";
import { useTranslation } from "react-i18next";
import { ShieldX, Home, ArrowLeft } from "lucide-react";

function UnauthorizedPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 px-6">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 text-center">
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-error-100 dark:bg-error-500/20 flex items-center justify-center">
                    <ShieldX className="w-10 h-10 text-error-500" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t("auth:auth.unauthorized.unauthorizedAccess")}
                </h1>

                {/* Code */}
                <p className="text-5xl font-bold text-error-500 mb-4">403</p>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {t("auth:auth.unauthorized.noPermission")}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-5 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("auth:auth.unauthorized.goBack")}
                    </button>
                    <button
                        onClick={() => navigate(paths.site.home())}
                        className="px-5 py-3 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Home className="w-4 h-4" />
                        {t("auth:auth.unauthorized.goHome")}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        {t("auth:auth.unauthorized.needHelp")}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UnauthorizedPage;
