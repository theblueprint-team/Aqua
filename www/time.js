// time.js

export const timeModule = {
    /**
     * Examines the current system clock and returns the correct time-of-day category.
     * 24-Hour Breakdown:
     * 00:00 - 04:59 : midnight
     * 05:00 - 11:59 : morning
     * 12:00 - 12:59 : noon
     * 13:00 - 16:59 : afternoon
     * 17:00 - 23:59 : evening
     * @returns {string} The localized greeting modifier
     */
    getGreetingPhrase() {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return "good morning";
        } else if (currentHour === 12) {
            return "having a good day?";
        } else if (currentHour >= 13 && currentHour < 17) {
            return "good afternoon";
        } else if (currentHour >= 17 && currentHour < 24) {
            return "good evening";
        } else {
            return "how is your night?";
        }
    }
};
