module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var mysqls = require('sync-mysql');
    var bodyParser = require('body-parser');
    var moment = require('moment');
    var nodemailer = require('nodemailer');

    var dbLayout = require('../../my_modules/DBLayoutModule');


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
        var page = req.body.page;
        var page_arg1 = req.body.page_arg1;
        var page_arg2 = Number(req.body.page_arg2);

        var connSync = mysql.createConnection(serverSetting['dbconfig']);
        connSync.on('error', function() {});
        connSync.connect();
        connSync.query('SELECT * FROM user WHERE userno="'+userno+'";', function (error, results, fields) {
            if (error) {
                console.log('error ' + error);
                return;
            }
            connSync.end();

            if (results == undefined || results.length == 0){
                res.send('<script> alert("Not Exist User"); window.location = document.referrer; </script>');
                return;
            }

            if (results[0].permission < dbLayout.COMMENT_WRITE_PERMISSION()){
                res.send('<script> alert("not enough permissions"); window.location = document.referrer; </script>');
                return;
            }

            if (value.length > 100){
                value = value.substring(0,100);
            }

            var connection = new mysqls(serverSetting['dbconfig']);
            var index = 0;

            var comment_results = connection.query('SELECT * FROM comment;');
            if (comment_results!=undefined && comment_results.length>0){
                index = comment_results[comment_results.length-1].idx + 1;
            }
            var mysqlTimestamp = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            var insert_results = connection.query('INSERT INTO comment (idx,userno,time,state,value,page,page_arg1,page_arg2) VALUES ('+index+','+userno+',"'+mysqlTimestamp+'",'+0+',"'+value+'","'+page+'","'+page_arg1+'",'+page_arg2+');');
            res.send('<script> window.location = document.referrer; </script>');
        });
    });

    route.post('/ReqDelete', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var index = req.body.index;
        var connection = new mysqls(serverSetting['dbconfig']);
        var target_results = connection.query('SELECT * FROM comment WHERE idx='+index+';');
        var updated_results = connection.query('UPDATE comment SET state=1 WHERE idx='+index+';');
        res.send('<script> alert("Delete Success. message:'+target_results[0].value+'"); window.location = document.referrer; </script>');
    });

    route.post('/ReqReport', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var index = req.body.index;
        var connection = new mysqls(serverSetting['dbconfig']);

        var user_results = connection.query('SELECT * FROM user WHERE userno='+req.session.login_userno+';');
        var target_results = connection.query('SELECT * FROM comment WHERE idx='+index+';');

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
        
        mailOptions.subject = '[Tree of Builder] Report - Comment';
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