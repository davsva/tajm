export function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

export function sameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
}

// Extend Date to determine the week of the year (local timezone) based on the ISO 8601 definition.
Date.prototype.iso8601Week = function () {
    // Create a copy of the current date, we don't want to mutate the original
    const date = new Date(this.getTime());

    // Find Thursday of this week starting on Monday
    date.setDate(date.getDate() + 4 - (date.getDay() || 7));
    const thursday = date.getTime();

    // Find January 1st
    date.setMonth(0); // January
    date.setDate(1);  // 1st
    const jan1st = date.getTime();

    // Round the amount of days to compensate for daylight saving time
    const days = Math.round((thursday - jan1st) / 86400000); // 1 day = 86400000 ms
    return Math.floor(days / 7) + 1;
};
