module.exports = function(app, tableData, scriptData, connection){
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
    
    var route = express.Router();
    route.post('/', function (req, res) {
        var email = req.body.email;
        var pwd = req.body.pwd;
        var nickname = req.body.nickname;

        var index = 0;
        var pwd_salt = generateSalt();

        connection.query('SELECT * FROM user;', function (error, results, fields) {
            if (error) throw error;
            if (results != undefined && results.length > 0){
                index = results.length;
            }
            connection.query('INSERT INTO user VALUES ('+index+',"'+email+'","'+sha256(pwd+pwd_salt)+'","'+pwd_salt+'","'+nickname+'");', function (error, results, fields) {
                if (error) throw error;
            });
    
            res.send('<script> window.location.href=".."; </script>');
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