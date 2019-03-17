module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var mysqls = require('sync-mysql');
    var bodyParser = require('body-parser');
    var moment = require('moment');
    var nodemailer = require('nodemailer');

    var smtpTransport = nodemailer.createTransport({  
        service: 'Gmail',
        auth: { user: 'tree.of.builder', pass: '2009#*&&dltjdgml' }
    });

    var mailOptions = {  
        from: 'Tree of Builder <tree.of.builder@gmail.com>',
        to: 'the.paper@live.co.kr',
        //subject: '[Tree of Builder] Email Authentication.',
        //text: '평문 보내기 테스트 '
    };

    //state
    //0 - normal
    //1 - deleted
    
    var route = express.Router();
    route.post('/ReqWrite', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var userno = req.body.userno;
        var value = req.body.value;

        if (value.length > 100){
            value = value.substring(0,100);
        }

        var connection = new mysqls(serverSetting['dbconfig']);
        var index = 0;

        var shortboard_results = connection.query('SELECT * FROM board_short;');
        if (shortboard_results!=undefined && shortboard_results.length>0){
            index = shortboard_results[shortboard_results.length-1].idx + 1;
        }
        var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        var insert_results = connection.query('INSERT INTO board_short (idx,userno,time,state,value) VALUES ('+index+','+userno+',"'+mysqlTimestamp+'",'+0+',"'+value+'");');
        res.send('<script> window.location = document.referrer; </script>');
    });

    route.post('/ReqDelete', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var index = req.body.index;
        var connection = new mysqls(serverSetting['dbconfig']);
        var target_results = connection.query('SELECT * FROM board_short WHERE idx='+index+';');
        var updated_results = connection.query('UPDATE board_short SET state=1 WHERE idx='+index+';');
        res.send('<script> alert("Delete Success. message:'+target_results[0].value+'"); window.location = document.referrer; </script>');
    });

    route.post('/ReqReport', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var index = req.body.index;
        var connection = new mysqls(serverSetting['dbconfig']);

        var user_results = connection.query('SELECT * FROM user WHERE userno='+req.session.login_userno+';');
        var target_results = connection.query('SELECT * FROM board_short WHERE idx='+index+';');

        var mailbody = '';
        if (user_results!=undefined && user_results.length>0){
            mailbody += '<h1>Reporter</h1>';
            mailbody += '<p>'+JSON.stringify(user_results[0])+'</p>';
            mailbody += '<br>';
        }
        if (target_results!=undefined && target_results.length>0){
            mailbody += '<h1>Target</h1>';
            mailbody += '<p>'+JSON.stringify(target_results[0])+'</p>';
            mailbody += '<br>';
        }
        
        mailOptions.subject = '[Tree of Builder] Report - Short Board';
        mailOptions.to = mailOptions.from;
        mailOptions.html = mailbody;
        smtpTransport.sendMail(mailOptions, function(error, response){
            if (error){
                console.log(error);
            } else {
                console.log("Message sent : " + response.message);
            }
            smtpTransport.close();
        });

        res.send('<script> alert("Report Success. message:'+target_results[0].value+'"); window.location = document.referrer; </script>');
    });

    return route;
}