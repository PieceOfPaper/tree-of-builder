module.exports = function(app, tableData){
    var express = require('express');
    
    var route = express.Router();
    route.get('/', function (req, res) {
    });

    var jobServer = require('./data_job')(app, tableData);
    app.use('/data/job', jobServer);

    var skillServer = require('./data_skill')(app, tableData);
    app.use('/data/skill', skillServer);

    var skilltreeServer = require('./data_skilltree')(app, tableData);
    app.use('/data/skilltree', skilltreeServer);
  
    return route;
  }