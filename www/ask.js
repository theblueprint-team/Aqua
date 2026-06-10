// ask.js
import { database } from './database.js';

export const askModule = {
    
    /**
     * Checks our database 'auth' group to see if a valid user key exists
     * @returns {boolean} True if username exists and isn't empty
     */
    checkUserExists() {
        const username = database.get('auth', 'user');
        return username !== null && username.trim() !== "";
    },

    /**
     * Generates and mounts a modal dialog directly into the DOM
     */
    showUserDialog(onSuccess) {
        // Create HTML template dynamically using a semantic <dialog> tag
        const dialog = document.createElement('dialog');
        dialog.id = 'username-dialog';


        dialog.innerHTML = `
            <div class="dialog">
                <h1>Welcome to Aquatic</h1>
                <label for="username-input" style="font-weight: bold;">what should we call you?</label>
                <input type="text" id="username-input" placeholder="wewe ndio sifuna?" style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
                <p id="dialog-error" style="color: red; font-size: 0.8rem; margin: 0; display: none;">Username cannot be empty!</p>
                <button id="dialog-submit" style="padding: 8px 12px; background: #6384ff; color: white; border: none; border-radius: 4px; cursor: pointer;">Submit</button>
            </div>
        `;

        // Inject modal into the document body
        document.body.appendChild(dialog);
        dialog.showModal(); // Standard browser feature to block interactions outside

        // Set up the button event listener
        const submitBtn = dialog.querySelector('#dialog-submit');
        const inputField = dialog.querySelector('#username-input');
        const errorText = dialog.querySelector('#dialog-error');

// Inside your askModule.showUserDialog() function, update the click listener:
submitBtn.addEventListener('click', () => {
    const usernameValue = inputField.value.trim();

    if (!usernameValue) {
        errorText.style.display = 'block';
        return;
    }

    database.set('auth', 'user', usernameValue);

    const greetingTag = document.getElementById('greeting');
     if (typeof onSuccess === 'function') {

                onSuccess(usernameValue);
     }

    // NEW: Reveal the main app structure now that we have a username
    const appWrapper = document.getElementById('app-wrapper');
    if (appWrapper) appWrapper.classList.remove('hidden');

    dialog.close();
    dialog.remove();
});

    }
};
