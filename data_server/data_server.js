module.exports = function(app, tableData){
    var express = require('express');
    
    var route = express.Router();
    route.get('/', function (req, res) {
    });

    var itemServer = require('./data_item')(app, tableData);
    app.use('/data/item', itemServer);

    var jobServer = require('./data_job')(app, tableData);
    app.use('/data/job', jobServer);

    var skillServer = require('./data_skill')(app, tableData);
    app.use('/data/skill', skillServer);

    var skilltreeServer = require('./data_skilltree')(app, tableData);
    app.use('/data/skilltree', skilltreeServer);

    var stanceServer = require('./data_stance')(app, tableData);
    app.use('/data/stance', stanceServer);

    var stanceServer = require('./data_monster')(app, tableData);
    app.use('/data/monster', stanceServer);

    var stanceServer = require('./data_quest')(app, tableData);
    app.use('/data/quest', stanceServer);
  
    return route;
  }