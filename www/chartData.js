// chartData.js
import { database } from './database.js';

export const chartDataModule = {
    /**
     * Formats a Date object to YYYY-MM-DD
     */
    _formatKey(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },

    /**
     * Gets labels and values for the current week (Mon-Sun alignment)
     */
    getWeeklyData() {
        const labels = ["MON", "TUE", "WEN", "TH", "FRI", "SAT", "SUN"];
        const values = [];
        
        const today = new Date();
        const currentDayIndex = today.getDay(); 
        // Normalize Sunday from 0 to 6 index position to match layout arrays
        const normalizedTodayIndex = currentDayIndex === 0 ? 6 : currentDayIndex - 1;

        for (let i = 0; i < 7; i++) {
            const diff = i - normalizedTodayIndex;
            const targetDate = new Date();
            targetDate.setDate(today.getDate() + diff);
            
            const key = this._formatKey(targetDate);
            const amount = parseInt(database.get('records', key) || 0, 10);
            values.push(amount);
        }

        return { labels, values };
    },

    /**
     * Gets labels (1 to 30) and historical values for the past 30 days
     */
    getMonthlyData() {
        const labels = [];
        const values = [];
        const today = new Date();

        // Loop backward through the trailing 30 calendar days
        for (let i = 29; i >= 0; i--) {
            const targetDate = new Date();
            targetDate.setDate(today.getDate() - i);
            
            // Format labels as simple day numbers (e.g. "10", "11")
            labels.push(String(targetDate.getDate()));
            
            const key = this._formatKey(targetDate);
            const amount = parseInt(database.get('records', key) || 0, 10);
            values.push(amount);
        }

        return { labels, values };
    }
};
