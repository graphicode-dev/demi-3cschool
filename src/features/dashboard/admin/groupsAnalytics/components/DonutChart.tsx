import { useTranslation } from "react-i18next";

interface DonutChartProps {
    data: {
        label: string;
        value: number;
        color: string;
    }[];
    centerValue?: number | string;
    centerLabel?: string;
}

export function DonutChart({
    data,
    centerValue,
    centerLabel,
}: DonutChartProps) {
    const { t } = useTranslation("groupsAnalytics");
    const total = data.reduce((sum, item) => sum + item.value, 0);

    let currentAngle = 0;
    const segments = data.map((item) => {
        const percentage = total > 0 ? (item.value / total) * 100 : 0;
        const angle = (percentage / 100) * 360;
        const startAngle = currentAngle;
        currentAngle += angle;

        return {
            ...item,
            percentage,
            startAngle,
            endAngle: currentAngle,
        };
    });

    const createArcPath = (
        startAngle: number,
        endAngle: number,
        radius: number,
        innerRadius: number
    ) => {
        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const x1 = 50 + radius * Math.cos(startRad);
        const y1 = 50 + radius * Math.sin(startRad);
        const x2 = 50 + radius * Math.cos(endRad);
        const y2 = 50 + radius * Math.sin(endRad);

        const x3 = 50 + innerRadius * Math.cos(endRad);
        const y3 = 50 + innerRadius * Math.sin(endRad);
        const x4 = 50 + innerRadius * Math.cos(startRad);
        const y4 = 50 + innerRadius * Math.sin(startRad);

        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
    };

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    {segments.map((segment, index) => (
                        <path
                            key={index}
                            d={createArcPath(
                                segment.startAngle,
                                segment.endAngle,
                                45,
                                30
                            )}
                            fill={segment.color}
                            className="transition-all duration-300 hover:opacity-80"
                        />
                    ))}
                </svg>
                {centerValue !== undefined && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {centerValue}
                        </span>
                        {centerLabel && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {centerLabel}
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DonutChart;
