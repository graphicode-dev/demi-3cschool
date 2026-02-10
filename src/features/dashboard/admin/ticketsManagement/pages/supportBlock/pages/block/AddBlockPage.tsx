/**
 * AddBlockPage Component
 *
 * Page for creating a new support block.
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PageWrapper, useToast } from "@/design-system";
import { supportBlock } from "../../navigation/paths";
import { useCreateSupportBlock } from "../../api";

export function AddBlockPage() {
    const { t } = useTranslation("ticketsManagement");
    const navigate = useNavigate();
    const { addToast } = useToast();

    const createBlockMutation = useCreateSupportBlock();

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        isActive: true,
    });

    const handleCancel = () => {
        navigate(supportBlock.root());
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await createBlockMutation.mutateAsync({
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                is_active: formData.isActive ? 1 : 0,
            });
            addToast({
                type: "success",
                title: t(
                    "supportBlock.addBlock.success",
                    "Block created successfully"
                ),
            });
            navigate(supportBlock.root());
        } catch (err) {
            addToast({
                type: "error",
                title: t(
                    "supportBlock.addBlock.error",
                    "Failed to create block"
                ),
            });
        }
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleNameChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value),
        }));
    };

    const isFormValid = formData.name && formData.slug;

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "supportBlock.addBlock.pageTitle",
                    "Add Support Block"
                ),
                subtitle: t(
                    "supportBlock.addBlock.pageSubtitle",
                    "Create a new support block"
                ),
                backHref: supportBlock.root(),
                backButton: true,
            }}
        >
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("supportBlock.form.name", "Name")} *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                        placeholder={t(
                            "supportBlock.form.namePlaceholder",
                            "Enter block name"
                        )}
                    />
                </div>

                {/* Slug */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("supportBlock.form.slug", "Slug")} *
                    </label>
                    <input
                        type="text"
                        value={formData.slug}
                        readOnly
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        placeholder={t(
                            "supportBlock.form.slugPlaceholder",
                            "block-slug"
                        )}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {t(
                            "supportBlock.form.slugHint",
                            "Auto-generated from name"
                        )}
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t("supportBlock.form.description", "Description")}
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                        placeholder={t(
                            "supportBlock.form.descriptionPlaceholder",
                            "Enter block description"
                        )}
                    />
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                isActive: e.target.checked,
                            }))
                        }
                        className="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                    />
                    <label
                        htmlFor="isActive"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {t("supportBlock.form.isActive", "Active")}
                    </label>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={!isFormValid || createBlockMutation.isPending}
                        className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createBlockMutation.isPending
                            ? t("common.saving", "Saving...")
                            : t("supportBlock.form.create", "Create Block")}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2.5 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                </div>
            </form>
        </PageWrapper>
    );
}

export default AddBlockPage;
