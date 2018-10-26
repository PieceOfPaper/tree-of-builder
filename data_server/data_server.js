module.exports = function(app, tableData){
    var express = require('express');
    
    var route = express.Router();
    route.get('/', function (req, res) {
    });

    var jobServer = require('./data_job')(app, tableData);
    app.use('/data/job', jobServer);
  
    return route;
  }