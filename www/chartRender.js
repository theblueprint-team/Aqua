// chartRender.js
import { chartDataModule } from './chartData.js';

let currentView = 'weekly';

export const chartRenderModule = {
    init() {
        const container = document.getElementById('chart-container');
        if (!container) return;

        // 1. Clear out the old <canvas> element entirely
        container.innerHTML = '';

        // 2. Create a clean wrapper for our custom CSS bars
        const graphWrapper = document.createElement('div');
        graphWrapper.id = 'custom-graph-wrapper';
        graphWrapper.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            height: 120px;
            padding: 10px 0;
        `;

        // 3. Create the toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'reports-btn';
        toggleBtn.textContent = 'weekly reports';
        toggleBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 0.85rem;
            cursor: pointer;
            align-self: flex-end;
            margin-top: 10px;
        `;

        container.appendChild(graphWrapper);
        container.appendChild(toggleBtn);

        // 4. Listen for toggle clicks
        toggleBtn.addEventListener('click', () => this.toggleView());

        // 5. Initial render pass
        this.renderBars();
    },

    renderBars() {
        const wrapper = document.getElementById('custom-graph-wrapper');
        const toggleBtn = document.getElementById('reports-btn');
        if (!wrapper) return;

        wrapper.innerHTML = '';

        // Fetch numbers from your data module
        const dataSet = currentView === 'weekly' ? chartDataModule.getWeeklyData() : chartDataModule.getMonthlyData();
        
        // Find highest value logged to scale heights correctly (Target 1500ml ceiling)
        const maxLimit = Math.max(1500, ...dataSet.values);

        dataSet.labels.forEach((label, index) => {
            const value = dataSet.values[index];
            const percentageHeight = (value / maxLimit) * 100;

            const barContainer = document.createElement('div');
            barContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                height: 100%;
                justify-content: flex-end;
            `;

            // The actual blue bar
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: ${currentView === 'weekly' ? '65%' : '40%'};
                height: ${percentageHeight}%;
                background: #286CFF;
                border-radius: 3px 3px 0 0;
                transition: height 0.3s ease;
                min-height: ${value > 0 ? '4px' : '0px'};
            `;

            // Day label below bar
            const labelText = document.createElement('span');
            labelText.textContent = label;
            labelText.style.cssText = `
                font-size: ${currentView === 'weekly' ? '0.7rem' : '0.55rem'};
                color: #ffffff;
                margin-top: 6px;
            `;

            barContainer.appendChild(bar);
            barContainer.appendChild(labelText);
            wrapper.appendChild(barContainer);
        });

        toggleBtn.textContent = `${currentView} reports`;
    },

    toggleView() {
        currentView = currentView === 'weekly' ? 'monthly' : 'weekly';
        this.renderBars();
    }
};
