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
        subject: '[Tree of Builder] Email Authentication.',
        //text: '평문 보내기 테스트 '
    };


    var layout = fs.readFileSync('./web/Layout/mail-join.html');
    var layout_mail = fs.readFileSync('./web/Layout/mail-join.html');
    var layout_message = fs.readFileSync('./web/Layout/message.html');
    
    var route = express.Router();
    route.get('/', function (req, res) {
        if (req.query.email != undefined && req.query.email.length > 0){
            console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
            connection.query('SELECT * FROM user WHERE email="'+req.query.email+'";', function (error, results, fields) {
                if (results == undefined || results.length == 0){
                    res.send(layout_message.toString().replace(/%Message%/g, 'Not found Email'));
                    return;
                }
                if (results[0].mail_auth == 'A'){
                    res.send(layout_message.toString().replace(/%Message%/g, 'Already Authenticated.'));
                    return;
                }
                var auth = sha256(req.query.email+generateSalt());
                connection.query('UPDATE user SET mail_auth="'+auth+'" WHERE email="'+req.query.email+'";', function (error, results, fields) {
                    if (error) throw error;
                });
                
                mailOptions.to = req.query.email;
                //mailOptions.html = layout_mail.toString().replace(/%AddressString%/g,'http://'+req.headers.host+'/EmailAuth?id='+auth);
                mailOptions.html = '<a href="http://'+req.headers.host+'/EmailAuth?id='+auth+'">http://'+req.headers.host+'/EmailAuth?id='+auth+'</a>';
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if (error){
                        console.log(error);
                    } else {
                        console.log("Message sent : " + response.message);
                    }
                    smtpTransport.close();
                });
                res.send(layout_message.toString().replace(/%Message%/g, 'Sent Mail. Check your email'));
                return;
            });
        }
        //res.send(layout_message.toString().replace(/%Message%/g, 'Error'));
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