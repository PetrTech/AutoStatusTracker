var { tracking } = require('./tracker');

module.exports = function(app, configuration){
    app.get('/getStatus/:id', (req,res)=>{
        res.send(tracking[req.params.id]["STATUS"]);
    })
}
