import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageWrapper,Form } from "@/design-system";
import { useTrainingCenter, useUpdateTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

const schema = z.object({
    name: z.string().min(1),
    governorate_id: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function TrainingCentersEditPage() {
    const { t } = useTranslation("trainingCenters");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useTrainingCenter(id);
    const updateMutation = useUpdateTrainingCenter();
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
            governorate_id: "",
        },
    });

    useEffect(() => {
        if (!data) return;
        reset({
            name: data.name,
            governorate_id: String(data.governorateId ?? ""),
        });
    }, [data, reset]);

    const onSubmit = async (form: FormData) => {
        await execute(
            () => updateMutation.mutateAsync({ id: id!, data: form }),
            {
                successMessage: t(
                    "messages.updateSuccess",
                    "Training center updated successfully"
                ),
                setError,
                onSuccess: () => navigate(trainingCentersPaths.view(id!)),
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
                            name="governorate_id"
                            type={{ type: "text" }}
                            label={{
                                text: t(
                                    "fields.governorateId",
                                    "Governorate ID"
                                ),
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
                                onClick={() =>
                                    navigate(trainingCentersPaths.list)
                                }
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
