// script.js
import { askModule } from './ask.js';
import { database } from './database.js';
import { timeModule } from './time.js';
import { drinkMenuModule } from './drinkMenu.js';
import { updateModule } from './update.js'; // Import update module
import { chartRenderModule } from './chartRender.js';   

function applyDynamicGreeting(username) {
    const greetingTag = document.getElementById('greeting');
    if (greetingTag) {
        const timePhrase = timeModule.getGreetingPhrase();
        greetingTag.textContent = `${timePhrase} ${username}`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    
    // Connect the drink selection callback directly into the database system
    drinkMenuModule.init((selectedMl) => {
        updateModule.logWaterIntake(selectedMl);
    });

    if (!askModule.checkUserExists()) {
        askModule.showUserDialog((newUsername) => {
            applyDynamicGreeting(newUsername);
            // Render baseline screen zeros for new installations
            updateModule.renderUI();
        });
    } else {
        const savedUser = database.get('auth', 'user');
        applyDynamicGreeting(savedUser);
        
        const appWrapper = document.getElementById('app-wrapper');
        if (appWrapper) appWrapper.classList.remove('hidden');
        
        // Render historical / ongoing progress data states on return visits
        updateModule.renderUI();
    }
    chartRenderModule.init();
});
