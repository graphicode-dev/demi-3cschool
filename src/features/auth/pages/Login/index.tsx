import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { safeNavigate } from "@/utils";
import { AuthSteps } from "@/auth/auth.types";
import { paths } from "@/router";
import { variants } from "../../components/variants";
import LoginForm from "../../components/forms/login/LoginForm";
import LoginMagicLinkForm from "../../components/forms/login/LoginMagicLinkForm";
import { authStore } from "@/auth/auth.store";
import { useLogin, useLoginWithMagicLink } from "../../api/auth.mutations";
import { tokenService } from "@/auth";

function LoginPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated, setAuthStep, authStep, _hasHydrated } =
        authStore();
    const hasRedirected = useRef(false);

    const isPopup = window.opener !== null;

    const handleSignUp = () => {
        setAuthStep(AuthSteps.SignUp);
        navigate(paths.auth.signup());
    };

    const isLoginStep =
        authStep === AuthSteps.Login ||
        authStep === AuthSteps.PasswordResetComplete ||
        authStep === AuthSteps.SignUpComplete;

    const renderForm = () => {
        const direction = isLoginStep ? 1 : -1;

        return (
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={authStep}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="w-full"
                >
                    {isLoginStep ? (
                        <LoginForm
                            mutationFn={useLogin}
                            navigate={navigate}
                            isPopup={isPopup}
                        />
                    ) : authStep === AuthSteps.LoginMagicLink ? (
                        <LoginMagicLinkForm
                            mutationFn={useLoginWithMagicLink}
                            navigate={navigate}
                            isPopup={isPopup}
                        />
                    ) : null}
                </motion.div>
            </AnimatePresence>
        );
    };

    useEffect(() => {
        setAuthStep(AuthSteps.Login);
    }, []);

    useEffect(() => {
        // Wait for hydration and check if user has a valid token
        // This prevents redirect loops when store has stale isAuthenticated state
        if (
            _hasHydrated &&
            isAuthenticated &&
            tokenService.hasToken() &&
            !hasRedirected.current
        ) {
            hasRedirected.current = true;
            safeNavigate(navigate, paths.dashboard.classroom.profile());
        }
    }, [isAuthenticated, _hasHydrated, navigate]);

    return (
        <>
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    {t("auth:auth.welcomeBack")}
                </h1>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                    {t("auth:auth.loginDescription")}
                </p>
            </div>

            {/* Form */}
            {renderForm()}

            {/* Footer */}
            <div className="text-center">
                <p className="text-gray-500">
                    {t("auth:auth.dontHaveAccount")}{" "}
                    <span
                        onClick={handleSignUp}
                        className="text-brand-500 font-semibold cursor-pointer hover:underline"
                    >
                        {t("auth:auth.signUp")}
                    </span>
                </p>
            </div>
        </>
    );
}

export default LoginPage;
