import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/design-system/components/PageWrapper";
import { Form } from "@/design-system/components/form";
import { useTeacher, useUpdateTeacher } from "../api";
import { teachersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function TeachersEditPage() {
    const { t } = useTranslation("teachers");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useTeacher(id);
    const updateMutation = useUpdateTeacher();
    const { execute } = useMutationHandler();

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setError,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
        },
    });

    useEffect(() => {
        if (!data) return;
        reset({
            name: data.name,
            email: data.email,
        });
    }, [data, reset]);

    const onSubmit = async (form: FormData) => {
        await execute(
            () =>
                updateMutation.mutateAsync({
                    id: id!,
                    data: {
                        name: form.name,
                        email: form.email,
                        role_id: 3,
                    },
                }),
            {
                successMessage: t(
                    "messages.updateSuccess",
                    "Teacher updated successfully"
                ),
                setError,
                onSuccess: () => navigate(teachersPaths.view(id!)),
            }
        );
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.edit", "Edit"),
                backButton: true,
            }}
        >
            {isLoading ? (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {t("loading", "Loading...")}
                </div>
            ) : (
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

                        <div className="flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
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
            )}
        </PageWrapper>
    );
}
