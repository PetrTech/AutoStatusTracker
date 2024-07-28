// Keep only 3
var statusDisplayNames = {
    "ONLINE": "ONLINE",
    "UNEXPECTED BEHAVIOR": "UNEXPECTED BEHAVIOR",
    "OFFLINE": "OFFLINE"
};

var statusClassNames = {
    "ONLINE": "statusPositive",
    "UNEXPECTED BEHAVIOR": "statusQuestionable",
    "OFFLINE": "statusNegative"
};

// Keep only 4
var mainStatusNames = [
    "NOMINAL",
    "ACCEPTABLE", // If everything is ONLINE and there are one or more unexpected behaviors
    "PARTIAL OUTAGE",
    "BIG OUTAGE",
    "TOTAL OUTAGE"
]

function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var offlineServices = 0;
var totalServices = 0;
var unexpectedResults = 0;
async function searchChild(object, parent) {
    if (!object) { return; }

    // Search array
    if (Array.isArray(object)) {
        for (const item of object) {
            await searchChild(item, parent);
        }
        return;
    }

    if (object["type"] == null) { return; }

    switch (object["type"].toLowerCase()) {
        // Check category child targets
        case "category":
            if (object["targets"] == null) { return; }

            var el = document.createElement('div');
            el.classList.add("category");

            var children = document.createElement('div');
            children.style.marginLeft = "1rem";

            var span = document.createElement('span');
            span.innerHTML = object["displayName"];

            el.appendChild(span);
            parent.appendChild(el);
            parent.appendChild(children)

            el.addEventListener("click", function() {
                if(children.style.display == "none"){
                    children.style.display = "block";
                }else{
                    children.style.display = "none";
                }
            });

            await searchChild(object["targets"], children);
            break;

        // Add endpoint to check list & assign an identificator. If the check frequency/timeout is not set, set it to the default/global.
        case "endpoint":

            console.log("gg");

            var el = document.createElement('div');
            el.classList.add("endpoint");

            var span = document.createElement('span');
            span.innerHTML = object["displayName"];

            var statusSpan = document.createElement('span');
            statusSpan.innerHTML = statusDisplayNames[object["STATUS"]];
            statusSpan.classList.add("endpointStatus");
            statusSpan.classList.add(statusClassNames[object["STATUS"]]);
            statusSpan.id = object["assignedId"];

            el.appendChild(statusSpan)
            el.appendChild(span);
            parent.appendChild(el);

            if(object["STATUS"] == "OFFLINE"){
                offlineServices += 1;
            }
            if(object["STATUS"] == "UNEXPECTED BEHAVIOR"){
                unexpectedResults += 1;
            }

            totalServices += 1;

            break;
        
        // Unrecognized target types
        default:
            console.warn("UNRECOGNIZED OBJECT TYPE IN CONFIGURATION");
            return;
    }

    checkStatus(offlineServices, totalServices, unexpectedResults);
}

var endpoints = JSON.parse(httpGet(window.location.origin + "/getEndpoints"));
searchChild(endpoints.targets, document.getElementById("container"));

// AUTOMATIC TIMED UPDATES
async function updateEndpoints(){
    var offlineServices = 0;
    var totalServices = 0;
    var unexpectedServices = 0;

    var endpoints = JSON.parse(httpGet(window.location.origin + "/getStatus"));

    totalServices = endpoints.length;

    for(var endpoint of endpoints){
        if(endpoint["STATUS"] == "OFFLINE"){
            offlineServices += 1;
        }
        if(endpoint["STATUS"] == "UNEXPECTED BEHAVIOR"){
            unexpectedServices += 1;
        }

        var update = document.getElementById(endpoint["assignedId"]);
        update.innerHTML = statusDisplayNames[endpoint["STATUS"]];
        update.className = '';
        update.classList.add("endpointStatus");
        update.classList.add(statusClassNames[endpoint["STATUS"]]);
    }

    checkStatus(offlineServices, totalServices, unexpectedServices);
}

function checkStatus(offline, total, unexpected){
    var severity = 0;
    
    if(offline > 0){
        severity = 2
    }else if(offline >= Math.floor(total/2)){
        severity = 3
    }else if(offline >= total){
        severity = 4
    }

    if(severity == 0 && unexpected > 0){
        severity = 1;
    }

    document.getElementById("mainstatus").innerText = mainStatusNames[severity];
}

setInterval(async () => {
    await updateEndpoints();
}, 30 * 1000);
