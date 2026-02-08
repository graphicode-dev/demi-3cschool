import { useTranslation } from "react-i18next";
import { Form } from "@/design-system";
import { AuthSteps, CommonLoginFormProps } from "@/auth/auth.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    email: string;
};

const LoginMagicLinkForm = <_T,>({
    mutationFn,
    isPopup,
}: CommonLoginFormProps<any>) => {
    const { t } = useTranslation();

    const loginSchema = z.object({
        email: z
            .string()
            .email(t("auth:auth.validation.pleaseEnterValidEmail")),
    });
    const { setAuthStep } = authStore();
    const { mutateAsync: loginMutation, isPending: isLoginPending } =
        mutationFn();
    const { execute } = useMutationHandler();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors: formErrors, isDirty },
    } = useForm<FormFields>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
    });

    const onSubmit = (data: FormFields) => {
        execute(() => loginMutation(data), {
            successMessage: t("auth:auth.magicLinkSent"),
            onSuccess: () => {
                reset();

                // If it's a popup, notify the parent window and close
                if (isPopup && window.opener) {
                    // Send message to parent window
                    window.opener.postMessage(
                        { type: "AUTH_SUCCESS", authenticated: true },
                        window.location.origin
                    );
                    // Close the popup window
                    window.close();
                }

                // This will now work properly
                setTimeout(() => {
                    setAuthStep(AuthSteps.Login);
                }, 5000);
            },
        });
    };

    const handleBackToLogin = () => {
        setAuthStep(AuthSteps.Login);
    };

    return (
        <Form
            control={control}
            onSubmit={handleSubmit(onSubmit)}
            errors={formErrors}
            layout={{
                removeBorder: true,
                noPadding: true,
            }}
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
                    text: t("auth:auth.sendEmail"),
                    loading: isLoginPending,
                    disabled: !isDirty || isLoginPending,
                    className: "w-full",
                }}
                action={{
                    type: "submit",
                }}
            />

            <Form.Button
                config={{
                    text: t("auth:auth.backToNormalLogin"),
                    loading: isLoginPending,
                    disabled: isLoginPending,
                    variant: "ghost",
                    fullWidth: true,
                }}
                action={{
                    type: "button",
                    onClick: handleBackToLogin,
                }}
            />
        </Form>
    );
};

export default LoginMagicLinkForm;
