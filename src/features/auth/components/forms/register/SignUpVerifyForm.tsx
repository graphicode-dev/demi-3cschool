import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSteps, CommonFormProps } from "@/auth/auth.types";
import { Form } from "@/design-system/components/form";
import { authStore } from "@/auth/auth.store";
import { useMutationHandler } from "@/shared/api";

type FormFields = {
    otp: string;
};

const signUpVerifySchema = z.object({
    otp: z.string().min(6),
});

const SignUpVerifyForm = <_T,>({ mutationFn }: CommonFormProps<any>) => {
    const { t } = useTranslation();
    const { signupEmail, setAuthStep } = authStore();
    const { execute } = useMutationHandler();

    const { mutateAsync: verifyMutation, isPending: isVerifyPending } =
        mutationFn();

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors: formErrors, isDirty },
    } = useForm<FormFields>({
        resolver: zodResolver(signUpVerifySchema),
        mode: "onSubmit",
    });

    const otp = watch("otp");

    const onSubmit = (data: FormFields) => {
        execute(
            () =>
                verifyMutation({
                    email: signupEmail || "",
                    code: data.otp,
                }),
            {
                successMessage: t("auth:auth.verificationSuccessful"),
                onSuccess: () => {
                    reset();
                    setAuthStep(AuthSteps.SignUpComplete);
                },
            }
        );
    };

    return (
        <>
            {/* Header */}
            <div className="flex flex-col items-start gap-2 text-left">
                <div className="flex items-center gap-2">
                    <h1 className="text-3xl text-brand-500-300 font-bold capitalize">
                        {t("auth:auth.emailVerification")}
                    </h1>
                </div>

                <p className="text-xl text-blue-light-500 capitalize max-w-md">
                    {t("auth:auth.otpSentTo")}{" "}
                    <span className="text-brand-500-300 font-bold">
                        {signupEmail}
                    </span>{" "}
                    {t("auth:auth.pleaseEnterToVerify")}
                </p>
            </div>

            {/* Form */}
            <Form
                control={control}
                onSubmit={handleSubmit(onSubmit)}
                errors={formErrors}
            >
                <Form.Input name="otp" type={{ type: "otp" }} />
                <Form.Button
                    config={{
                        text: t("auth:auth.confirm"),
                        loading: isVerifyPending,
                        disabled:
                            !otp ||
                            otp?.length < 6 ||
                            !isDirty ||
                            isVerifyPending,
                    }}
                />
            </Form>
        </>
    );
};

export default SignUpVerifyForm;
