module.exports = function(app, tableData, scriptData, dbconfig){
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


    var layout_mail = fs.readFileSync('./web/Layout/mail-join.html');
    
    var route = express.Router();
    route.post('/', function (req, res) {
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

        var connection = mysql.createConnection(dbconfig);
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
        
                //res.send('<script> window.location.href=".."; </script>');
            });
        });
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