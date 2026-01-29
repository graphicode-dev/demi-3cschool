import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { safeNavigate } from "@/utils";
import { paths } from "@/router";
import { AuthSteps } from "@/auth/auth.types";
import { variants } from "../../components/variants";
import SignUpForm from "../../components/forms/register/SignUpForm";
import { authStore } from "@/auth/auth.store";
import { useSignUp } from "../../api/auth.mutations";

function SignUpPage() {
    const { t } = useTranslation();
    const { isAuthenticated, authStep, setAuthStep } = authStore();
    const navigate = useNavigate();

    const handleLogin = () => {
        setAuthStep(AuthSteps.Login);
        navigate(paths.auth.login());
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
                    {authStep === AuthSteps.SignUp && (
                        <SignUpForm
                            mutationFn={useSignUp}
                            navigate={navigate}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        );
    };

    useEffect(() => {
        setAuthStep(AuthSteps.SignUp);
    }, [setAuthStep]);

    useEffect(() => {
        if (isAuthenticated) {
            safeNavigate(navigate, paths.dashboard.classroom.profile());
        }
    }, [isAuthenticated]);

    return (
        <>
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                    {t("auth:auth.createAccount")}
                </h1>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                    {t("auth:auth.signUpDescription")}
                </p>
            </div>

            {/* Form */}
            {renderForm()}

            {/* Footer */}
            <div className="text-center">
                <p className="text-gray-500">
                    {t("auth:auth.alreadyHaveAccount")}{" "}
                    <span
                        onClick={handleLogin}
                        className="text-brand-500 font-semibold cursor-pointer hover:underline"
                    >
                        {t("auth:auth.logIn")}
                    </span>
                </p>
            </div>
        </>
    );
}

export default SignUpPage;
