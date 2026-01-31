/**
 * Coupon Create Page
 *
 * Form page for creating a new coupon.
 * Uses react-hook-form with zod validation and design-system Form components.
 */

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ticket, RefreshCw } from "lucide-react";
import { Form } from "@/design-system/components/form";
import { salesPaths } from "../../../navigation/paths";
import { useCreateCoupon, useGenerateCouponCode } from "../api";
import { LevelMultiSelect } from "../../../components/LevelMultiSelect";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

const couponFormSchema = z.object({
    code: z
        .string()
        .min(1, "Coupon code is required")
        .max(50, "Coupon code is too long")
        .regex(
            /^[A-Z0-9]+$/,
            "Code must be uppercase letters and numbers only"
        ),
    name: z.string().min(1, "Coupon name is required"),
    description: z.string().optional(),
    type: z.enum(["percentage", "fixed"]),
    value: z.number().min(0.01, "Value must be greater than 0"),
    levelIds: z.array(z.string()).min(1, "At least one level is required"),
    minPurchaseAmount: z.number().min(0).optional(),
    maxDiscountAmount: z.number().min(0).optional(),
    usageLimit: z.number().min(1).optional(),
    usageLimitPerUser: z.number().min(1).optional(),
    validFrom: z.string().optional(),
    validUntil: z.string().optional(),
    isFirstPurchaseOnly: z.boolean().optional(),
});

type CouponFormData = z.infer<typeof couponFormSchema>;

export default function CouponCreate() {
    const { t } = useTranslation("sales_subscription");
    const navigate = useNavigate();
    const { mutateAsync, isPending } = useCreateCoupon();
    const { execute } = useMutationHandler();
    const { refetch: generateCode, isFetching: isGeneratingCode } =
        useGenerateCouponCode();

    const { control, handleSubmit, formState, setValue, watch, setError } =
        useForm<CouponFormData>({
            resolver: zodResolver(couponFormSchema),
            defaultValues: {
                code: "",
                name: "",
                description: "",
                type: "percentage",
                value: 0,
                levelIds: [],
                minPurchaseAmount: undefined,
                maxDiscountAmount: undefined,
                usageLimit: undefined,
                usageLimitPerUser: undefined,
                validFrom: "",
                validUntil: "",
                isFirstPurchaseOnly: false,
            },
        });

    const selectedLevelIds = watch("levelIds");

    const onSubmit = (data: CouponFormData) => {
        execute(
            () =>
                mutateAsync({
                    code: data.code,
                    name: data.name,
                    description: data.description || undefined,
                    type: data.type,
                    value: data.value,
                    level_ids: data.levelIds.map(Number),
                    min_purchase_amount: data.minPurchaseAmount,
                    max_discount_amount: data.maxDiscountAmount,
                    usage_limit: data.usageLimit,
                    usage_limit_per_user: data.usageLimitPerUser,
                    valid_from: data.validFrom || undefined,
                    valid_until: data.validUntil || undefined,
                    is_first_purchase_only: data.isFirstPurchaseOnly,
                    status: "active",
                }),
            {
                successMessage: t(
                    "coupons.messages.createSuccess",
                    "Coupon created successfully"
                ),
                setError,
                onSuccess: () => navigate(salesPaths.coupons.list()),
            }
        );
    };

    const handleCancel = () => {
        navigate(salesPaths.coupons.list());
    };

    const handleLevelChange = (levelIds: string[]) => {
        setValue("levelIds", levelIds, { shouldValidate: true });
    };

    const handleGenerateCode = async () => {
        const result = await generateCode();
        if (result.data?.code) {
            setValue("code", result.data.code, { shouldValidate: true });
        }
    };

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("coupons.actions.createNew", "Create New Coupon"),
                subtitle: t(
                    "coupons.create.subtitle",
                    "Fill in the details below to create a new coupon and offer exclusive discounts to your users."
                ),
                backButton: true,
            }}
        >
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Ticket className="w-5 h-5 text-brand-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {t("coupons.form.title", "New Coupon")}
                    </h2>
                </div>

                <Form
                    control={control}
                    errors={formState.errors}
                    onSubmit={handleSubmit(onSubmit)}
                    layout={{
                        columns: { base: 1, md: 2 },
                        gap: { base: "4", md: "6" },
                        removeBorder: true,
                        noPadding: true,
                    }}
                >
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            {t("coupons.form.fields.code.label", "Coupon Code")}
                            <span className="text-red-500 ms-1">*</span>
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Form.Input
                                    name="code"
                                    type={{
                                        type: "text",
                                        placeholder: t(
                                            "coupons.form.fields.code.placeholder",
                                            "Click Generate to create a code"
                                        ),
                                        readOnly: true,
                                    }}
                                    validation={{
                                        error: formState.errors.code?.message,
                                    }}
                                    style={{ size: "md" }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleGenerateCode}
                                disabled={isGeneratingCode}
                                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <RefreshCw
                                    className={`w-4 h-4 ${
                                        isGeneratingCode ? "animate-spin" : ""
                                    }`}
                                />
                                {t(
                                    "coupons.form.fields.code.generate",
                                    "Generate"
                                )}
                            </button>
                        </div>
                    </div>

                    <Form.Input
                        name="name"
                        type={{
                            type: "text",
                            placeholder: t(
                                "coupons.form.fields.name.placeholder",
                                "e.g. Summer Sale Discount"
                            ),
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.name.label",
                                "Coupon Name"
                            ),
                            required: true,
                        }}
                        validation={{
                            error: formState.errors.name?.message,
                        }}
                        style={{ size: "md" }}
                        layout={{ className: "col-span-full" }}
                    />

                    <Form.Input
                        name="description"
                        type={{
                            type: "textarea",
                            placeholder: t(
                                "coupons.form.fields.description.placeholder",
                                "Enter coupon description"
                            ),
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.description.label",
                                "Description"
                            ),
                        }}
                        validation={{
                            error: formState.errors.description?.message,
                        }}
                        style={{ size: "md" }}
                        layout={{ className: "col-span-full" }}
                    />

                    <Form.Field
                        name="levelIds"
                        control={control}
                        label={{
                            text: t(
                                "coupons.form.fields.levels.label",
                                "Select Level"
                            ),
                            required: true,
                        }}
                        validation={{
                            error: formState.errors.levelIds?.message,
                        }}
                        layout={{ className: "col-span-full" }}
                    >
                        {() => (
                            <LevelMultiSelect
                                selectedIds={selectedLevelIds}
                                onChange={handleLevelChange}
                                placeholder={t(
                                    "coupons.form.fields.levels.placeholder",
                                    "You can choose one level, multiple levels, or select all."
                                )}
                            />
                        )}
                    </Form.Field>

                    <Form.Input
                        name="type"
                        label={{
                            text: t(
                                "coupons.form.fields.type.label",
                                "Discount Type"
                            ),
                            required: true,
                        }}
                        type={{
                            type: "dropdown",
                            options: [
                                {
                                    value: "percentage",
                                    label: t(
                                        "coupons.form.fields.type.percentage",
                                        "Percentage"
                                    ),
                                },
                                {
                                    value: "fixed",
                                    label: t(
                                        "coupons.form.fields.type.fixed",
                                        "Fixed Amount"
                                    ),
                                },
                            ],
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="value"
                        type={{
                            type: "number",
                            placeholder: t(
                                "coupons.form.fields.value.placeholder",
                                "10"
                            ),
                            min: 0,
                            step: 0.01,
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.value.label",
                                "Discount Value"
                            ),
                            required: true,
                        }}
                        validation={{
                            error: formState.errors.value?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="minPurchaseAmount"
                        type={{
                            type: "number",
                            placeholder: t(
                                "coupons.form.fields.minPurchaseAmount.placeholder",
                                "e.g. 100"
                            ),
                            min: 0,
                            step: 0.01,
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.minPurchaseAmount.label",
                                "Min Purchase Amount"
                            ),
                        }}
                        validation={{
                            error: formState.errors.minPurchaseAmount?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="maxDiscountAmount"
                        type={{
                            type: "number",
                            placeholder: t(
                                "coupons.form.fields.maxDiscountAmount.placeholder",
                                "e.g. 200"
                            ),
                            min: 0,
                            step: 0.01,
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.maxDiscountAmount.label",
                                "Max Discount Amount"
                            ),
                        }}
                        validation={{
                            error: formState.errors.maxDiscountAmount?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="usageLimit"
                        type={{
                            type: "number",
                            placeholder: t(
                                "coupons.form.fields.usageLimit.placeholder",
                                "e.g. 100"
                            ),
                            min: 1,
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.usageLimit.label",
                                "Usage Limit"
                            ),
                        }}
                        validation={{
                            error: formState.errors.usageLimit?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="usageLimitPerUser"
                        type={{
                            type: "number",
                            placeholder: t(
                                "coupons.form.fields.usageLimitPerUser.placeholder",
                                "e.g. 1"
                            ),
                            min: 1,
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.usageLimitPerUser.label",
                                "Usage Limit Per User"
                            ),
                        }}
                        validation={{
                            error: formState.errors.usageLimitPerUser?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="validFrom"
                        type={{
                            type: "date",
                            placeholder: t(
                                "coupons.form.fields.validFrom.placeholder",
                                "mm/dd/yy"
                            ),
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.validFrom.label",
                                "Valid From"
                            ),
                        }}
                        validation={{
                            error: formState.errors.validFrom?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.Input
                        name="validUntil"
                        type={{
                            type: "date",
                            placeholder: t(
                                "coupons.form.fields.validUntil.placeholder",
                                "mm/dd/yy"
                            ),
                        }}
                        label={{
                            text: t(
                                "coupons.form.fields.validUntil.label",
                                "Valid Until"
                            ),
                        }}
                        validation={{
                            error: formState.errors.validUntil?.message,
                        }}
                        style={{ size: "md" }}
                    />

                    <Form.ButtonGroup
                        layout="horizontal"
                        className="col-span-full flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 mt-2"
                    >
                        <Form.Button
                            config={{
                                text: t("common.cancel", "Cancel"),
                                variant: "outline",
                                size: "md",
                            }}
                            action={{
                                type: "button",
                                onClick: handleCancel,
                            }}
                        />
                        <Form.Button
                            config={{
                                text: t(
                                    "coupons.form.submit",
                                    "+ Create Coupon"
                                ),
                                variant: "primary",
                                size: "md",
                                loading: isPending,
                                disabled: isPending,
                            }}
                            action={{
                                type: "submit",
                            }}
                        />
                    </Form.ButtonGroup>
                </Form>
        </PageWrapper>
    );
}
