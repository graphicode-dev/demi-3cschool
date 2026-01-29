/**
 * CurriculumGrowthChart Component
 *
 * Displays a line chart showing curriculum growth over time.
 */

import { useTranslation } from "react-i18next";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface CurriculumGrowthChartProps {
    data: Array<{
        month: string;
        monthKey: string;
        value: number;
    }>;
}

export function CurriculumGrowthChart({ data }: CurriculumGrowthChartProps) {
    const { t } = useTranslation();

    const valueLabel = t("overview:overview.charts.valueLabel", "Value");

    const translatedData = data.map((item) => ({
        ...item,
        month: t(item.monthKey, item.month),
        [valueLabel]: item.value,
    }));

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
            <h3 className="mb-6 text-base font-semibold text-gray-900 dark:text-white">
                {t(
                    "overview:overview.charts.curriculumGrowth.title",
                    "Curriculum Growth"
                )}
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={translatedData}
                        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E4E7EC"
                        />
                        <XAxis
                            dataKey="month"
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
                        <Line
                            type="monotone"
                            dataKey={valueLabel}
                            stroke="#00AEED"
                            strokeWidth={2}
                            dot={{ fill: "#00AEED", strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: "#00AEED" }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CurriculumGrowthChart;
