module.exports = function(app, serverSetting, serverData){
    var express = require('express');
    
    var route = express.Router();
    route.get('/', function (req, res) {
    });

    var itemServer = require('./data_item')(app, serverData);
    app.use('/data/item', itemServer);

    var jobServer = require('./data_job')(app, serverData);
    app.use('/data/job', jobServer);

    var skillServer = require('./data_skill')(app, serverData);
    app.use('/data/skill', skillServer);

    var skilltreeServer = require('./data_skilltree')(app, serverData);
    app.use('/data/skilltree', skilltreeServer);

    var abilityServer = require('./data_ability')(app, serverData);
    app.use('/data/ability', abilityServer);

    var stanceServer = require('./data_stance')(app, serverData);
    app.use('/data/stance', stanceServer);

    var cooldownServer = require('./data_cooldown')(app, serverData);
    app.use('/data/cooldown', cooldownServer);

    var stanceServer = require('./data_buff')(app, serverData);
    app.use('/data/buff', stanceServer);

    var stanceServer = require('./data_monster')(app, serverData);
    app.use('/data/monster', stanceServer);

    var stanceServer = require('./data_quest')(app, serverData);
    app.use('/data/quest', stanceServer);

    var mapServer = require('./data_map')(app, serverData);
    app.use('/data/map', mapServer);

    var dialogServer = require('./data_dialog')(app, serverData);
    app.use('/data/dialog', dialogServer);

    var indunServer = require('./data_indun')(app, serverData);
    app.use('/data/indun', indunServer);

    var collectionServer = require('./data_collection')(app, serverData);
    app.use('/data/collection', collectionServer);
  
    return route;
  }