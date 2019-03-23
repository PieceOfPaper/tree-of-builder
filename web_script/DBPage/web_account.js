module.exports = function(app, serverSetting, tableData, scriptData){
    var express = require('express');
    var fs = require('fs');
    var mysql = require('mysql');
    var bodyParser = require('body-parser');
    var md5 = require('md5');
    var sha256 = require('sha256');
    var nodemailer = require('nodemailer');

    var smtpTransport = nodemailer.createTransport({  
        service: 'Gmail',
        auth: { user: 'tree.of.builder', pass: '2009#*&&dltjdgml' }
    });

    var mailOptions = {  
        from: 'Tree of Builder <tree.of.builder@gmail.com>',
        to: 'the.paper@live.co.kr',
        subject: 'Nodemailer 테스트',
        text: '평문 보내기 테스트 '
    };

    // smtpTransport.sendMail(mailOptions, function(error, response){
    //     if (error){
    //         console.log(error);
    //     } else {
    //         console.log("Message sent : " + response.message);
    //     }
    //     smtpTransport.close();
    // });


    var layout = fs.readFileSync('./web/Layout/mail-join.html');
    var layout_mail = fs.readFileSync('./web/Layout/mail-join.html');
    var layout_message = fs.readFileSync('./web/Layout/message.html');
    
    var route = express.Router();

    route.post('/Login', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var email = req.body.email;
        var connection = mysql.createConnection(serverSetting['dbconfig']);
        connection.on('error', function() {});
        connection.connect();

        connection.query('SELECT * FROM user WHERE email="'+email+'";', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> alert("Not Exist User"); window.location = document.referrer; </script>');
            } else {
                var pwd = sha256(req.body.pwd + results[0].pwd_salt);
                if (pwd == results[0].pwd) {
                    req.session.login_userno = results[0].userno;
                    res.send('<script> window.location = document.referrer; </script>');
                } else {
                    res.send('<script> alert("Not Match Password"); window.location = document.referrer; </script>');
                }
            }
            connection.end();
        });

    });

    route.get('/Logout', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
        req.session.login_userno = undefined;
        res.send('<script> window.location = document.referrer; </script>');
    });

    route.post('/Join', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        var email = req.body.email;
        var pwd = req.body.pwd;
        var pwd_check = req.body.pwd_check;
        var nickname = req.body.nickname;

        if (pwd != pwd_check){
            res.send('<script> alert("Not Match Password"); window.history.back(); </script>');
        }

        var index = 0;
        var pwd_salt = generateSalt();

        var connection = mysql.createConnection(serverSetting['dbconfig']);
        connection.on('error', function() {});
        connection.connect();

        connection.query('SELECT * FROM user WHERE email="'+email+'";', function (error, results, fields) {
            if (results != undefined && results.length > 0){
                res.send('<script> alert("Already exits user"); window.history.back(); </script>');
                connection.end();
                return;
            }
            connection.query('SELECT * FROM user;', function (error, results, fields) {
                if (error) throw error;
                if (results != undefined && results.length > 0){
                    index = results.length;
                }
                connection.query('INSERT INTO user (userno,email,pwd,pwd_salt,nickname) VALUES ('+index+',"'+email+'","'+sha256(pwd+pwd_salt)+'","'+pwd_salt+'","'+nickname+'");', function (error, results, fields) {
                    if (error) throw error;
                    res.send('<script> window.location.href="../ReqJoinMail?email='+email+'"; </script>');
                    connection.end();
                });
        
                //res.send('<script> window.location = document.referrer; </script>');
            });
        });
    });

    route.get('/EmailAuth', function (req, res) {
        if (req.query.id != undefined && req.query.id.length > 0){
            console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
            var connection = mysql.createConnection(serverSetting['dbconfig']);
            connection.on('error', function() {});
            connection.connect();
            connection.query('UPDATE user SET mail_auth="A" WHERE mail_auth="'+req.query.id+'";', function (error, results, fields) {
                if (error) throw error;
                if (results == undefined || results.length == 0){
                    res.send('<script> alert("Authentication Fail."); window.location.href=".."; </script>');
                    connection.end();
                    return;
                }
                res.send('<script> alert("Authentication Success."); window.location.href=".."; </script>');
                connection.end();
                return;
            });
        }
        //res.send('not send');
    });

    function generateSalt(){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-=_+~!@#$%^&*()[];,./{}:<>?";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    return route;
}