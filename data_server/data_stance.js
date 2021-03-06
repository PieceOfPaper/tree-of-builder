module.exports = function(app, serverData){
    var express = require('express');

    var dataModule = require('../my_modules/DataServerModule.js');

    var route = express.Router();
    route.get('/', function (req, res) {
        dataModule.RequestLog(req);
        var output = dataModule.DefaultQueryFilter(serverData['tableData']['stance'], req.query);

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(output));
    });

    return route;
  }