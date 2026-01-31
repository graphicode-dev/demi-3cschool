/**
 * Level Price Edit Page
 *
 * Page for editing an existing level price.
 * Uses shared LevelPriceFormTabs component with tabs for form sections.
 */

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingState, ErrorState } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useLevelPrice, useUpdateLevelPrice } from "../api";
import type { LevelPriceUpdatePayload, LevelPriceGroupType } from "../types";
import { salesPaths } from "../../../navigation/paths";
import {
    LevelPriceFormTabs,
    type LevelPriceFormValues,
} from "../components/LevelPriceFormTabs";
import { useMutationHandler } from "@/shared/api";

// Form validation schema
const levelPriceFormSchema = z
    .object({
        level_id: z.number().min(1, "Level is required"),
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        price: z.number().min(0, "Price must be positive"),
        original_price: z.number().min(0, "Original price must be positive"),
        groupType: z.enum(["regular", "special", "premium"]).optional(),
        max_installments: z.number().min(1, "At least 1 installment required"),
        valid_from: z.string().optional(),
        valid_until: z.string().optional(),
        is_default: z.number().min(0).max(1),
        is_active: z.number().min(0).max(1),
    })
    .refine(
        (data) => {
            if (data.valid_from && data.valid_until) {
                return new Date(data.valid_until) > new Date(data.valid_from);
            }
            return true;
        },
        {
            message: "Valid until date must be after valid from date",
            path: ["valid_until"],
        }
    )
    .refine((data) => data.price <= data.original_price, {
        message: "Price cannot be greater than original price",
        path: ["price"],
    });

export default function PriceListEdit() {
    const { t } = useTranslation("sales_subscription");
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Get existing level price data
    const {
        data: levelPrice,
        isLoading: isLoadingData,
        error: dataError,
    } = useLevelPrice(id);

    // Form setup
    const {
        control,
        handleSubmit,
        formState,
        watch,
        reset,
        setValue,
        setError,
    } = useForm<LevelPriceFormValues>({
        resolver: zodResolver(levelPriceFormSchema),
        defaultValues: {
            level_id: 0,
            name: "",
            description: "",
            price: 0,
            original_price: 0,
            groupType: "regular",
            max_installments: 1,
            valid_from: "",
            valid_until: "",
            is_default: 0,
            is_active: 1,
        },
        mode: "onChange",
    });

    // Mutation
    const { mutateAsync } = useUpdateLevelPrice();
    const { execute } = useMutationHandler();

    // Populate form with existing data when it loads
    useEffect(() => {
        if (levelPrice) {
            reset({
                level_id: levelPrice.level?.id || 0,
                name: levelPrice.name,
                description: levelPrice.description || "",
                price: parseFloat(levelPrice.price),
                original_price: parseFloat(levelPrice.originalPrice),
                groupType: levelPrice.groupType,
                max_installments: levelPrice.maxInstallments,
                valid_from: levelPrice.validFrom || "",
                valid_until: levelPrice.validUntil || "",
                is_default: levelPrice.isDefault ? 1 : 0,
                is_active: levelPrice.isActive ? 1 : 0,
            });
        }
    }, [levelPrice, reset]);

    // Handle form submission
    const onSubmit = handleSubmit((values: LevelPriceFormValues) => {
        const payload: LevelPriceUpdatePayload = {
            level_id: values.level_id,
            name: values.name,
            description: values.description,
            price: values.price,
            original_price: values.original_price,
            groupType: values.groupType as LevelPriceGroupType,
            max_installments: values.max_installments,
            valid_from: values.valid_from,
            valid_until: values.valid_until,
            is_default: values.is_default,
            is_active: values.is_active,
        };

        execute(() => mutateAsync({ id: id!, payload }), {
            successMessage: t(
                "priceLists.messages.updateSuccess",
                "Level price updated successfully"
            ),
            setError,
            fieldMapping: {
                group_type: "groupType",
            },
            onSuccess: () => navigate(salesPaths.priceLists.list()),
        });
    });

    // Handle cancel
    const handleCancel = () => {
        navigate(salesPaths.priceLists.list());
    };

    const isLoading = formState.isSubmitting || isLoadingData;

    // Loading state
    if (isLoadingData) {
        return <LoadingState />;
    }

    // Error state
    if (dataError) {
        return (
            <ErrorState
                message={dataError?.message || "Failed to load level price"}
                onRetry={() => window.location.reload()}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("priceLists.edit.title", "Edit Level Price"),
                subtitle: t(
                    "priceLists.edit.subtitle",
                    "Update the level price information and adjust its pricing details."
                ),
                backButton: true,
            }}
        >
            <LevelPriceFormTabs
                control={control}
                errors={formState.errors}
                watch={watch}
                setValue={setValue}
                onSubmit={onSubmit}
                isLoading={isLoading}
                onCancel={handleCancel}
                submitLabel={t("priceLists.actions.saveChange", "Save Change")}
            />
        </PageWrapper>
    );
}
