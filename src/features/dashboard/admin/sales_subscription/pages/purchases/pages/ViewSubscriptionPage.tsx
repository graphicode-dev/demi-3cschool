/**
 * View Subscription Page
 *
 * Displays detailed information about a single subscription.
 */

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    User,
    BookOpen,
    CreditCard,
    Calendar,
    Tag,
    Clock,
    DollarSign,
} from "lucide-react";
import { LoadingState, ErrorState } from "@/design-system";
import PageWrapper from "@/design-system/components/PageWrapper";
import { SubscriptionStatusBadge, useLevelSubscription } from "../../installments";

/**
 * Info Card Component
 */
interface InfoCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function InfoCard({ title, icon, children }: InfoCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-100 dark:bg-brand-900/30">
                    <div className="text-brand-500">{icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
            </div>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

/**
 * Info Row Component
 */
interface InfoRowProps {
    label: string;
    value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
            <span className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
                {value}
            </span>
        </div>
    );
}

/**
 * Format date string
 */
function formatDate(dateString: string | null): string {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ViewSubscriptionPage() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation("salesSubscription");

    const {
        data: subscription,
        isLoading,
        error,
        refetch,
    } = useLevelSubscription(id);

    if (isLoading) {
        return <LoadingState message={t("common.loading", "Loading...")} />;
    }

    if (error || !subscription) {
        return (
            <ErrorState
                message={
                    error?.message ||
                    t("errors.fetchFailed", "Failed to load subscription")
                }
                onRetry={refetch}
            />
        );
    }

    return (
        <PageWrapper
            pageHeaderProps={{
                title: t("subscriptions.view.title", "Subscription Details"),
                subtitle: t(
                    "subscriptions.view.subtitle",
                    `Subscription #${subscription.id}`
                ),
                backButton: true,
            }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Information */}
                <InfoCard
                    title={t(
                        "subscriptions.view.studentInfo",
                        "Student Information"
                    )}
                    icon={<User className="w-5 h-5" />}
                >
                    <InfoRow
                        label={t("subscriptions.view.studentName", "Name")}
                        value={subscription.student.name}
                    />
                    <InfoRow
                        label={t("subscriptions.view.studentEmail", "Email")}
                        value={subscription.student.email}
                    />
                </InfoCard>

                {/* Course & Level */}
                <InfoCard
                    title={t("subscriptions.view.courseInfo", "Course & Level")}
                    icon={<BookOpen className="w-5 h-5" />}
                >
                    <InfoRow
                        label={t("subscriptions.view.course", "Course")}
                        value={subscription.level.course.title}
                    />
                    <InfoRow
                        label={t("subscriptions.view.level", "Level")}
                        value={subscription.level.title}
                    />
                </InfoCard>

                {/* Pricing Information */}
                <InfoCard
                    title={t(
                        "subscriptions.view.pricingInfo",
                        "Pricing Information"
                    )}
                    icon={<DollarSign className="w-5 h-5" />}
                >
                    <InfoRow
                        label={t("subscriptions.view.pricePlan", "Price Plan")}
                        value={subscription.levelPrice.name}
                    />
                    <InfoRow
                        label={t(
                            "subscriptions.view.originalAmount",
                            "Original Amount"
                        )}
                        value={`$${subscription.originalAmount}`}
                    />
                    <InfoRow
                        label={t("subscriptions.view.discount", "Discount")}
                        value={
                            subscription.discountAmount !== "0.00"
                                ? `-$${subscription.discountAmount}`
                                : "-"
                        }
                    />
                    <InfoRow
                        label={t(
                            "subscriptions.view.totalAmount",
                            "Total Amount"
                        )}
                        value={
                            <span className="text-lg font-bold text-brand-500">
                                ${subscription.totalAmount}
                            </span>
                        }
                    />
                    <InfoRow
                        label={t(
                            "subscriptions.view.maxInstallments",
                            "Max Installments"
                        )}
                        value={subscription.levelPrice.maxInstallments}
                    />
                </InfoCard>

                {/* Subscription Status */}
                <InfoCard
                    title={t(
                        "subscriptions.view.statusInfo",
                        "Subscription Status"
                    )}
                    icon={<Clock className="w-5 h-5" />}
                >
                    <InfoRow
                        label={t("subscriptions.view.status", "Status")}
                        value={
                            <SubscriptionStatusBadge
                                status={subscription.subscriptionStatus}
                            />
                        }
                    />
                    <InfoRow
                        label={t(
                            "subscriptions.view.activatedAt",
                            "Activated At"
                        )}
                        value={formatDate(subscription.activatedAt)}
                    />
                    {subscription.frozenAt && (
                        <>
                            <InfoRow
                                label={t(
                                    "subscriptions.view.frozenAt",
                                    "Frozen At"
                                )}
                                value={formatDate(subscription.frozenAt)}
                            />
                            <InfoRow
                                label={t(
                                    "subscriptions.view.freezeReason",
                                    "Freeze Reason"
                                )}
                                value={subscription.freezeReason || "-"}
                            />
                        </>
                    )}
                </InfoCard>

                {/* Coupon Information */}
                {subscription.coupon && (
                    <InfoCard
                        title={t(
                            "subscriptions.view.couponInfo",
                            "Coupon Information"
                        )}
                        icon={<Tag className="w-5 h-5" />}
                    >
                        <InfoRow
                            label={t(
                                "subscriptions.view.couponCode",
                                "Coupon Code"
                            )}
                            value={
                                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                                    {subscription.coupon.code}
                                </span>
                            }
                        />
                        <InfoRow
                            label={t(
                                "subscriptions.view.discountApplied",
                                "Discount Applied"
                            )}
                            value={`$${subscription.discountAmount}`}
                        />
                    </InfoCard>
                )}

                {/* Timestamps */}
                <InfoCard
                    title={t("subscriptions.view.timestamps", "Timestamps")}
                    icon={<Calendar className="w-5 h-5" />}
                >
                    <InfoRow
                        label={t("subscriptions.view.createdAt", "Created At")}
                        value={formatDate(subscription.createdAt)}
                    />
                    <InfoRow
                        label={t("subscriptions.view.updatedAt", "Updated At")}
                        value={formatDate(subscription.updatedAt)}
                    />
                </InfoCard>
            </div>
        </PageWrapper>
    );
}
