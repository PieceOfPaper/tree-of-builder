module.exports = function(app, dbclient){
    var express = require('express');
    
    var route = express.Router();
    route.get('/', function (req, res) {
    });

    return route;
}