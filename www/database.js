// database.js

// The main database engine object
export const database = {
    
    /**
     * Internal helper to fetch a specific group array from localStorage
     * @param {string} groupName - The category/table name
     * @returns {Array} List of key-value pair objects
     */
    _getGroup(groupName) {
        const data = localStorage.getItem(groupName);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Saves a key-value record into a specific group
     * SQL Equivalent: INSERT INTO groupName (key, value) VALUES (key, value)
     * @param {string} groupName - The group category
     * @param {string} key - The unique identifier inside the group
     * @param {*} value - The data payload
     */
    set(groupName, key, value) {
        const group = this._getGroup(groupName);
        
        // Check if key already exists to update it, otherwise insert new
        const existingRecordIndex = group.findIndex(record => record.key === key);
        
        if (existingRecordIndex !== -1) {
            group[existingRecordIndex].value = value; // Update
        } else {
            group.push({ key, value }); // Insert
        }
        
        // Commit changes back to localStorage
        localStorage.setItem(groupName, JSON.stringify(group));
    },

    /**
     * Retrieves a value by its key from a specific group
     * SQL Equivalent: SELECT value FROM groupName WHERE key = key LIMIT 1
     * @param {string} groupName - The group category
     * @param {string} key - The unique identifier
     * @returns {*} The stored value, or null if not found
     */
    get(groupName, key) {
        const group = this._getGroup(groupName);
        const record = group.find(record => record.key === key);
        return record ? record.value : null;
    }
};
