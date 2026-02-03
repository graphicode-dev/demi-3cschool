import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PageWrapper from "@/design-system/components/PageWrapper";
import { Form } from "@/design-system/components/form";
import { useCreateTrainingCenter } from "../api";
import { trainingCentersPaths } from "../navigation/paths";
import { useMutationHandler } from "@/shared/api";

const schema = z.object({
    name: z.string().min(1),
    governorate_id: z.string().min(1),
});

type FormData = z.infer<typeof schema>;

export default function TrainingCentersCreatePage() {
    const { t } = useTranslation("trainingCenters");
    const navigate = useNavigate();

    const createMutation = useCreateTrainingCenter();
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
            governorate_id: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        await execute(() => createMutation.mutateAsync(data), {
            successMessage: t(
                "messages.createSuccess",
                "Training center created successfully"
            ),
            setError,
            onSuccess: (created) => navigate(trainingCentersPaths.view(created.id)),
        });
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("actions.create", "Create"),
                backButton: true,
            }}
        >
            <Form control={control} errors={errors} onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                    <Form.Input
                        name="name"
                        type={{ type: "text" }}
                        label={{ text: t("fields.name", "Name"), required: true }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="governorate_id"
                        type={{ type: "text" }}
                        label={{
                            text: t("fields.governorateId", "Governorate ID"),
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
                            onClick={() => navigate(trainingCentersPaths.list)}
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
