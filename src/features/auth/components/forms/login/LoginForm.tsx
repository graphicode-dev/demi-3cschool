import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AuthSteps, CommonLoginFormProps } from "@/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Sparkles, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { safeNavigate } from "@/utils";
import { paths } from "@/router";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    email: string;
    password: string;
};

const LoginForm = <_T,>({
    mutationFn,
    navigate,
}: CommonLoginFormProps<any>) => {
    const { t } = useTranslation();

    const loginSchema = z.object({
        email: z
            .string()
            .email(t("auth:auth.validation.pleaseEnterValidEmail")),
        password: z
            .string()
            .min(6, t("auth:auth.validation.passwordMinLength")),
    });
    const [showPassword, setShowPassword] = useState(false);
    const { setAuthStep } = authStore();
    const { execute } = useMutationHandler();
    const { mutateAsync: loginMutation, isPending: isLoginPending } =
        mutationFn();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm<FormFields>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: FormFields) => {
        execute(() => loginMutation(data), {
            successMessage: t("auth:auth.loginSuccessful"),
            onSuccess: () => {
                reset();
                safeNavigate(navigate!, paths.dashboard.classroom.profile());
            },
        });
    };

    const handleForgotPassword = () => {
        setAuthStep(AuthSteps.EmailReset);
        navigate?.(paths.auth.resetPassword());
    };

    const handleMagicLinkLogin = () => {
        setAuthStep(AuthSteps.LoginMagicLink);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
                <label className="text-lg font-medium text-gray-800">
                    {t("auth:auth.emailAddress")}
                </label>
                <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        <Mail className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder={t("auth:auth.emailPlaceholder")}
                        className="w-full h-[60px] pl-14 pr-5 text-lg border-2 border-gray-200 rounded-2xl focus:border-brand-500 focus:outline-none transition-colors placeholder:text-gray-400"
                    />
                </div>
                {errors.email && (
                    <p className="text-sm text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
                <label className="text-lg font-medium text-gray-800">
                    {t("auth:auth.password")}
                </label>
                <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2">
                        <Lock className="h-6 w-6 text-gray-400" />
                    </div>
                    <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder={t("auth:auth.passwordPlaceholder")}
                        className="w-full h-[60px] pl-14 pr-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-brand-500 focus:outline-none transition-colors placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {showPassword ? (
                            <EyeOff className="h-6 w-6" />
                        ) : (
                            <Eye className="h-6 w-6" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-sm text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end -mt-2">
                <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-brand-500 font-medium hover:underline"
                >
                    {t("auth:auth.forgotPassword")}
                </button>
            </div>

            {/* Login Button */}
            <button
                type="submit"
                disabled={!isDirty || isLoginPending}
                className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-300 text-white text-xl font-semibold h-[60px] rounded-full shadow-lg shadow-brand-500/25 transition-all duration-200"
            >
                {isLoginPending ? (
                    <span className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                    <>
                        {t("auth:auth.logIn")}
                        <ArrowRight className="h-6 w-6" />
                    </>
                )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gray-200" />
                </div>
                <span className="relative bg-white px-4 text-gray-500">
                    {t("auth:auth.or")}
                </span>
            </div>

            {/* Magic Link Button */}
            <button
                type="button"
                onClick={handleMagicLinkLogin}
                disabled={isLoginPending}
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-brand-500 text-brand-500 text-xl font-semibold h-[60px] rounded-full hover:bg-brand-50 transition-all duration-200"
            >
                <Sparkles className="h-6 w-6" />
                {t("auth:auth.logInWithMagicLink")}
            </button>

            {/* Helper Text */}
            <p className="text-center text-gray-500">
                {t("auth:auth.magicLinkHelper")}
            </p>
        </form>
    );
};

export default LoginForm;
