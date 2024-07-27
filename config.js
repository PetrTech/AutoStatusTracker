const fs = require('fs/promises');

module.exports = {
    readConfig: async function() { // Reads trackerConfig.json and returns the data
        try {
            const data = await fs.readFile("./trackerConfig.json", "utf8");
            console.log("Configuration loaded successfully");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading config file:", error);
            throw error;
        }
    }
}
