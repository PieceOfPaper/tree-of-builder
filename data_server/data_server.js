module.exports = function(app, serverSetting, tableData){
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

    var abilityServer = require('./data_ability')(app, tableData);
    app.use('/data/ability', abilityServer);

    var stanceServer = require('./data_stance')(app, tableData);
    app.use('/data/stance', stanceServer);

    var cooldownServer = require('./data_cooldown')(app, tableData);
    app.use('/data/cooldown', cooldownServer);

    var stanceServer = require('./data_buff')(app, tableData);
    app.use('/data/buff', stanceServer);

    var stanceServer = require('./data_monster')(app, tableData);
    app.use('/data/monster', stanceServer);

    var stanceServer = require('./data_quest')(app, tableData);
    app.use('/data/quest', stanceServer);

    var mapServer = require('./data_map')(app, tableData);
    app.use('/data/map', mapServer);

    var dialogServer = require('./data_dialog')(app, tableData);
    app.use('/data/dialog', dialogServer);

    var indunServer = require('./data_indun')(app, tableData);
    app.use('/data/indun', indunServer);

    var collectionServer = require('./data_collection')(app, tableData);
    app.use('/data/collection', collectionServer);
  
    return route;
  }