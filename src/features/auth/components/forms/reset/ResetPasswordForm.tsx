import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthSteps, CommonFormProps } from "@/auth/auth.types";
import { Form } from "@/design-system";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    password: string;
    confirmPassword: string;
};

function ResetPasswordForm({ mutationFn }: CommonFormProps<any>) {
    const { t } = useTranslation();

    const resetPasswordSchema = z
        .object({
            password: z
                .string()
                .min(6, t("auth:auth.validation.passwordMinLength")),
            confirmPassword: z
                .string()
                .min(1, t("auth:auth.validation.pleaseConfirmPassword")),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("auth:auth.validation.passwordsDoNotMatch"),
            path: ["confirmPassword"],
        });
    const { setAuthStep } = authStore();
    const { execute } = useMutationHandler();

    const {
        mutateAsync: resetPasswordMutation,
        isPending: isResetPasswordPending,
    } = mutationFn();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors: formErrors, isDirty },
    } = useForm<FormFields>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onSubmit",
    });

    const password = watch("password");

    const confirmPassword = watch("confirmPassword");

    const onSubmit = (data: FormFields) => {
        execute(() => resetPasswordMutation(data), {
            successMessage: t("auth:auth.passwordResetSuccessfully"),
            onSuccess: () => {
                reset();
                setAuthStep(AuthSteps.PasswordResetComplete);
            },
        });
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-2 text-left">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl text-brand-500-300 font-bold capitalize">
                        {t("auth:auth.newPassword")}
                    </h1>
                </div>

                <p className="text-xl text-blue-light-500 capitalize max-w-md">
                    {t("auth:auth.inThisStepResetPassword")}
                </p>
            </div>

            {/* Form */}
            <Form
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                errors={{}}
            >
                <Form.Input
                    name="password"
                    type={{
                        type: "password",
                        placeholder: t("auth:auth.password"),
                    }}
                    label={{
                        text: t("auth:auth.password"),
                    }}
                />
                <Form.Input
                    name="confirmPassword"
                    type={{
                        type: "password",
                        placeholder: t("auth:auth.confirmPassword"),
                    }}
                    label={{
                        text: t("auth:auth.confirmPassword"),
                    }}
                />

                <Form.Button
                    config={{
                        text: t("auth:auth.confirm"),
                        loading: isResetPasswordPending,
                        disabled:
                            !password ||
                            !confirmPassword ||
                            password !== confirmPassword ||
                            !isDirty ||
                            isResetPasswordPending,
                    }}
                />
            </Form>
        </>
    );
}

export default ResetPasswordForm;
