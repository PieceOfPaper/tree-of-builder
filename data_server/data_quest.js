module.exports = function(app, tableData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        var output = dataModule.DefaultQueryFilter(tableData['questprogresscheck'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    return route;
  }