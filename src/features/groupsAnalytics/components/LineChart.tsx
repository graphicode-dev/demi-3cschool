interface DataPoint {
    label: string;
    value: number;
}

interface LineChartProps {
    data: DataPoint[];
    height?: number;
    showGrid?: boolean;
    lineColor?: string;
    fillColor?: string;
}

export function LineChart({
    data,
    height = 200,
    showGrid = true,
    lineColor = "#22d3ee",
    fillColor = "rgba(34, 211, 238, 0.1)",
}: LineChartProps) {
    if (data.length === 0) return null;

    const maxValue = Math.max(...data.map((d) => d.value));
    const minValue = Math.min(...data.map((d) => d.value));
    const range = maxValue - minValue || 1;

    const padding = { top: 20, right: 20, bottom: 40, left: 40 };
    const chartWidth = 100;
    const chartHeight = 100;

    const points = data.map((point, index) => {
        const x =
            padding.left +
            (index / (data.length - 1)) *
                (chartWidth - padding.left - padding.right);
        const y =
            padding.top +
            ((maxValue - point.value) / range) *
                (chartHeight - padding.top - padding.bottom);
        return { x, y, ...point };
    });

    const linePath = points
        .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
        .join(" ");

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding.bottom} L ${points[0].x} ${chartHeight - padding.bottom} Z`;

    const gridLines = [0, 25, 50, 75, 100].map((percent) => {
        const y =
            padding.top +
            (percent / 100) * (chartHeight - padding.top - padding.bottom);
        const value = maxValue - (percent / 100) * range;
        return { y, value: Math.round(value) };
    });

    return (
        <div style={{ height }}>
            <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                {showGrid &&
                    gridLines.map((line, i) => (
                        <g key={i}>
                            <line
                                x1={padding.left}
                                y1={line.y}
                                x2={chartWidth - padding.right}
                                y2={line.y}
                                stroke="currentColor"
                                strokeOpacity={0.1}
                                strokeWidth={0.2}
                            />
                            <text
                                x={padding.left - 5}
                                y={line.y}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="fill-gray-400 dark:fill-gray-500"
                                fontSize={3}
                            >
                                {line.value}
                            </text>
                        </g>
                    ))}

                <path d={areaPath} fill={fillColor} />

                <path
                    d={linePath}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={0.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, i) => (
                    <circle
                        key={i}
                        cx={point.x}
                        cy={point.y}
                        r={1}
                        fill="white"
                        stroke={lineColor}
                        strokeWidth={0.3}
                    />
                ))}

                {data.map((point, i) => {
                    const x =
                        padding.left +
                        (i / (data.length - 1)) *
                            (chartWidth - padding.left - padding.right);
                    return (
                        <text
                            key={i}
                            x={x}
                            y={chartHeight - padding.bottom + 8}
                            textAnchor="middle"
                            className="fill-gray-400 dark:fill-gray-500"
                            fontSize={2.5}
                        >
                            {point.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}

export default LineChart;
