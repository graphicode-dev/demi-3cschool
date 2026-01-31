interface BarData {
    label: string;
    value: number;
    maxValue?: number;
    color?: string;
}

interface HorizontalBarChartProps {
    data: BarData[];
    showValues?: boolean;
    valueFormatter?: (value: number) => string;
}

export function HorizontalBarChart({
    data,
    showValues = true,
    valueFormatter = (v) => `${v} students`,
}: HorizontalBarChartProps) {
    const maxValue = Math.max(...data.map((d) => d.maxValue || d.value));

    return (
        <div className="space-y-3">
            {data.map((item, index) => {
                const percentage =
                    maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                const barColor = item.color || "#22d3ee";

                return (
                    <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 dark:text-gray-300 truncate max-w-[60%]">
                                {item.label}
                            </span>
                            {showValues && (
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    {valueFormatter(item.value)}
                                </span>
                            )}
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                    width: `${percentage}%`,
                                    backgroundColor: barColor,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default HorizontalBarChart;
