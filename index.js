const express = require('express');
const app = express();

const config = require('./config');
const trackerAPI = require('./trackerAPI');
const tracker = require('./tracker');

let configuration;

const tracking = [];

async function startServer() {
    // Read configuration
    try {
        configuration = await config.readConfig();
    } catch (error) {
        console.error("CONFIGURATION ERROR:", error);
        process.exit(1);
    }

    // Start server
    app.listen(configuration.hostPort, configuration.hostIP, () => {
        console.log(`SERVER RUNNING: ${configuration.hostIP}:${configuration.hostPort}`);
    });
}

(async () => {
    await startServer();
    await tracker.assignIds(configuration);
    
    console.log(`DETECTED ${tracker.tracking.length} ENDPOINTS IN CONFIGURATION`);

    tracker.track();

    app.use(express.static('public'));

    app.get("/", (req, res) => {
        res.sendFile("index.html");
    });

    trackerAPI(app, configuration);
})();
