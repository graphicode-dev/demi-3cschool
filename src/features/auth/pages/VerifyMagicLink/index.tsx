import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/shared/hooks";
import { paths } from "@/router";
import { Loading } from "@/shared/components/ui/Loading";
import { useVerifyMagicLink } from "../../api/auth.queries";

function VerifyMagicLink() {
    const { t } = useTranslation();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const hasShownToast = useRef(false);

    // Call the hook at the top level, not inside useEffect
    const { isLoading, isError, isSuccess } = useVerifyMagicLink(token || "");

    // Handle no token case
    useEffect(() => {
        if (!token && !hasShownToast.current) {
            hasShownToast.current = true;
            addToast({
                title: t("pages.common.error"),
                message: t("auth:auth.noTokenProvided"),
                type: "error",
            });
        }
    }, [token, addToast]);

    // Handle success toast
    useEffect(() => {
        if (isSuccess && !hasShownToast.current) {
            hasShownToast.current = true;
            addToast({
                title: t("pages.common.success"),
                message: t("auth:auth.successfullyLoggedInMagicLink"),
                type: "success",
            });
            setTimeout(() => {
                navigate(paths.site.home());
            }, 5000);
        }
    }, [isSuccess, addToast]);

    // Handle error toast
    useEffect(() => {
        if (isError && !hasShownToast.current) {
            hasShownToast.current = true;
            addToast({
                title: t("pages.common.error"),
                message: t("auth:auth.failedToVerifyMagicLink"),
                type: "error",
            });
        }
    }, [isError, addToast]);

    // No token - redirect to login
    if (!token) return <Navigate to={paths.auth.login()} replace />;

    // Loading state
    if (isLoading) return <Loading />;

    // Error state
    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-gray-200 rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-brand-500-50 mb-3">
                            {t("auth:auth.verificationFailed")}
                        </h2>

                        <p className="text-brand-500-100 mb-8 leading-relaxed">
                            {t("auth:auth.magicLinkExpired")}
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-brand-500-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {t("auth:auth.tryAgain")}
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => navigate(paths.site.home())}
                                className="w-full bg-primary-50 hover:bg-primary-600 hover:text-brand-500-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                            >
                                {t("auth:auth.goToHome")}
                            </button>
                        </div>

                        <div className="mt-6 pt-6 border-t border-blue-light-800">
                            <p className="text-sm text-brand-500-50">
                                {t("auth:auth.needHelp")}{" "}
                                <a
                                    href="#"
                                    className="text-brand-500-200 hover:text-brand-500-600 font-medium"
                                >
                                    {t("auth:auth.contactSupport")}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Success - redirect to home
    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-gray-200 rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 animate-pulse">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-bold text-brand-500-50 mb-3">
                            {t("auth:auth.welcomeBack")}
                        </h2>

                        <p className="text-brand-500-100 mb-6 leading-relaxed">
                            {t("auth:auth.magicLinkVerified")}
                        </p>

                        <div className="bg-primary-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-brand-500-500 flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("auth:auth.redirectingToHome")}
                            </p>
                        </div>

                        <button
                            onClick={() => navigate(paths.site.home())}
                            className="w-full bg-primary-500 hover:bg-primary-600 text-brand-500-50 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {t("auth:auth.continueToHome")}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default VerifyMagicLink;
