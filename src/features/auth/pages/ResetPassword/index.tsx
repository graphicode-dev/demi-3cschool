import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { safeNavigate } from "@/utils";
import { AuthSteps } from "@/auth/auth.types";
import { paths } from "@/router";
import { variants } from "../../components/variants";
import ResetEmailForm from "../../components/forms/reset/ResetEmailForm";
import EmailResetVerify from "../../components/forms/reset/EmailResetVerify";
import ResetPasswordForm from "../../components/forms/reset/ResetPasswordForm";
import Success from "../../components/Success";
import { authStore } from "@/auth/auth.store";
import {
    useSendForgotPasswordVerificationCode,
    useVerifyForgotPasswordVerificationCode,
    useResetPassword,
} from "../../api/auth.mutations";

function ResetPassword() {
    const { t } = useTranslation();
    const { isAuthenticated, authStep, setAuthStep } = authStore();
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        setAuthStep(AuthSteps.Login);
        navigate(paths.auth.login());
    };

    const getHeaderContent = () => {
        switch (authStep) {
            case AuthSteps.EmailReset:
                return {
                    title: t("auth:auth.forgotPasswordTitle"),
                    description: t("auth:auth.forgotPasswordDescription"),
                };
            case AuthSteps.EmailResetVerify:
                return {
                    title: t("auth:auth.verifyYourEmail"),
                    description: t("auth:auth.verifyEmailDescription"),
                };
            case AuthSteps.PasswordReset:
                return {
                    title: t("auth:auth.createNewPassword"),
                    description: t("auth:auth.createNewPasswordDescription"),
                };
            default:
                return {
                    title: t("auth:auth.resetPassword"),
                    description: t("auth:auth.resetPasswordDescription"),
                };
        }
    };

    const renderForm = () => {
        const direction = authStep === AuthSteps.SignUp ? 1 : -1;

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
                    {authStep === AuthSteps.EmailReset ? (
                        <ResetEmailForm
                            mutationFn={useSendForgotPasswordVerificationCode}
                            navigate={navigate}
                        />
                    ) : authStep === AuthSteps.EmailResetVerify ? (
                        <EmailResetVerify
                            mutationFn={useVerifyForgotPasswordVerificationCode}
                            navigate={navigate}
                        />
                    ) : authStep === AuthSteps.PasswordReset ? (
                        <ResetPasswordForm
                            mutationFn={useResetPassword}
                            navigate={navigate}
                        />
                    ) : authStep === AuthSteps.PasswordResetComplete ? (
                        <Success
                            text={t("auth:auth.passwordResetSuccess")}
                            href={paths.dashboard.classroom.profile()}
                        />
                    ) : null}
                </motion.div>
            </AnimatePresence>
        );
    };

    useEffect(() => {
        setAuthStep(AuthSteps.EmailReset);
    }, [setAuthStep]);

    useEffect(() => {
        if (isAuthenticated) {
            safeNavigate(navigate, paths.dashboard.classroom.profile());
        }
    }, [isAuthenticated]);

    const headerContent = getHeaderContent();

    return (
        <>
            {/* Header */}
            {authStep !== AuthSteps.PasswordResetComplete && (
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        {headerContent.title}
                    </h1>
                    <p className="text-lg text-gray-500 max-w-md mx-auto">
                        {headerContent.description}
                    </p>
                </div>
            )}

            {/* Form */}
            {renderForm()}

            {/* Footer */}
            {authStep !== AuthSteps.PasswordResetComplete && (
                <div className="text-center">
                    <p className="text-gray-500">
                        {t("auth:auth.rememberPassword")}{" "}
                        <span
                            onClick={handleBackToLogin}
                            className="text-brand-500 font-semibold cursor-pointer hover:underline"
                        >
                            {t("auth:auth.backToLogin")}
                        </span>
                    </p>
                </div>
            )}
        </>
    );
}

export default ResetPassword;
