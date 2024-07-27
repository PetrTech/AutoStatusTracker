var utils = require('./utils');

var tracking = [];

async function searchChild(object, configuration) {
    if (!object) { return; }

    // Search array
    if (Array.isArray(object)) {
        for (const item of object) {
            await searchChild(item, configuration);
        }
        return;
    }

    if (object["type"] == null) { return; }

    switch (object["type"].toLowerCase()) {
        // Check category child targets
        case "category":
            if (object["targets"] == null) { return; }

            await searchChild(object["targets"], configuration);
            break;

        // Add endpoint to check list & assign an identificator. If the check frequency/timeout is not set, set it to the default/global.
        case "endpoint":
            tracking.push(object);

            tracking[tracking.length-1]["STATUS"] = "Unknown";

            if(object["checkFrequency"] == null){
                object["checkFrequency"] = configuration.globalCheckFrequency;
            }

            if(object["timeout"] == null){
                object["timeout"] = configuration.globalTimeout;
            }

            object["assignedId"] = tracking.length - 1;
            break;
        
        // Unrecognized target types
        default:
            console.warn("UNRECOGNIZED OBJECT TYPE IN CONFIGURATION");
            return;
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str)
  }

function compareData(data, endpoint){
    var positive = true

    // Check for bad statuses
    // Any always sets an UNEXPECTED BEHAVIOR status if the status != 200
    // None OR unrecognized always sets it to ONLINE if the request doesn't time out
    if(typeof endpoint["negativeStatus"] === "string"){
        switch(endpoint["negativeStatus"].toLowerCase()){
            case "any":
                if(data < 200 || data >= 300){
                    positive = false;
                }
                break;
    
            default:
                positive = true;
                break;
        }
    }else{
        for(var status of endpoint["negativeStatus"]){
            console.log(status);
            console.log(data);

            if(data == status){
                positive = false;
            }
        }
    }

    return positive;
}

// Call the endpoint every few seconds. If the request times out, the service is assumed to be offline. Any unexpected codes will be logged as "UNEXPECTED BEHAVIOR".
async function updateStatus(endpoint){
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), endpoint["timeout"] * 1000)
    );

    try {
        const response = await Promise.race([
            fetch(endpoint["endpoint"]),
            timeoutPromise
        ]);

        if (!response.ok) {
            throw new Error(response.status);
        }

        // Process the response
        var data = response.status;
        
        if(compareData(data, endpoint)){
            endpoint["STATUS"] = "ONLINE";
        }else{
            endpoint["STATUS"] = "UNEXPECTED BEHAVIOR";
        }
    } catch (error) {
        endpoint["STATUS"] = "OFFLINE";
    }
}

async function track() {
    for (const endpoint of tracking) {
        await updateStatus(endpoint);

        setInterval(async () => {
            await updateStatus(endpoint);
        }, endpoint.checkFrequency * 1000);
    }
}

module.exports = {
    assignIds: async function(configuration) { // Assign tracking IDs to each endpoint for easier management
        await searchChild(configuration.targets, configuration);
    },
    track,
    tracking
}