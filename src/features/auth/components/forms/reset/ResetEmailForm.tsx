import { useTranslation } from "react-i18next";
import { Form } from "@/design-system/components/form";
import { AuthSteps, CommonFormProps } from "@/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    email: string;
};

function ResetEmailForm({ mutationFn }: CommonFormProps<any>) {
    const { t } = useTranslation();

    const sendResetCodeSchema = z.object({
        email: z
            .string()
            .email(t("auth:auth.validation.pleaseEnterValidEmail")),
    });
    const { setAuthStep } = authStore();
    const { execute } = useMutationHandler();

    const { mutateAsync: sendCodeMutation, isPending: isSendCodePending } =
        mutationFn();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors: formErrors, isDirty },
    } = useForm<FormFields>({
        resolver: zodResolver(sendResetCodeSchema),
        mode: "onSubmit",
    });

    const email = watch("email");

    const onSubmit = (data: FormFields) => {
        execute(() => sendCodeMutation(data), {
            successMessage: t("auth:auth.resetCodeSent"),
            onSuccess: () => {
                reset();
                setAuthStep(AuthSteps.EmailResetVerify);
            },
        });
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-2 text-left">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl text-brand-500-300 font-bold capitalize">
                        {t("auth:auth.forgetPassword")}
                    </h1>
                </div>

                <p className="text-xl text-blue-light-500 capitalize max-w-md">
                    {t("auth:auth.pleaseEnterEmailForOtp")}
                </p>
            </div>

            {/* Form */}
            <Form
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                errors={formErrors}
            >
                <Form.Input
                    name="email"
                    type={{
                        type: "email",
                        placeholder: t("auth:auth.email"),
                    }}
                    label={{ text: t("auth:auth.email") }}
                />
                <Form.Button
                    config={{
                        text: t("auth:auth.confirm"),
                        loading: isSendCodePending,
                        disabled:
                            !email ||
                            email?.length < 6 ||
                            !isDirty ||
                            isSendCodePending,
                    }}
                />
            </Form>
        </>
    );
}

export default ResetEmailForm;
