/**
 * StudentDistributionChart Component
 *
 * Displays a bar chart showing student distribution by category.
 */

import { useTranslation } from "react-i18next";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StudentDistributionChartProps {
    data: Array<{
        category: string;
        categoryKey: string;
        value: number;
    }>;
}

export function StudentDistributionChart({
    data,
}: StudentDistributionChartProps) {
    const { t } = useTranslation();

    const valueLabel = t("overview:overview.charts.valueLabel", "Value");

    const translatedData = data.map((item) => ({
        ...item,
        category: t(item.categoryKey, item.category),
        [valueLabel]: item.value,
    }));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
                {t(
                    "overview:overview.charts.studentDistribution.title",
                    "Student Distribution"
                )}
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={translatedData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E4E7EC"
                        />
                        <XAxis
                            dataKey="category"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #E4E7EC",
                                borderRadius: "8px",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                            }}
                        />
                        <Bar
                            dataKey={valueLabel}
                            fill="#00AEED"
                            radius={[4, 4, 0, 0]}
                            barSize={60}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default StudentDistributionChart;
