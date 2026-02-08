import { useTranslation } from "react-i18next";
import { RegisterData, CommonFormProps, AuthSteps } from "@/auth/auth.types";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, LoadingState } from "@/design-system";
import { GraduationCap, BookOpen } from "lucide-react";
import { paths } from "@/router";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    role: "student" | "teacher";
};

const SignUpForm = <_T,>({
    StarICon,
    mutationFn,
    navigate,
}: CommonFormProps<{ data: RegisterData; role: "student" | "teacher" }>) => {
    const { t } = useTranslation();

    const signUpSchema = z
        .object({
            name: z.string().min(3, {
                message: t("auth:auth.validation.usernameMinLength"),
            }),
            email: z.string().email({
                message: t("auth:auth.validation.pleaseEnterValidEmail"),
            }),
            role: z.enum(["student", "teacher"], {
                message: t("auth:auth.validation.pleaseSelectRole"),
            }),
            password: z
                .string()
                .min(8, {
                    message: t("auth:auth.validation.passwordMin8"),
                })
                .regex(/[A-Z]/, {
                    message: t("auth:auth.validation.mustContainUppercase"),
                })
                .regex(/[a-z]/, {
                    message: t("auth:auth.validation.mustContainLowercase"),
                })
                .regex(/[0-9]/, {
                    message: t("auth:auth.validation.mustContainNumber"),
                }),
            passwordConfirmation: z.string().min(1, {
                message: t("auth:auth.validation.pleaseConfirmPassword"),
            }),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: t("auth:auth.validation.passwordsDoNotMatch"),
            path: ["passwordConfirmation"],
        });
    const { mutateAsync: signUpMutation, isPending: isSignUpPending } =
        mutationFn();
    const { execute } = useMutationHandler();
    const { setAuthStep } = authStore();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors },
    } = useForm<FormFields>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange",
        defaultValues: {
            role: "student",
        },
    });

    const password = useWatch({ control, name: "password" });
    const confirmPassword = useWatch({ control, name: "passwordConfirmation" });

    const isPasswordValid = (password: string) => ({
        minLength: password?.length >= 8,
        hasUppercase: /[A-Z]/.test(password || ""),
        hasLowercase: /[a-z]/.test(password || ""),
        hasNumber: /[0-9]/.test(password || ""),
        passwordsMatch:
            password === confirmPassword &&
            password?.length > 0 &&
            confirmPassword?.length > 0,
    });

    const passwordValidations = isPasswordValid(password);
    const allValid =
        Object.values(passwordValidations).every(Boolean) &&
        formErrors.name === undefined &&
        formErrors.email === undefined &&
        formErrors.role === undefined;

    const onSubmit = (data: FormFields) => {
        execute(
            () =>
                signUpMutation({
                    data: {
                        name: data.name,
                        email: data.email,
                        password: data.password,
                        passwordConfirmation: data.passwordConfirmation,
                    },
                    role: data.role,
                }),
            {
                successMessage: t("auth:auth.signUpSuccessful"),
                onSuccess: () => {
                    reset();
                    setAuthStep(AuthSteps.SignUpComplete);
                    navigate?.(paths.dashboard.classroom.profile());
                },
            }
        );
    };

    if (isSignUpPending) return <LoadingState />;

    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-2 text-left">
                <h1 className="text-3xl text-brand-500-300 font-bold capitalize">
                    {t("auth:auth.hello")}
                </h1>
                <span className="text-3xl text-brand-500-500 font-bold capitalize flex items-center gap-2">
                    {t("auth:auth.there")} {StarICon && <StarICon />}
                </span>

                <p className="text-xl text-blue-light-500 capitalize max-w-md">
                    {t("auth:auth.excitedToRegister")}{" "}
                    <span className="text-brand-500-300 font-bold">
                        {t("auth:auth.signUp")}!
                    </span>
                </p>
            </div>

            {/* Form */}
            <Form
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                errors={formErrors}
                layout={{
                    removeBorder: true,
                    columns: 1,
                }}
            >
                {/* Role Tabs */}
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        {t("auth:auth.iAmA")}
                    </label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => field.onChange("student")}
                                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                        field.value === "student"
                                            ? "border-gray-900 bg-white text-gray-900 shadow-lg"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    <GraduationCap
                                        className={`w-6 h-6 ${
                                            field.value === "student"
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span className="font-semibold">
                                        {t("auth:auth.student")}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => field.onChange("teacher")}
                                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border-2 transition-all duration-300 ${
                                        field.value === "teacher"
                                            ? "border-gray-900 bg-white text-gray-900 shadow-lg"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    }`}
                                >
                                    <BookOpen
                                        className={`w-6 h-6 ${
                                            field.value === "teacher"
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                        }`}
                                    />
                                    <span className="font-semibold">
                                        {t("auth:auth.teacher")}
                                    </span>
                                </button>
                            </div>
                        )}
                    />
                    {formErrors.role && (
                        <p className="mt-2 text-sm text-red-500">
                            {formErrors.role.message}
                        </p>
                    )}
                </div>

                <Form.Input
                    name="name"
                    type={{
                        type: "text",
                        placeholder: t("auth:auth.username"),
                    }}
                    label={{ text: t("auth:auth.username") }}
                />
                <Form.Input
                    name="email"
                    type={{
                        type: "email",
                        placeholder: t("auth:auth.email"),
                    }}
                    label={{ text: t("auth:auth.email") }}
                />

                <div className="w-full">
                    <Form.Input
                        name="password"
                        type={{
                            type: "password",
                            placeholder: t("auth:auth.password"),
                        }}
                        label={{ text: t("auth:auth.password") }}
                    />
                </div>

                <Form.Input
                    name="passwordConfirmation"
                    label={{ text: t("auth:auth.confirmPassword") }}
                    type={{
                        type: "password",
                        placeholder: t("auth:auth.confirmPassword"),
                    }}
                />

                <Form.Button
                    config={{
                        text: t("auth:auth.confirm"),
                        loading: isSignUpPending,
                        disabled: !allValid || isSignUpPending,
                        fullWidth: true,
                    }}
                    className="col-span-2"
                />
            </Form>
        </>
    );
};

export default SignUpForm;
