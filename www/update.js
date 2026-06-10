// update.js
import { database } from './database.js';
import { chartRenderModule } from './chartRender.js';

export const updateModule = {
    // Encode the global daily hydration target
    GOAL_ML: 1500,

    /**
     * Internal helper to generate a standardized date key string for any given Date object
     * @param {Date} dateObj - The specific date to format
     * @returns {string} Date formatted as YYYY-MM-DD
     */
    _formatDateKey(dateObj) {
        return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    },

    /**
     * Appends newly consumed liquid volume to the data registry and triggers a UI layout re-render pass
     * @param {number} mlValue - Fluid volume logged in milliliters
     */
    logWaterIntake(mlValue) {
        const todayKey = this._formatDateKey(new Date());
        
        // Fetch existing history values or fallback to baseline zero if first record
        const currentStored = database.get('records', todayKey);
        const baselineAmount = currentStored ? parseInt(currentStored, 10) : 0;
        
        const updatedTotal = baselineAmount + mlValue;
        
        // Save numerical values directly down to our localStorage group schema structure
        database.set('records', todayKey, updatedTotal);
        
        // Propagate system calculations up to screen view nodes
        this.renderUI();
    },

    /**
     * Reads state layers out of storage configurations and synchronizes visible browser nodes
     */
    renderUI() {
        const todayKey = this._formatDateKey(new Date());
        const currentIntake = parseInt(database.get('records', todayKey) || 0, 10);
        
        // 1. Calculate percentage bounds clamped between 0 and 100
        let percentage = Math.round((currentIntake / this.GOAL_ML) * 100);
        if (percentage > 100) percentage = 100;

        // 2. Adjust remaining liquid balances
        const remaining = Math.max(0, this.GOAL_ML - currentIntake);

        // 3. Render raw numbers down into the active text fields
        const pctText = document.getElementById('percentage-text');
        const volText = document.getElementById('volume-text');
        const remText = document.getElementById('remaining-text');

        if (pctText) pctText.textContent = `${percentage}%`;
        if (volText) volText.textContent = `${currentIntake}ml`;
        if (remText) remText.textContent = `remaining ${remaining}ml`;

        // 4. Update the SVG Circular Progress Vector Ring Line Elements
        const circle = document.getElementById('progress-circle');
        if (circle) {
            const totalPerimeter = 848.23;
            
            // Wipe out original zero-state dummy sliver class rules if user has active logs
            if (percentage > 0) {
                circle.classList.remove('initial-sliver');
            } else {
                circle.classList.add('initial-sliver');
            }

            const offset = totalPerimeter - ((percentage / 100) * totalPerimeter);
            circle.style.strokeDashoffset = offset;
        }

        // 5. Scan and update all weekly streak dots
        this._updateWeeklyStreakUI();

        chartRenderModule.renderBars();
    },

    /**
     * Look up historical database logs for every day of the current week and style dots accordingly
     */
    _updateWeeklyStreakUI() {
        // Map native JavaScript indexes (0=Sun, 1=Mon, ..., 6=Sat) to match HTML list order
        const htmlDayOrder = ["SUN", "MON", "TUE", "WEN", "TH", "FRI", "SAT"];
        
        const today = new Date();
        const currentDayIndex = today.getDay(); // 0-6

        // Target all the .day-item containers from the DOM
        const dayNodes = document.querySelectorAll('.day-item');
        
        dayNodes.forEach(node => {
            const rawText = node.textContent || "";
            const cleanDayName = rawText.replace('●', '').trim();
            const spanDot = node.querySelector('span');

            if (!spanDot) return;

            // Find where this specific HTML day node fits inside our week index map
            const targetDayIndex = htmlDayOrder.indexOf(cleanDayName);
            if (targetDayIndex === -1) return;

            // Calculate how many days backwards or forwards this node is relative to today
            const dayDifference = targetDayIndex - currentDayIndex;
            
            // Generate the true historical calendar date for this specific dot
            const calculatedDate = new Date();
            calculatedDate.setDate(today.getDate() + dayDifference);
            
            const databaseKey = this._formatDateKey(calculatedDate);

            // Fetch what the user drank on that specific calendar date
            const pastIntake = parseInt(database.get('records', databaseKey) || 0, 10);

            // Color coding evaluation block
            if (pastIntake >= this.GOAL_ML) {
                spanDot.style.color = "#286CFF"; // Full Deep Blue (Goal met!)
            } else if (pastIntake > 0) {
                spanDot.style.color = "#6584FF"; // Light Progress Blue (Started but incomplete)
            } else {
                spanDot.style.color = "#ffffff"; // Default White (No water recorded)
            }
        });
    }
};
