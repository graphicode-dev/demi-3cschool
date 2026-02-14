const HOURS = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
];

function formatLocalDateYYYYMMDD(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function parseLocalYYYYMMDD(yyyyMmDd: string) {
    const [y, m, d] = yyyyMmDd.split("-").map((v) => Number(v));
    if (!y || !m || !d) return null;
    return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function startOfWeekSunday(date: Date) {
    const start = new Date(date);
    start.setHours(12, 0, 0, 0);
    start.setDate(start.getDate() - start.getDay());
    return start;
}

export {
    HOURS,
    formatLocalDateYYYYMMDD,
    parseLocalYYYYMMDD,
    startOfWeekSunday,
};
