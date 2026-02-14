import { LoadingState } from "@/design-system";
import { FileText, Image } from "lucide-react";
import { TFunction } from "i18next";
import { LessonMaterial } from "@/features/dashboard/admin/learning/pages/lessons/types";
import { FilePreview } from "@/features/dashboard/shared/components/FilePreview";
import { useState } from "react";

export const MaterialsTab = ({
    materials,
    isLoadingMaterials,
    t,
}: {
    materials: LessonMaterial[];
    isLoadingMaterials: boolean;
    t: TFunction<"selfStudy", undefined>;
}) => {
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    if (isLoadingMaterials) return <LoadingState />;

    if (materials.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                    {t("lesson.noMaterials")}
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {materials.map((material) => {
                const existingFile = material.file?.url;

                return (
                    <div
                        key={material.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-center gap-4">
                            {/* Icon */}
                            <div className="size-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                                <FileText className="size-6 text-brand-500" />
                            </div>

                            {/* Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                    {material.title}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {material.file?.humanReadableSize}
                                </p>
                            </div>
                        </div>

                        {/* View Button */}
                        <FilePreview
                            t={t}
                            file={existingFile}
                            selectedFile={null}
                            showPreviewModal={showPreviewModal}
                            setShowPreviewModal={setShowPreviewModal}
                            showOnlyIcon
                            iconSize="w-5 h-5"
                        />
                    </div>
                );
            })}
        </div>
    );
};
