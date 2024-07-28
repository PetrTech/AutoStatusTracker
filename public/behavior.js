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

function httpGet(url){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

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

            var span = document.createElement('span');
            span.innerHTML = object["displayName"];

            el.appendChild(span);
            parent.appendChild(el);

            await searchChild(object["targets"], el);
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
            break;
        
        // Unrecognized target types
        default:
            console.warn("UNRECOGNIZED OBJECT TYPE IN CONFIGURATION");
            return;
    }
}

var endpoints = JSON.parse(httpGet(window.location.origin + "/getEndpoints"));
searchChild(endpoints.targets, document.getElementById("container"));
