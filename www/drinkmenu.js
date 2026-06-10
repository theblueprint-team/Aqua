// drinkMenu.js

export const drinkMenuModule = {
    /**
     * Initializes the drink selection screen flow event bindings
     * @param {Function} onVolumeSelected - Callback returning the milliliter number picked
     */
    init(onVolumeSelected) {
        const actionBtn = document.querySelector('.action-btn');
        if (!actionBtn) return;

        actionBtn.addEventListener('click', () => {
            // 1. Target key display rows inside main
            const tracker = document.getElementById('tracker-container');
            const reports = document.getElementById('reports');
            const mainElement = document.querySelector('main');

            if (!tracker || !reports || !mainElement) return;

            // 2. Hide existing main workspace rows
            tracker.style.display = 'none';
            reports.style.display = 'none';

            // 3. Prevent duplicate menus from stacking if user double clicks
            const existingMenu = document.getElementById('source-menu-container');
            if (existingMenu) existingMenu.remove();

            // 4. Generate option selection layout container
            const menuContainer = document.createElement('div');
            menuContainer.id = 'source-menu-container';
            menuContainer.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 15px;
                padding: 20px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 12px;
                margin-top: 20px;
            `;

            menuContainer.innerHTML = `
                <p style="text-align: center; margin-bottom: 5px; font-weight: bold;">Select Drinking Source</p>
                <button class="source-opt-btn" data-ml="250" style="padding: 12px; background: #6384ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Cup (250ml)
                </button>
                <button class="source-opt-btn" data-ml="500" style="padding: 12px; background: #6384ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Small Bottle (500ml)
                </button>
                <button class="source-opt-btn" data-ml="750" style="padding: 12px; background: #6384ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Large Bottle (750ml)
                </button>
                <button id="cancel-menu-btn" style="padding: 10px; background: transparent; color: white; border: 1px solid white; border-radius: 8px; cursor: pointer; font-size: 0.9rem; margin-top: 5px;">
                    Cancel
                </button>
            `;

            // Append directly inside the scrollable main wrapper space
            mainElement.appendChild(menuContainer);

            // 5. Handle volume option clicks
            menuContainer.querySelectorAll('.source-opt-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const mlValue = parseInt(btn.getAttribute('data-ml'), 10);
                    
                    // Fire callback function tracking payload
                    if (typeof onVolumeSelected === 'function') {
                        onVolumeSelected(mlValue);
                    }

                    // Reset interface elements view back to original main layouts
                    menuContainer.remove();
                    tracker.style.display = 'flex';
                    reports.style.display = 'flex';
                });
            });

            // 6. Handle cancel button click close track
            document.getElementById('cancel-menu-btn').addEventListener('click', () => {
                menuContainer.remove();
                tracker.style.display = 'flex';
                reports.style.display = 'flex';
            });
        });
    }
};
