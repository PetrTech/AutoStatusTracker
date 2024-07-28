var { tracking } = require('./tracker');

function stripData(data, configuration){
    var dataCopy = JSON.parse(JSON.stringify(data));

    if (configuration.stripDataSentToClient == true) {
        for (var endpoint in dataCopy) {
            delete dataCopy[endpoint].timeout;
            delete dataCopy[endpoint].negativeStatus;
            delete dataCopy[endpoint].type;
            delete dataCopy[endpoint].checkFrequency;
            delete dataCopy[endpoint].endpoint;
            delete dataCopy[endpoint].displayName;
        }
    }

    return dataCopy;
}

function stripLessData(configuration){
    var dataCopy = JSON.parse(JSON.stringify(configuration));

    delete dataCopy.hostIP;
    delete dataCopy.hostPort;
    delete dataCopy.stripDataSentToClient;

    if (configuration.stripDataSentToClient == true) {
        delete dataCopy.globalCheckFrequency;
        delete dataCopy.globalTimeout;
        delete dataCopy.failureThreshold;
        
        for (var endpoint in dataCopy) {
            delete dataCopy[endpoint].timeout;
            delete dataCopy[endpoint].negativeStatus;
            delete dataCopy[endpoint].checkFrequency;
            delete dataCopy[endpoint].endpoint;
        }
    }

    return dataCopy;
}

module.exports = function(app, configuration){
    app.get('/getStatus/:id', (req,res)=>{
        res.send(tracking[req.params.id]["STATUS"]);
    })

    app.get('/getStatus', (req, res)=>{
        var data = stripData(tracking, configuration);

        res.send(data);
    })

    app.get('/getEndpoints', (req, res)=>{
        var data = stripLessData(configuration);

        res.send(data);
    })
}
