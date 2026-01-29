/**
 * Level Price Form Tabs Component
 *
 * Shared tab content component for Create and Edit level price pages.
 * Uses the design-system Tabs component with form sections as tabs.
 */

import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, DollarSign, Calendar, Settings } from "lucide-react";
import { Tabs } from "@/design-system";
import { Form } from "@/design-system/components/form";
import { LevelMultiSelect } from "@/features/sales_subscription/components";
import type {
    Control,
    FieldErrors,
    UseFormWatch,
    UseFormSetValue,
} from "react-hook-form";

// Tab types
export type LevelPriceTabType = "basic" | "pricing" | "validity" | "settings";

// Form values type
export interface LevelPriceFormValues {
    level_id: number;
    name: string;
    description?: string;
    price: number;
    original_price: number;
    groupType?: "regular" | "special" | "premium";
    max_installments: number;
    valid_from?: string;
    valid_until?: string;
    is_default: number;
    is_active: number;
}

// Tab configuration
const tabs: {
    key: LevelPriceTabType;
    labelKey: string;
    fallback: string;
    icon: React.ReactNode;
}[] = [
    {
        key: "basic",
        labelKey: "priceLists.tabs.basic",
        fallback: "Basic Information",
        icon: <Info className="w-4 h-4" />,
    },
    {
        key: "pricing",
        labelKey: "priceLists.tabs.pricing",
        fallback: "Pricing Details",
        icon: <DollarSign className="w-4 h-4" />,
    },
    {
        key: "validity",
        labelKey: "priceLists.tabs.validity",
        fallback: "Validity Period",
        icon: <Calendar className="w-4 h-4" />,
    },
    {
        key: "settings",
        labelKey: "priceLists.tabs.settings",
        fallback: "Settings",
        icon: <Settings className="w-4 h-4" />,
    },
];

interface LevelPriceFormTabsProps {
    control: Control<LevelPriceFormValues>;
    errors: FieldErrors<LevelPriceFormValues>;
    watch: UseFormWatch<LevelPriceFormValues>;
    setValue: UseFormSetValue<LevelPriceFormValues>;
    onSubmit: () => void;
    isLoading: boolean;
    onCancel: () => void;
    submitLabel: string;
    /** Enable wizard mode with locked tabs and next/prev navigation */
    wizardMode?: boolean;
}

// Tab order for wizard mode navigation
const TAB_ORDER: LevelPriceTabType[] = [
    "basic",
    "pricing",
    "validity",
    "settings",
];

// Required fields per tab for validation
const REQUIRED_FIELDS_PER_TAB: Record<
    LevelPriceTabType,
    (keyof LevelPriceFormValues)[]
> = {
    basic: ["level_id", "name"],
    pricing: ["price", "original_price", "max_installments"],
    validity: [],
    settings: [],
};

function TabLoader() {
    return (
        <div className="flex items-center justify-center h-32">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

export function LevelPriceFormTabs({
    control,
    errors,
    watch,
    setValue,
    onSubmit,
    isLoading,
    onCancel,
    submitLabel,
    wizardMode = false,
}: LevelPriceFormTabsProps) {
    const { t } = useTranslation("sales_subscription");
    const [activeTab, setActiveTab] = useState<LevelPriceTabType>("basic");

    const selectedLevelId = watch("level_id");

    // Handle level selection
    const handleLevelChange = (levelIds: string[]) => {
        const levelId = levelIds[0];
        setValue("level_id", levelId ? parseInt(levelId, 10) : 0);
    };

    // Validation function for wizard mode
    const canProceed = (currentTab: string): boolean => {
        const tab = currentTab as LevelPriceTabType;
        const requiredFields = REQUIRED_FIELDS_PER_TAB[tab];

        // Check if all required fields have values
        for (const field of requiredFields) {
            const value = watch(field);
            if (
                value === undefined ||
                value === null ||
                value === "" ||
                value === 0
            ) {
                return false;
            }
        }

        // Check if there are any errors for fields in this tab
        for (const field of requiredFields) {
            if (errors[field]) {
                return false;
            }
        }

        return true;
    };

    // Group type options
    const groupTypeOptions = [
        {
            value: "regular",
            label: t("priceLists.groupTypes.regular", "Regular"),
        },
        {
            value: "special",
            label: t("priceLists.groupTypes.special", "Special"),
        },
        {
            value: "premium",
            label: t("priceLists.groupTypes.premium", "Premium"),
        },
    ];

    return (
        <div className="space-y-6">
            <Tabs
                value={activeTab}
                onChange={(value) => setActiveTab(value as LevelPriceTabType)}
                variant="underline"
                className="space-y-6"
                mode={wizardMode ? "wizard" : "default"}
                tabOrder={TAB_ORDER}
                canProceed={canProceed}
                onSubmit={onSubmit}
                isSubmitting={isLoading}
                wizardLabels={{
                    next: t("common.next", "Next"),
                    previous: t("common.previous", "Previous"),
                    submit: submitLabel,
                }}
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 pt-4 shadow-sm">
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tabs.Item
                                key={tab.key}
                                value={tab.key}
                                label={t(tab.labelKey, tab.fallback)}
                                icon={tab.icon}
                            />
                        ))}
                    </Tabs.List>
                </div>

                <Tabs.Content>
                    {/* Basic Information Tab */}
                    <Tabs.Panel value="basic">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "priceLists.form.basicInformation",
                                    "Basic Information"
                                )}
                            </h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "priceLists.form.selectLevel",
                                        "Select Level"
                                    )}{" "}
                                    *
                                </label>
                                <LevelMultiSelect
                                    selectedIds={
                                        selectedLevelId
                                            ? [String(selectedLevelId)]
                                            : []
                                    }
                                    onChange={handleLevelChange}
                                    mode="single"
                                    placeholder={t(
                                        "priceLists.form.chooseLevel",
                                        "Choose a learning level"
                                    )}
                                />
                                {errors.level_id && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.level_id.message}
                                    </p>
                                )}
                            </div>

                            <Form
                                control={control as any}
                                errors={errors}
                                onSubmit={onSubmit}
                                layout={{
                                    columns: { base: 1, md: 2 },
                                    gap: { base: "4", md: "6" },
                                    removeBorder: true,
                                    noPadding: true,
                                }}
                            >
                                <Form.Input
                                    name="name"
                                    type={{
                                        type: "text",
                                        placeholder: t(
                                            "priceLists.form.namePlaceholder",
                                            "e.g., Installment Plan for Level 2"
                                        ),
                                    }}
                                    label={{
                                        text: t("priceLists.form.name", "Name"),
                                        required: true,
                                    }}
                                    validation={{
                                        error: errors.name?.message,
                                    }}
                                    style={{ size: "md" }}
                                    layout={{ className: "col-span-full" }}
                                />

                                <Form.Input
                                    name="description"
                                    type={{
                                        type: "textarea",
                                        placeholder: t(
                                            "priceLists.form.descriptionPlaceholder",
                                            "Add a detailed description of this pricing plan.."
                                        ),
                                        rows: 3,
                                    }}
                                    label={{
                                        text: t(
                                            "priceLists.form.descriptionOptional",
                                            "Description (Optional)"
                                        ),
                                    }}
                                    validation={{
                                        error: errors.description?.message,
                                    }}
                                    style={{ size: "md" }}
                                    layout={{ className: "col-span-full" }}
                                />

                                <Form.Input
                                    name="groupType"
                                    type={{
                                        type: "dropdown",
                                        options: groupTypeOptions,
                                        placeholder: t(
                                            "priceLists.form.chooseGroupType",
                                            "Choose a group type"
                                        ),
                                    }}
                                    label={{
                                        text: t(
                                            "priceLists.form.groupType",
                                            "Group Type"
                                        ),
                                    }}
                                    validation={{
                                        error: errors.groupType?.message,
                                    }}
                                    style={{ size: "md" }}
                                    layout={{ className: "col-span-full" }}
                                />
                            </Form>
                        </div>
                    </Tabs.Panel>

                    {/* Pricing Details Tab */}
                    <Tabs.Panel value="pricing">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "priceLists.form.pricingDetails",
                                    "Pricing Details"
                                )}
                            </h2>
                        </div>

                        <Form
                            control={control as any}
                            errors={errors}
                            onSubmit={onSubmit}
                            layout={{
                                columns: { base: 1, md: 3 },
                                gap: { base: "4", md: "6" },
                                removeBorder: true,
                                noPadding: true,
                            }}
                        >
                            <Form.Input
                                name="price"
                                type={{
                                    type: "number",
                                    placeholder: "0.00",
                                    min: 0,
                                    step: 0.01,
                                }}
                                label={{
                                    text: t("priceLists.form.price", "Price"),
                                    required: true,
                                }}
                                validation={{
                                    error: errors.price?.message,
                                }}
                                style={{ size: "md" }}
                            />

                            <Form.Input
                                name="original_price"
                                type={{
                                    type: "number",
                                    placeholder: "0.00",
                                    min: 0,
                                    step: 0.01,
                                }}
                                label={{
                                    text: t(
                                        "priceLists.form.originalPrice",
                                        "Original Price"
                                    ),
                                    required: true,
                                }}
                                validation={{
                                    error: errors.original_price?.message,
                                }}
                                style={{ size: "md" }}
                            />

                            <Form.Input
                                name="max_installments"
                                type={{
                                    type: "number",
                                    placeholder: "1",
                                    min: 1,
                                }}
                                label={{
                                    text: t(
                                        "priceLists.form.maxInstallments",
                                        "Max Installments"
                                    ),
                                    required: true,
                                }}
                                validation={{
                                    error: errors.max_installments?.message,
                                }}
                                style={{ size: "md" }}
                            />
                        </Form>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                            <p className="text-xs text-gray-500">
                                {t(
                                    "priceLists.form.priceDescription",
                                    "Price students will pay"
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {t(
                                    "priceLists.form.originalPriceDescription",
                                    "Original price before discount"
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {t(
                                    "priceLists.form.maxInstallmentsDescription",
                                    "Number of payment installments"
                                )}
                            </p>
                        </div>
                    </Tabs.Panel>

                    {/* Validity Period Tab */}
                    <Tabs.Panel value="validity">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "priceLists.form.validityPeriod",
                                    "Validity Period"
                                )}
                            </h2>
                        </div>

                        <Form
                            control={control as any}
                            errors={errors}
                            onSubmit={onSubmit}
                            layout={{
                                columns: { base: 1, md: 2 },
                                gap: { base: "4", md: "6" },
                                removeBorder: true,
                                noPadding: true,
                            }}
                        >
                            <Form.Input
                                name="valid_from"
                                type={{
                                    type: "date",
                                    placeholder: "yyyy-mm-dd",
                                }}
                                label={{
                                    text: t(
                                        "priceLists.form.validFrom",
                                        "Valid From"
                                    ),
                                }}
                                validation={{
                                    error: errors.valid_from?.message,
                                }}
                                style={{ size: "md" }}
                            />

                            <Form.Input
                                name="valid_until"
                                type={{
                                    type: "date",
                                    placeholder: "yyyy-mm-dd",
                                }}
                                label={{
                                    text: t(
                                        "priceLists.form.validUntil",
                                        "Valid Until"
                                    ),
                                }}
                                validation={{
                                    error: errors.valid_until?.message,
                                }}
                                style={{ size: "md" }}
                            />
                        </Form>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <p className="text-xs text-gray-500">
                                {t(
                                    "priceLists.form.validFromDescription",
                                    "Start date for this pricing plan"
                                )}
                            </p>
                            <p className="text-xs text-gray-500">
                                {t(
                                    "priceLists.form.validUntilDescription",
                                    "End date for this pricing plan"
                                )}
                            </p>
                        </div>
                    </Tabs.Panel>

                    {/* Settings Tab */}
                    <Tabs.Panel value="settings">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                <Settings className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t("priceLists.form.settings", "Settings")}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {/* Set as Default Plan */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t(
                                            "priceLists.form.setAsDefault",
                                            "Set as Default Plan"
                                        )}
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t(
                                            "priceLists.form.defaultPlanDescription",
                                            "Make this the default pricing option for the selected level"
                                        )}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={watch("is_default") === 1}
                                        onChange={(e) =>
                                            setValue(
                                                "is_default",
                                                e.target.checked ? 1 : 0
                                            )
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div>
                                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                                        {t(
                                            "priceLists.form.activeStatus",
                                            "Active Status"
                                        )}
                                    </label>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t(
                                            "priceLists.form.activeStatusDescription",
                                            "Enable or disable this pricing plan"
                                        )}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={watch("is_active") === 1}
                                        onChange={(e) =>
                                            setValue(
                                                "is_active",
                                                e.target.checked ? 1 : 0
                                            )
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </Tabs.Panel>
                </Tabs.Content>
            </Tabs>

            {/* Action Buttons - only show in default mode, wizard mode has its own buttons */}
            {!wizardMode && (
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                    >
                        {t("common.cancel", "Cancel")}
                    </button>
                    <button
                        type="submit"
                        onClick={onSubmit}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 disabled:opacity-50"
                    >
                        {isLoading
                            ? t("common.loading", "Loading...")
                            : submitLabel}
                    </button>
                </div>
            )}
        </div>
    );
}

export default LevelPriceFormTabs;
