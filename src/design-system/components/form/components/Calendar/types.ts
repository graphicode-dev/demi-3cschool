// src/components/Calendar/types.ts
export interface CalendarProps {
    initialDate?: Date;
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    highlightedDates?: Date[];
    minDate?: Date;
    maxDate?: Date;
    className?: string;
    classNames?: {
        container?: string;
        header?: string;
        monthYear?: string;
        navigation?: string;
        daysGrid?: string;
        dayCell?: string;
        daySelected?: string;
        dayHighlighted?: string;
        dayToday?: string;
        dayDisabled?: string;
        dayWeekend?: string;
    };
    size?: "default" | "small" | "large";
    firstDayOfWeek?: 0 | 1; // 0 = Sunday, 1 = Monday
    variant?: "default" | "outlined" | "filled" | "soft";
}

export interface DateFormatters {
    apiFormat: (date: Date) => string;
    readableDate: (date: Date) => string;
    shortDate: (date: Date) => string;
    dateTime: (date: Date) => string;
}
