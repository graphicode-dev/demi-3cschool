/**
 * CreateFolder Page
 *
 * Page for creating a new resource folder.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useCreateFolder } from "../api";
import { MOCK_GRADES, MOCK_TERMS } from "../mocks";

export function CreateFolder() {
    const { t } = useTranslation("adminResources");
    const navigate = useNavigate();
    const createFolder = useCreateFolder();

    const [formData, setFormData] = useState({
        name: "",
        gradeId: "",
        termId: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.gradeId || !formData.termId) {
            return;
        }

        await createFolder.mutateAsync({
            name: formData.name,
            gradeId: formData.gradeId,
            termId: formData.termId,
            description: formData.description || undefined,
        });

        navigate("/admin/resources");
    };

    const handleCancel = () => {
        navigate("/admin/resources");
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("folder.create"),
            }}
        >
            <form onSubmit={handleSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                        {t("folder.information")}
                    </h2>

                    <div className="space-y-6">
                        {/* Folder Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("folder.name")}{" "}
                                <span className="text-error-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder={t("folder.namePlaceholder")}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>

                        {/* Grade and Term */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("folder.selectGrade")}{" "}
                                    <span className="text-error-500">*</span>
                                </label>
                                <select
                                    value={formData.gradeId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            gradeId: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                >
                                    <option value="">
                                        {t("folder.selectGrade")}
                                    </option>
                                    {MOCK_GRADES.map((grade) => (
                                        <option key={grade.id} value={grade.id}>
                                            {grade.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t("folder.selectTerm")}{" "}
                                    <span className="text-error-500">*</span>
                                </label>
                                <select
                                    value={formData.termId}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            termId: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    required
                                >
                                    <option value="">
                                        {t("folder.selectTerm")}
                                    </option>
                                    {MOCK_TERMS.map((term) => (
                                        <option key={term.id} value={term.id}>
                                            {term.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t("folder.description")}
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                placeholder={t("folder.descriptionPlaceholder")}
                                rows={4}
                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={createFolder.isPending}
                        className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="size-4" />
                        {t("folder.saveFolder")}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                    >
                        {t("folder.cancel")}
                    </button>
                </div>
            </form>
        </PageWrapper>
    );
}

export default CreateFolder;
