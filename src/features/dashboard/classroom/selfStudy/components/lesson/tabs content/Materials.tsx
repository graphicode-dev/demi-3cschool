import { LoadingState } from "@/design-system";
import { Download, FileText, Image } from "lucide-react";
import { TFunction } from "i18next";
import { LessonMaterial } from "@/features/dashboard/admin/learning/pages/lessons/types";

export const MaterialsTab = ({
    materials,
    isLoadingMaterials,
    t,
}: {
    materials: LessonMaterial[];
    isLoadingMaterials: boolean;
    t: TFunction<"selfStudy", undefined>;
}) => {
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
            {materials.map((material) => (
                <div
                    key={material.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="size-12 rounded-xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center">
                            {material.file?.mimeType?.includes("pdf") ? (
                                <FileText className="size-6 text-brand-500" />
                            ) : (
                                <Image className="size-6 text-brand-500" />
                            )}
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

                    {/* Download Button */}
                    <a
                        href={material.file?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-brand-500 transition-colors"
                    >
                        <Download className="size-5" />
                    </a>
                </div>
            ))}
        </div>
    );
};
