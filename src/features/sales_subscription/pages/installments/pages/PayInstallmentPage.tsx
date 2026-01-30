/**
 * Pay Installment Page
 *
 * Form page for recording and confirming student installment payments.
 * Uses react-hook-form with zod validation.
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { paths } from "@/router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Check,
    CreditCard,
    History,
    ReceiptTextIcon,
    CheckCircle,
    XCircle,
    Eye,
    Clock,
    Banknote,
    Building,
    RefreshCw,
} from "lucide-react";
import { LoadingState, ErrorState, ConfirmDialog } from "@/design-system";
import { DropdownInput } from "@/design-system/components/form";
import {
    useInstallment,
    useSubmitPayment,
    useChangePaymentStatus,
    usePaymentHistory,
} from "../api";
import type { PaymentMethod, Installment, Payment } from "../types";
import PageWrapper from "@/design-system/components/PageWrapper";
import { useMutationHandler } from "@/shared/api";

type PaymentType = "full" | "partial";

// ============================================================================
// Form Schema
// ============================================================================

const paymentFormSchema = z.object({
    paymentType: z.enum(["full", "partial"]),
    paidAmount: z.number().min(0.01, "Amount must be greater than 0"),
    remainingAmount: z.number().optional(),
    paymentMethod: z.enum(["credit_card", "bank_transfer", "cash", "check"]),
    paymentDate: z.string().min(1, "Payment date is required"),
    notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentFormSchema>;

// ============================================================================
// Component
// ============================================================================

export default function PayInstallmentPage() {
    const { t } = useTranslation("salesSubscription");
    const navigate = useNavigate();
    const { paymentId: installmentId } = useParams<{ paymentId: string }>();
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [viewReasonDialogOpen, setViewReasonDialogOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );
    const [approveNote, setApproveNote] = useState("");
    const [rejectNote, setRejectNote] = useState("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [rejectionReasonError, setRejectionReasonError] = useState("");

    // Fetch installment detail
    const {
        data: installment,
        isLoading,
        error,
        refetch: refetchInstallment,
    } = useInstallment(installmentId!);

    // Submit payment mutation
    const { mutateAsync: submitPayment, isPending: isSubmitting } =
        useSubmitPayment();

    // Change payment status mutation
    const { mutateAsync: changePaymentStatus, isPending: isChangingStatus } =
        useChangePaymentStatus();

    const { execute } = useMutationHandler();

    // Transform payment history data for UI (from installment.payments)
    const {
        data: paymentHistory,
        refetch: refetchPaymentHistory,
        isFetching: isRefetchingHistory,
    } = usePaymentHistory(installmentId!);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<PaymentFormData>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            paymentType: "full",
            paidAmount: installment?.amount || 0,
            remainingAmount: 0,
            paymentMethod: "credit_card",
            paymentDate: new Date().toISOString().split("T")[0],
            notes: "",
        },
    });

    const paymentType = watch("paymentType");
    const paidAmount = watch("paidAmount");

    // Calculate remaining amount
    const remainingAfterPayment = useMemo(() => {
        if (!installment) return 0;
        return Math.max(0, installment.amount - (paidAmount || 0))?.toFixed(2);
    }, [installment, paidAmount]);

    // Update paid amount when payment type changes
    const handlePaymentTypeChange = (type: PaymentType) => {
        setValue("paymentType", type);
        if (type === "full" && installment) {
            setValue("paidAmount", installment.amount);
            setValue("remainingAmount", 0);
        }
    };

    // Payment method options
    const paymentMethodOptions = useMemo(
        () => [
            {
                value: "credit_card",
                label: t(
                    "sales_subscription:installments.paymentMethods.creditCard",
                    "Credit Card"
                ),
            },
            {
                value: "bank_transfer",
                label: t(
                    "sales_subscription:installments.paymentMethods.bankTransfer",
                    "Bank Transfer"
                ),
            },
            {
                value: "cash",
                label: t(
                    "sales_subscription:installments.paymentMethods.cash",
                    "Cash"
                ),
            },
            {
                value: "check",
                label: t(
                    "sales_subscription:installments.paymentMethods.check",
                    "Check"
                ),
            },
        ],
        [t]
    );

    const onSubmit = () => {
        setConfirmDialogOpen(true);
    };

    const handleConfirmPayment = () => {
        const formData = watch();
        if (!installment) return;

        execute(
            () =>
                submitPayment({
                    installmentId: installment.id,
                    payload: {
                        amount: formData.paidAmount,
                        paymentMethod: formData.paymentMethod as PaymentMethod,
                    },
                }),
            {
                successMessage: t(
                    "sales_subscription:installments.pay.paymentSuccess",
                    "Payment submitted successfully"
                ),
                onSuccess: () => {
                    setConfirmDialogOpen(false);
                    navigate(paths.dashboard.salesSubscription.paymentsList());
                },
            }
        );
    };

    // Handle opening approve dialog
    const handleOpenApproveDialog = (payment: Payment) => {
        setSelectedPayment(payment);
        setApproveNote("");
        setApproveDialogOpen(true);
    };

    // Handle opening reject dialog
    const handleOpenRejectDialog = (payment: Payment) => {
        setSelectedPayment(payment);
        setRejectNote("");
        setRejectionReason("");
        setRejectionReasonError("");
        setRejectDialogOpen(true);
    };

    // Handle opening view reason dialog
    const handleOpenViewReasonDialog = (payment: Payment) => {
        setSelectedPayment(payment);
        setViewReasonDialogOpen(true);
    };

    // Handle approve payment
    const handleApprovePayment = () => {
        if (!selectedPayment) return;

        execute(
            () =>
                changePaymentStatus({
                    paymentId: selectedPayment.id,
                    payload: {
                        status: "approved",
                        notes: approveNote || undefined,
                    },
                }),
            {
                successMessage: t(
                    "sales_subscription:installments.pay.approveSuccess",
                    "Payment approved successfully"
                ),
                onSuccess: () => {
                    setApproveDialogOpen(false);
                    setSelectedPayment(null);
                    setApproveNote("");
                    refetchInstallment();
                },
            }
        );
    };

    // Handle reject payment
    const handleRejectPayment = () => {
        if (!selectedPayment) return;

        if (!rejectionReason.trim()) {
            setRejectionReasonError(
                t(
                    "sales_subscription:installments.pay.rejectionReasonRequired",
                    "Rejection reason is required"
                )
            );
            return;
        }

        execute(
            () =>
                changePaymentStatus({
                    paymentId: selectedPayment.id,
                    payload: {
                        status: "rejected",
                        notes: rejectNote || undefined,
                        rejectionReason: rejectionReason,
                    },
                }),
            {
                successMessage: t(
                    "sales_subscription:installments.pay.rejectSuccess",
                    "Payment rejected"
                ),
                onSuccess: () => {
                    setRejectDialogOpen(false);
                    setSelectedPayment(null);
                    setRejectNote("");
                    setRejectionReason("");
                    setRejectionReasonError("");
                    refetchInstallment();
                },
            }
        );
    };

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error || !installment) {
        return (
            <ErrorState
                message={t(
                    "sales_subscription:installments.error.notFound",
                    "Installment not found"
                )}
                onRetry={() =>
                    navigate(paths.dashboard.salesSubscription.paymentsList())
                }
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t(
                    "sales_subscription:installments.pay.pageTitle",
                    "Pay Installment"
                ),
                subtitle: t(
                    "sales_subscription:installments.pay.pageSubtitle",
                    "Record and confirm student installment payment"
                ),
                backButton: true,
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Student Information Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
                            {t(
                                "sales_subscription:installments.pay.studentInfo",
                                "Student Information"
                            )}
                        </h3>

                        {/* Student Row with Avatar, Name, Email and Status Badge */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                    {installment.levelSubscription.student
                                        ?.image ? (
                                        <img
                                            src={
                                                installment.levelSubscription
                                                    .student.image
                                            }
                                            alt={
                                                installment.levelSubscription
                                                    .student.name
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-500 dark:text-gray-400">
                                            {installment.levelSubscription.student.name?.charAt(
                                                0
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* Name and Email */}
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {
                                            installment.levelSubscription
                                                .student.name
                                        }
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {
                                            installment.levelSubscription
                                                .student.email
                                        }
                                    </p>
                                </div>
                            </div>
                            {/* Status Badge */}
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                    installment.isOverdue
                                        ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                        : installment.status === "paid"
                                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                          : installment.status ===
                                              "partially_paid"
                                            ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
                                            : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                }`}
                            >
                                {installment.statusLabel}
                            </span>
                        </div>

                        {/* Invoice, Course, Contact Row */}
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                    {t(
                                        "sales_subscription:installments.pay.invoiceNumber",
                                        "Invoice Number"
                                    )}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {installment.levelSubscription.id}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                    {t(
                                        "sales_subscription:installments.pay.course",
                                        "Course"
                                    )}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {
                                        installment.levelSubscription.level
                                            .course.title
                                    }
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                                    {t(
                                        "sales_subscription:installments.pay.contact",
                                        "Contact"
                                    )}
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {
                                        installment.levelSubscription.student
                                            .phone
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Installment Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 py-5 shadow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                            {t(
                                "sales_subscription:installments.pay.installmentDetails",
                                "Installment Details"
                            )}
                        </h3>

                        {/* Top Section - Installment Info */}
                        <div className="space-y-4">
                            {/* Installment Number */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.installmentNumber",
                                        "Installment Number"
                                    )}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {installment.installmentNumber}{" "}
                                    {t(
                                        "sales_subscription:installments.pay.of",
                                        "of"
                                    )}{" "}
                                    {
                                        installment.levelSubscription.levelPrice
                                            .maxInstallments
                                    }
                                </span>
                            </div>
                            {/* Installment Amount */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.installmentAmount",
                                        "Installment Amount"
                                    )}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${installment.amount}
                                </span>
                            </div>
                            {/* Due Date */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.dueDate",
                                        "Due Date"
                                    )}
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {new Date(
                                        installment.dueDate
                                    ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            {/* Current Status */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.currentStatus",
                                        "Current Status"
                                    )}
                                </span>
                                <span
                                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                        installment.isOverdue
                                            ? "bg-red-100 text-red-500"
                                            : installment.status === "paid"
                                              ? "bg-green-100 text-green-500"
                                              : installment.status ===
                                                  "partially_paid"
                                                ? "bg-yellow-100 text-yellow-500"
                                                : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {installment.statusLabel}
                                </span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-200 dark:border-gray-700 my-5" />

                        {/* Bottom Section - Totals */}
                        <div className="space-y-4">
                            {/* Total Course Fee */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.totalCourseFee",
                                        "Total Course Fee"
                                    )}
                                    :
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${installment.levelSubscription.totalAmount}
                                </span>
                            </div>
                            {/* Total Paid */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.totalPaidInstallments",
                                        "Total Paid"
                                    )}{" "}
                                </span>
                                <span className="text-sm font-semibold text-emerald-500">
                                    $
                                    {installment.paidAmount.toLocaleString(
                                        undefined,
                                        { minimumFractionDigits: 2 }
                                    )}
                                </span>
                            </div>
                            {/* Remaining Balance */}
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {t(
                                        "sales_subscription:installments.pay.remainingBalance",
                                        "Remaining Balance"
                                    )}
                                    :
                                </span>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                    ${installment.remainingAmount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details Form */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-6 py-5 shadow">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
                            {t(
                                "sales_subscription:installments.pay.paymentDetails",
                                "Payment Details"
                            )}
                        </h3>

                        <div className="space-y-5">
                            {/* Payment Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {t(
                                        "sales_subscription:installments.pay.paymentType",
                                        "Payment Type"
                                    )}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePaymentTypeChange("full")
                                        }
                                        className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                                            paymentType === "full"
                                                ? "bg-brand-500 dark:bg-brand-800 border-brand-500 dark:border-brand-800 text-white"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                paymentType === "full"
                                                    ? "border-white"
                                                    : "border-gray-300 dark:border-gray-500"
                                            }`}
                                        >
                                            {paymentType === "full" && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium">
                                                {t(
                                                    "sales_subscription:installments.pay.fullPayment",
                                                    "Full Payment"
                                                )}
                                            </p>
                                            <p
                                                className={`text-xs ${paymentType === "full" ? "text-brand-100" : "text-gray-400"}`}
                                            >
                                                {t(
                                                    "sales_subscription:installments.pay.fullPaymentDesc",
                                                    "Pay complete installment"
                                                )}
                                            </p>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handlePaymentTypeChange("partial")
                                        }
                                        className={`px-4 py-3 rounded-lg border transition-all flex items-center gap-2 ${
                                            paymentType === "partial"
                                                ? "bg-brand-500 dark:bg-brand-800 border-brand-500 dark:border-brand-800 text-white"
                                                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                        }`}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                                paymentType === "partial"
                                                    ? "border-white"
                                                    : "border-gray-300 dark:border-gray-500"
                                            }`}
                                        >
                                            {paymentType === "partial" && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium">
                                                {t(
                                                    "sales_subscription:installments.pay.partialPayment",
                                                    "Partial Payment"
                                                )}
                                            </p>
                                            <p
                                                className={`text-xs ${paymentType === "partial" ? "text-brand-100" : "text-gray-400"}`}
                                            >
                                                {t(
                                                    "sales_subscription:installments.pay.partialPaymentDesc",
                                                    "Pay custom amount"
                                                )}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Amount Fields - Side by Side */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Paid Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t(
                                            "sales_subscription:installments.pay.paidAmount",
                                            "Paid Amount"
                                        )}{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <Controller
                                            name="paidAmount"
                                            control={control}
                                            render={({ field }) => (
                                                <input
                                                    type="number"
                                                    min={0}
                                                    step={0.01}
                                                    value={field.value}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            parseFloat(
                                                                e.target.value
                                                            ) || 0
                                                        )
                                                    }
                                                    className="w-full pl-7 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.paidAmount && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.paidAmount.message}
                                        </p>
                                    )}
                                </div>
                                {/* Remaining Amount */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t(
                                            "sales_subscription:installments.pay.remainingAmount",
                                            "Remaining Amount"
                                        )}
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            $
                                        </span>
                                        <input
                                            type="text"
                                            value={remainingAfterPayment}
                                            readOnly
                                            className="w-full pl-7 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "sales_subscription:installments.pay.paymentMethod",
                                        "Payment Method"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="paymentMethod"
                                    control={control}
                                    render={({ field }) => (
                                        <DropdownInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={paymentMethodOptions}
                                            placeholder={t(
                                                "sales_subscription:installments.pay.selectMethod",
                                                "Select payment method"
                                            )}
                                        />
                                    )}
                                />
                                {errors.paymentMethod && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.paymentMethod.message}
                                    </p>
                                )}
                            </div>

                            {/* Payment Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "sales_subscription:installments.pay.paymentDate",
                                        "Payment Date"
                                    )}{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <Controller
                                    name="paymentDate"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="date"
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                        />
                                    )}
                                />
                                {errors.paymentDate && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.paymentDate.message}
                                    </p>
                                )}
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t(
                                        "sales_subscription:installments.pay.notes",
                                        "Notes"
                                    )}{" "}
                                    <span className="text-gray-400 font-normal">
                                        ({t("common.optional", "Optional")})
                                    </span>
                                </label>
                                <Controller
                                    name="notes"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            rows={3}
                                            placeholder={t(
                                                "sales_subscription:installments.pay.notesPlaceholder",
                                                "Add any additional notes about this payment..."
                                            )}
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                                        />
                                    )}
                                />
                            </div>

                            {/* Payment Confirmation Info Box */}
                            <div className="bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                                        <span className="text-white text-xs font-bold">
                                            i
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-brand-800 dark:text-brand-300">
                                            {t(
                                                "sales_subscription:installments.pay.confirmationWarning",
                                                "Payment Confirmation"
                                            )}
                                        </p>
                                        <p className="text-sm text-brand-700 dark:text-brand-400 mt-1">
                                            {t(
                                                "sales_subscription:installments.pay.confirmationWarningText",
                                                "Please verify all payment details before confirming. Once confirmed, a payment receipt will be generated and sent to the student's email."
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700  ">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t(
                                            "sales_subscription:installments.pay.totalPayment",
                                            "Total Payment"
                                        )}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ${paidAmount || "0.00"}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Check className="w-4 h-4" />
                                    {t(
                                        "sales_subscription:installments.pay.confirmPayment",
                                        "Confirm Payment"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Payment Summary Card */}
                    <div className="rounded-2xl overflow-hidden shadow">
                        {/* Header */}
                        <div className="w-full flex items-center justify-between px-5 py-4 bg-brand-500 dark:bg-brand-800">
                            <h3 className="text-base font-semibold text-white">
                                {t(
                                    "sales_subscription:installments.pay.paymentSummary",
                                    "Payment Summary"
                                )}
                            </h3>

                            <ReceiptTextIcon color="white" />
                        </div>

                        {/* White Content Area */}
                        <div className="bg-brand-500 dark:bg-brand-800 px-5 py-4">
                            {/* Installment Amount */}
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">
                                    {t(
                                        "sales_subscription:installments.pay.installmentAmount",
                                        "Installment Amount"
                                    )}
                                </span>
                                <span className="text-base font-bold text-white">
                                    ${installment.amount}
                                </span>
                            </div>
                            {/* Paid Amount */}
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">
                                    {t(
                                        "sales_subscription:installments.pay.paidAmount",
                                        "Paid Amount"
                                    )}
                                </span>
                                <span className="text-base font-bold text-white">
                                    ${paidAmount || "0.00"}
                                </span>
                            </div>
                            {/* Remaining Amount */}
                            <div className="flex justify-between items-center py-2">
                                <span className="text-white">
                                    {t(
                                        "sales_subscription:installments.pay.remainingAmount",
                                        "Remaining Amount"
                                    )}
                                </span>
                                <span className="text-base font-bold text-white">
                                    ${remainingAfterPayment}
                                </span>
                            </div>
                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                            {/* Bottom */}
                            <div className="bg-brand-600 dark:bg-brand-900 py-2dark:bg-gray-800 rounded-lg px-4 py-3 mt-3">
                                {/* Payment Status */}
                                <div className="flex justify-between items-center">
                                    <span className="text-white">
                                        {t(
                                            "sales_subscription:installments.pay.paymentStatus",
                                            "Payment Status"
                                        )}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                                            installment.isOverdue
                                                ? "bg-red-100 text-red-500"
                                                : installment.status === "paid"
                                                  ? "bg-green-100 text-green-500"
                                                  : installment.status ===
                                                      "partially_paid"
                                                    ? "bg-yellow-100 text-yellow-500"
                                                    : "bg-gray-400 text-white"
                                        }`}
                                    >
                                        {installment.statusLabel}
                                    </span>
                                </div>

                                {/* After Payment Balance */}
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-white">
                                        {t(
                                            "sales_subscription:installments.pay.afterPaymentBalance",
                                            "After Payment Balance"
                                        )}
                                    </span>
                                    <span className="text-lg font-bold text-white">
                                        $
                                        {(
                                            installment.remainingAmount -
                                            (paidAmount || 0)
                                        ).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment History Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-5 py-4 shadow">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <History className="w-3 h-3 text-gray-500" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {t(
                                    "sales_subscription:installments.pay.paymentHistory",
                                    "Payment History"
                                )}
                            </h3>

                            <button
                                type="button"
                                onClick={() => refetchPaymentHistory()}
                                disabled={isRefetchingHistory}
                                className="ml-auto p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                title={t("common.refresh", "Refresh")}
                            >
                                <RefreshCw
                                    className={`w-4 h-4 text-gray-500 dark:text-gray-400 ${isRefetchingHistory ? "animate-spin" : ""}`}
                                />
                            </button>
                        </div>
                        {/* Timeline */}
                        {paymentHistory && paymentHistory.length > 0 ? (
                            <div className="relative space-y-4">
                                {paymentHistory.map((historyItem, index) => (
                                    <div
                                        key={historyItem.id}
                                        className="flex items-start gap-3 pb-4 last:pb-0"
                                    >
                                        {/* Timeline Icon & Line */}
                                        <div className="relative flex flex-col items-center">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                                    historyItem.paymentStatus ===
                                                    "pending"
                                                        ? "bg-orange-100 dark:bg-orange-900/30"
                                                        : historyItem.paymentStatus ===
                                                            "rejected"
                                                          ? "bg-red-100 dark:bg-red-900/30"
                                                          : "bg-green-100 dark:bg-green-900/30"
                                                }`}
                                            >
                                                {historyItem.paymentStatus ===
                                                "pending" ? (
                                                    <Clock className="w-4 h-4 text-orange-500" />
                                                ) : historyItem.paymentStatus ===
                                                  "rejected" ? (
                                                    <XCircle className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                                )}
                                            </div>
                                            {/* Vertical Line */}
                                            {index <
                                                paymentHistory.length - 1 && (
                                                <div className="w-px h-full bg-gray-200 dark:bg-gray-700 absolute top-8 left-1/2 -translate-x-1/2" />
                                            )}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {t(
                                                                "sales_subscription:installments.pay.installment",
                                                                "Installment Payment"
                                                            )}{" "}
                                                            #{historyItem.id}
                                                        </p>
                                                        {/* Status Badge */}
                                                        <span
                                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                historyItem.paymentStatus ===
                                                                "pending"
                                                                    ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                                                                    : historyItem.paymentStatus ===
                                                                        "rejected"
                                                                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                                      : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                            }`}
                                                        >
                                                            {t(
                                                                `sales_subscription:installments.paymentStatus.${historyItem.paymentStatus}`,
                                                                historyItem.paymentStatus
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                                        {new Date(
                                                            historyItem.paymentDate
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            }
                                                        )}{" "}
                                                        •{" "}
                                                        <span className="inline-flex items-center gap-1">
                                                            {historyItem.paymentMethod ===
                                                            "card" ? (
                                                                <CreditCard className="w-3 h-3" />
                                                            ) : historyItem.paymentMethod ===
                                                              "bank_transfer" ? (
                                                                <Building className="w-3 h-3" />
                                                            ) : historyItem.paymentMethod ===
                                                              "cash" ? (
                                                                <Banknote className="w-3 h-3" />
                                                            ) : (
                                                                <CreditCard className="w-3 h-3" />
                                                            )}
                                                            {historyItem.paymentMethod ===
                                                            "card"
                                                                ? t(
                                                                      "sales_subscription:installments.paymentMethods.creditCard",
                                                                      "Credit Card"
                                                                  )
                                                                : historyItem.paymentMethod ===
                                                                    "bank_transfer"
                                                                  ? t(
                                                                        "sales_subscription:installments.paymentMethods.bankTransfer",
                                                                        "Bank Transfer"
                                                                    )
                                                                  : historyItem.paymentMethod ===
                                                                      "cash"
                                                                    ? t(
                                                                          "sales_subscription:installments.paymentMethods.cash",
                                                                          "Cash"
                                                                      )
                                                                    : historyItem.paymentMethod
                                                                          .split(
                                                                              "_"
                                                                          )
                                                                          .map(
                                                                              (
                                                                                  word: string
                                                                              ) =>
                                                                                  word
                                                                                      .charAt(
                                                                                          0
                                                                                      )
                                                                                      .toUpperCase() +
                                                                                  word.slice(
                                                                                      1
                                                                                  )
                                                                          )
                                                                          .join(
                                                                              " "
                                                                          )}
                                                        </span>
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ${historyItem.amount}
                                                </span>
                                            </div>
                                            {/* Action Buttons for Pending Status */}
                                            {historyItem.paymentStatus ===
                                                "pending" && (
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenApproveDialog(
                                                                historyItem
                                                            )
                                                        }
                                                        disabled={
                                                            isChangingStatus
                                                        }
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        {t(
                                                            "sales_subscription:installments.pay.approve",
                                                            "Approve"
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleOpenRejectDialog(
                                                                historyItem
                                                            )
                                                        }
                                                        disabled={
                                                            isChangingStatus
                                                        }
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        {t(
                                                            "sales_subscription:installments.pay.reject",
                                                            "Reject"
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                            {/* View Reason Button for Rejected Status */}
                                            {historyItem.paymentStatus ===
                                                "rejected" &&
                                                historyItem.rejectionReason && (
                                                    <div className="mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenViewReasonDialog(
                                                                    historyItem
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            {t(
                                                                "sales_subscription:installments.pay.viewReason",
                                                                "View Reason"
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            {/* View Notes Button for any status with notes */}
                                            {historyItem.paymentStatus !==
                                                "rejected" &&
                                                historyItem.reviewNotes && (
                                                    <div className="mt-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenViewReasonDialog(
                                                                    historyItem
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                            {t(
                                                                "sales_subscription:installments.pay.viewNotes",
                                                                "View Notes"
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                {t(
                                    "sales_subscription:installments.pay.noPaymentHistory",
                                    "No payment history yet"
                                )}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Dialog */}
            <ConfirmDialog
                isOpen={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                title={t(
                    "sales_subscription:installments.pay.confirmTitle",
                    "Confirm Payment"
                )}
                message={t(
                    "sales_subscription:installments.pay.confirmDescription",
                    "Are you sure you want to record this payment? This action cannot be undone."
                )}
                confirmText={t(
                    "sales_subscription:installments.pay.confirm",
                    "Confirm"
                )}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleConfirmPayment}
                onCancel={() => setConfirmDialogOpen(false)}
                loading={isSubmitting}
                variant="warning"
            />

            {/* Approve Payment Dialog */}
            <ConfirmDialog
                isOpen={approveDialogOpen}
                onClose={() => {
                    setApproveDialogOpen(false);
                    setSelectedPayment(null);
                    setApproveNote("");
                }}
                title={t(
                    "sales_subscription:installments.pay.approveTitle",
                    "Approve Payment"
                )}
                message={
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(
                                "sales_subscription:installments.pay.approveDescription",
                                "Are you sure you want to approve this payment?"
                            )}
                        </p>
                        {selectedPayment && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${selectedPayment.amount}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        `sales_subscription:installments.paymentMethods.${selectedPayment.paymentMethod === "card" ? "creditCard" : selectedPayment.paymentMethod === "bank_transfer" ? "bankTransfer" : selectedPayment.paymentMethod}`,
                                        selectedPayment.paymentMethod
                                    )}
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t(
                                    "sales_subscription:installments.pay.notes",
                                    "Notes"
                                )}{" "}
                                <span className="text-gray-400 font-normal">
                                    ({t("common.optional", "Optional")})
                                </span>
                            </label>
                            <textarea
                                value={approveNote}
                                onChange={(e) => setApproveNote(e.target.value)}
                                rows={3}
                                placeholder={t(
                                    "sales_subscription:installments.pay.approveNotePlaceholder",
                                    "Add any notes about this approval..."
                                )}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>
                }
                confirmText={t(
                    "sales_subscription:installments.pay.approve",
                    "Approve"
                )}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleApprovePayment}
                onCancel={() => {
                    setApproveDialogOpen(false);
                    setSelectedPayment(null);
                    setApproveNote("");
                }}
                loading={isChangingStatus}
                variant="success"
            />

            {/* Reject Payment Dialog */}
            <ConfirmDialog
                isOpen={rejectDialogOpen}
                onClose={() => {
                    setRejectDialogOpen(false);
                    setSelectedPayment(null);
                    setRejectNote("");
                    setRejectionReason("");
                    setRejectionReasonError("");
                }}
                title={t(
                    "sales_subscription:installments.pay.rejectTitle",
                    "Reject Payment"
                )}
                message={
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t(
                                "sales_subscription:installments.pay.rejectDescription",
                                "Are you sure you want to reject this payment?"
                            )}
                        </p>
                        {selectedPayment && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    ${selectedPayment.amount}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t(
                                        `sales_subscription:installments.paymentMethods.${selectedPayment.paymentMethod === "card" ? "creditCard" : selectedPayment.paymentMethod === "bank_transfer" ? "bankTransfer" : selectedPayment.paymentMethod}`,
                                        selectedPayment.paymentMethod
                                    )}
                                </p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t(
                                    "sales_subscription:installments.pay.rejectionReason",
                                    "Rejection Reason"
                                )}{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => {
                                    setRejectionReason(e.target.value);
                                    if (e.target.value.trim()) {
                                        setRejectionReasonError("");
                                    }
                                }}
                                rows={3}
                                placeholder={t(
                                    "sales_subscription:installments.pay.rejectionReasonPlaceholder",
                                    "Enter the reason for rejecting this payment..."
                                )}
                                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none ${
                                    rejectionReasonError
                                        ? "border-red-500"
                                        : "border-gray-200 dark:border-gray-700"
                                }`}
                            />
                            {rejectionReasonError && (
                                <p className="mt-1 text-sm text-red-500">
                                    {rejectionReasonError}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t(
                                    "sales_subscription:installments.pay.notes",
                                    "Notes"
                                )}{" "}
                                <span className="text-gray-400 font-normal">
                                    ({t("common.optional", "Optional")})
                                </span>
                            </label>
                            <textarea
                                value={rejectNote}
                                onChange={(e) => setRejectNote(e.target.value)}
                                rows={2}
                                placeholder={t(
                                    "sales_subscription:installments.pay.rejectNotePlaceholder",
                                    "Add any additional notes..."
                                )}
                                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                            />
                        </div>
                    </div>
                }
                confirmText={t(
                    "sales_subscription:installments.pay.reject",
                    "Reject"
                )}
                cancelText={t("common.cancel", "Cancel")}
                onConfirm={handleRejectPayment}
                onCancel={() => {
                    setRejectDialogOpen(false);
                    setSelectedPayment(null);
                    setRejectNote("");
                    setRejectionReason("");
                    setRejectionReasonError("");
                }}
                loading={isChangingStatus}
                variant="danger"
            />

            {/* View Rejection Reason / Notes Dialog */}
            <ConfirmDialog
                isOpen={viewReasonDialogOpen}
                onClose={() => {
                    setViewReasonDialogOpen(false);
                    setSelectedPayment(null);
                }}
                title={
                    selectedPayment?.paymentStatus === "rejected"
                        ? t(
                              "sales_subscription:installments.pay.rejectionReasonTitle",
                              "Rejection Reason"
                          )
                        : t(
                              "sales_subscription:installments.pay.reviewNotesTitle",
                              "Review Notes"
                          )
                }
                message={
                    <div className="space-y-4">
                        {selectedPayment && (
                            <>
                                {selectedPayment.paymentStatus === "rejected" &&
                                    selectedPayment.rejectionReason && (
                                        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                            <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                                                {t(
                                                    "sales_subscription:installments.pay.rejectionReason",
                                                    "Rejection Reason"
                                                )}
                                            </p>
                                            <p className="text-sm text-red-700 dark:text-red-400">
                                                {
                                                    selectedPayment.rejectionReason
                                                }
                                            </p>
                                        </div>
                                    )}
                                {selectedPayment.paymentStatus === "rejected" &&
                                    selectedPayment.reviewNotes && (
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-300 mb-1">
                                                {t(
                                                    "sales_subscription:installments.pay.reviewNotes",
                                                    "Review Notes"
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {selectedPayment.reviewNotes}
                                            </p>
                                        </div>
                                    )}
                                {selectedPayment.paymentStatus !== "rejected" &&
                                    selectedPayment.reviewNotes && (
                                        <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-4">
                                            <p className="text-sm font-medium text-brand-800 dark:text-brand-300 mb-1">
                                                {t(
                                                    "sales_subscription:installments.pay.notes",
                                                    "Notes"
                                                )}
                                            </p>
                                            <p className="text-sm text-brand-700 dark:text-brand-400">
                                                {selectedPayment.reviewNotes}
                                            </p>
                                        </div>
                                    )}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${selectedPayment.amount}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {t(
                                            `sales_subscription:installments.paymentMethods.${selectedPayment.paymentMethod === "card" ? "creditCard" : selectedPayment.paymentMethod === "bank_transfer" ? "bankTransfer" : selectedPayment.paymentMethod}`,
                                            selectedPayment.paymentMethod
                                        )}{" "}
                                        •{" "}
                                        {new Date(
                                            selectedPayment.createdAt
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                }
                confirmText={t("common.close", "Close")}
                onConfirm={() => {
                    setViewReasonDialogOpen(false);
                    setSelectedPayment(null);
                }}
                variant={
                    selectedPayment?.paymentStatus === "rejected"
                        ? "danger"
                        : "info"
                }
            />
        </PageWrapper>
    );
}
