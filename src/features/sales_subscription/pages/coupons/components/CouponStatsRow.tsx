/**
 * CouponStatsRow Component
 *
 * Displays a row of stat cards for the coupons page.
 * Shows: Active Coupons, Total Usages, Expired Coupons, Total Revenue
 */

import { useTranslation } from "react-i18next";
import type { CouponStats } from "../types";
import { Tag, BarChart3, Clock, DollarSign } from "lucide-react";
import StatCard from "@/features/sales_subscription/components/StatCard";

interface CouponStatsRowProps {
    stats: CouponStats;
}

export function CouponStatsRow({ stats }: CouponStatsRowProps) {
    const { t } = useTranslation("salesSubscription");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title={t("coupons.stats.activeCoupons", "Active Coupons")}
                subTitle={t(
                    "coupons.stats.currentlyActive",
                    "Currently active"
                )}
                value={stats.activeCoupons}
                icon={<Tag className="w-5 h-5" />}
                trend={{
                    value: stats.trend?.activeCoupons,
                    label: t("coupons.stats.thisMonth", "this month"),
                }}
                variant="purple"
            />
            <StatCard
                title={t("coupons.stats.totalUsages", "Total Usages")}
                subTitle={t("coupons.stats.thisMonth", "This month")}
                value={stats.totalUsages}
                icon={<BarChart3 className="w-5 h-5" />}
                variant="green"
                trend={{
                    value: stats.trend?.totalUsages,
                }}
            />
            <StatCard
                title={t("coupons.stats.expiredCoupons", "Expired Coupons")}
                subTitle={t("coupons.stats.activeStudents", "Active students")}
                value={stats.expiredCoupons}
                icon={<Clock className="w-5 h-5" />}
                variant="orange"
                trend={{
                    value: stats.trend?.expiredCoupons,
                }}
            />
            <StatCard
                title={t("coupons.stats.totalRevenue", "Total Revenue")}
                subTitle={t("coupons.stats.thisMonth", "This month")}
                value={`$${stats.totalRevenue.toLocaleString()}`}
                icon={<DollarSign className="w-5 h-5" />}
                variant="blue"
                trend={{
                    value: stats.trend?.totalRevenue,
                }}
            />
        </div>
    );
}

export default CouponStatsRow;
