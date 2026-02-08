import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageWrapper, Form } from "@/design-system";
import { useStudent, useUpdateStudent } from "../api";
import { studentsPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function StudentsEditPage() {
    const { t } = useTranslation("students");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useStudent(id);
    const updateMutation = useUpdateStudent();
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
                    },
                }),
            {
                successMessage: t(
                    "messages.updateSuccess",
                    "Student updated successfully"
                ),
                setError,
                onSuccess: () => navigate(studentsPaths.view(id!)),
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
                                onClick={() => navigate(studentsPaths.list)}
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
