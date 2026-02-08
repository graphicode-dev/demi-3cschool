import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageWrapper, Form } from "@/design-system";
import { useCreateTeacher } from "../api";
import { teachersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function TeachersCreatePage() {
    const { t } = useTranslation("teachers");
    const navigate = useNavigate();

    const createMutation = useCreateTeacher();
    const { execute } = useMutationHandler();

    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        await execute(
            () =>
                createMutation.mutateAsync({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role_id: 3,
                }),
            {
                successMessage: t(
                    "messages.createSuccess",
                    "Teacher created successfully"
                ),
                setError,
                onSuccess: (created) =>
                    navigate(teachersPaths.view(created.id)),
            }
        );
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.create", "Create"),
                backButton: true,
            }}
        >
            <Form
                control={control}
                errors={errors}
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="space-y-6">
                    <Form.Input
                        name="name"
                        type={{ type: "text" }}
                        label={{
                            text: t("fields.name", "Name"),
                            required: true,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="email"
                        type={{ type: "email" }}
                        label={{
                            text: t("fields.email", "Email"),
                            required: true,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="password"
                        type={{ type: "password" }}
                        label={{
                            text: t("fields.password", "Password"),
                            required: true,
                        }}
                        style={{ size: "md" }}
                    />

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
                        >
                            {t("actions.save", "Save")}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(teachersPaths.list)}
                            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            {t("actions.cancel", "Cancel")}
                        </button>
                    </div>
                </div>
            </Form>
        </PageWrapper>
    );
}
