module.exports = function(app, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    //var url = require('url');
    var tos = require('../my_modules/TosModule');
    
    var route = express.Router();
  
    route.get('/', function (request, response) {
      var output = '';
      response.send(output);
    });
  
    function monsterDetailPage(index, request, response) {
      var output = '';
      response.send(output);
    }
  
    return route;
  }