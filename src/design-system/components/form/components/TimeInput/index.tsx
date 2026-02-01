// src/components/TimeInput/index.tsx
import { useState, useRef, useEffect } from "react";
import { TimeInputProps } from "./types";
import { cn } from "../../utils/cn";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";

export const TimeInput = ({
    value,
    onChange,
    placeholder = "Select time",
    disabled = false,
    className,
    size = "md",
    min,
    max,
    step,
}: TimeInputProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hours, setHours] = useState("10");
    const [minutes, setMinutes] = useState("00");
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value into hours and minutes
    useEffect(() => {
        if (value) {
            const [h, m] = value.split(":");
            if (h) setHours(h.padStart(2, "0"));
            if (m) setMinutes(m.padStart(2, "0"));
        }
    }, [value]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const sizeClasses = {
        xs: "text-xs px-2 py-1 h-7",
        sm: "text-sm px-3 py-1.5 h-9",
        md: "text-base px-4 py-2 h-11",
        lg: "text-lg px-5 py-3 h-13",
        xl: "text-xl px-6 py-4 h-16",
    };

    const iconSizeClasses = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
    };

    const updateTime = (newHours: string, newMinutes: string) => {
        const formattedTime = `${newHours.padStart(2, "0")}:${newMinutes.padStart(2, "0")}`;
        onChange(formattedTime);
    };

    const incrementHours = () => {
        const newHours = ((parseInt(hours) + 1) % 24).toString();
        setHours(newHours.padStart(2, "0"));
        updateTime(newHours, minutes);
    };

    const decrementHours = () => {
        const newHours = ((parseInt(hours) - 1 + 24) % 24).toString();
        setHours(newHours.padStart(2, "0"));
        updateTime(newHours, minutes);
    };

    const incrementMinutes = () => {
        const newMinutes = ((parseInt(minutes) + 5) % 60).toString();
        setMinutes(newMinutes.padStart(2, "0"));
        if (parseInt(minutes) + 5 >= 60) {
            incrementHours();
        } else {
            updateTime(hours, newMinutes);
        }
    };

    const decrementMinutes = () => {
        const newMinutes = ((parseInt(minutes) - 5 + 60) % 60).toString();
        setMinutes(newMinutes.padStart(2, "0"));
        if (parseInt(minutes) - 5 < 0) {
            decrementHours();
        } else {
            updateTime(hours, newMinutes);
        }
    };

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);
        const numVal = parseInt(val) || 0;
        const clampedVal = Math.min(23, Math.max(0, numVal))
            .toString()
            .padStart(2, "0");
        setHours(clampedVal);
        updateTime(clampedVal, minutes);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 2);
        const numVal = parseInt(val) || 0;
        const clampedVal = Math.min(59, Math.max(0, numVal))
            .toString()
            .padStart(2, "0");
        setMinutes(clampedVal);
        updateTime(hours, clampedVal);
    };

    const displayValue = value ? `${hours}:${minutes}` : "";

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full rounded-lg border transition-all duration-200 text-left",
                    "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
                    "border-gray-300 dark:border-gray-700",
                    "hover:border-brand-400 dark:hover:border-brand-500",
                    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "pr-10",
                    sizeClasses[size],
                    isOpen && "border-brand-500 ring-2 ring-brand-500/20",
                    className
                )}
            >
                {displayValue || (
                    <span className="text-gray-400">{placeholder}</span>
                )}
            </button>
            <Clock
                className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400",
                    iconSizeClasses[size]
                )}
            />

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex items-center justify-center gap-4">
                        {/* Hours */}
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={incrementHours}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 transition-colors"
                            >
                                <ChevronUp className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={hours}
                                onChange={handleHoursChange}
                                className="w-14 h-14 text-center text-2xl font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 dark:text-white"
                                maxLength={2}
                            />
                            <button
                                type="button"
                                onClick={decrementHours}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 transition-colors"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-gray-500 mt-1">
                                Hours
                            </span>
                        </div>

                        {/* Separator */}
                        <span className="text-3xl font-bold text-gray-400 dark:text-gray-500 mb-6">
                            :
                        </span>

                        {/* Minutes */}
                        <div className="flex flex-col items-center">
                            <button
                                type="button"
                                onClick={incrementMinutes}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 transition-colors"
                            >
                                <ChevronUp className="w-5 h-5" />
                            </button>
                            <input
                                type="text"
                                value={minutes}
                                onChange={handleMinutesChange}
                                className="w-14 h-14 text-center text-2xl font-semibold bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-gray-900 dark:text-white"
                                maxLength={2}
                            />
                            <button
                                type="button"
                                onClick={decrementMinutes}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-brand-500 transition-colors"
                            >
                                <ChevronDown className="w-5 h-5" />
                            </button>
                            <span className="text-xs text-gray-500 mt-1">
                                Minutes
                            </span>
                        </div>
                    </div>

                    {/* Quick select buttons */}
                    <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {[
                                "09:00",
                                "10:00",
                                "12:00",
                                "14:00",
                                "16:00",
                                "18:00",
                            ].map((time) => (
                                <button
                                    key={time}
                                    type="button"
                                    onClick={() => {
                                        const [h, m] = time.split(":");
                                        setHours(h);
                                        setMinutes(m);
                                        updateTime(h, m);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "px-3 py-1.5 text-sm rounded-lg transition-colors",
                                        value === time
                                            ? "bg-brand-500 text-white"
                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-brand-100 dark:hover:bg-brand-900/30 hover:text-brand-600 dark:hover:text-brand-400"
                                    )}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Done button */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full mt-3 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    );
};
