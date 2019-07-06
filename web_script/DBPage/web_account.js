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
        auth: { user: 'tree.of.builder', pass: 'atsHEfyJzs2MdRv' }
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
    var layout_account = fs.readFileSync('./web/Layout/account.html');
    
    var route = express.Router();

    route.get('/', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl);
        if (req.session.login_userno == undefined) {
            res.send('<script> window.location.href=".."; </script>');
            return;
        }
        if (serverSetting['dbconfig'] == undefined){
            res.send('<script> window.location.href=".."; </script>');
            console.warn('db-config undefined.');
            return;
        }

        var userno = req.session.login_userno;

        var connection = mysql.createConnection(serverSetting['dbconfig']);
        connection.on('error', function() {});
        connection.connect();

        connection.query('SELECT * FROM user WHERE userno='+userno+';', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> window.location.href=".."; </script>');
            } else {
                var output = layout_account.toString();
                var dataSetScriptString = '<script>';
                for (param in results[0]){
                    if (param=='pwd') continue;
                    if (param=='email' || param=='permission'){
                        dataSetScriptString += 'if(document.getElementById("'+param+'")!=undefined) document.getElementById("'+param+'").innerText="'+results[0][param]+'";\n';
                        continue;
                    }
                    dataSetScriptString += 'if(document.getElementById("'+param+'")!=undefined) document.getElementById("'+param+'").value="'+results[0][param]+'";\n';
                }
                dataSetScriptString += '</script>';
                output = output.replace(/%DataSetScriptString%/g, dataSetScriptString);
                res.send(output);
            }
            connection.end();
        });
    });

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
            return;
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
        if (serverSetting['dbconfig'] == undefined){
            res.send('<script> window.location.href=".."; </script>');
            console.warn('db-config undefined.');
            return;
        }
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

    route.post('/ReqUpdate', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        if (req.session.login_userno == undefined){
            res.send('<script> alert("Update Fail."); window.history.back(); </script>');
            return;
        }

        var userno = req.session.login_userno;

        var updateList = [];
        var isUpdated = false;
        if (req.body.pwd!=undefined && req.body.pwd_check!=undefined && 
            req.body.pwd==req.body.pwd_check && 
            req.body.pwd.length>0){
            var pwd_salt = generateSalt();
            updateList['pwd'] = sha256(req.body.pwd+pwd_salt);
            updateList['pwd_salt'] = pwd_salt;
            isUpdated = true;
        }
        if (req.body.nickname!=undefined){
            updateList['nickname'] = req.body.nickname;
            isUpdated = true;
        }

        if (isUpdated == false){
            res.send('<script> alert("Update Empty."); window.history.back(); </script>');
            return;
        }
        var setstring = '';
        var strcount = 0;
        for (param in updateList){
            if (strcount>0) setstring += ' , '
            setstring += param+'="'+updateList[param]+'"';
            strcount ++;
        }

        var connection = mysql.createConnection(serverSetting['dbconfig']);
        connection.on('error', function() {});
        connection.connect();
        connection.query('UPDATE user SET '+setstring+' WHERE userno="'+userno+'";', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> alert("Update Fail."); window.history.back(); </script>');
                connection.end();
                return;
            }
            res.send('<script> alert("Update Success."); window.location = document.referrer; </script>');
            connection.end();
            return;
        });

    });

    route.post('/ReqResetPwd', function (req, res) {
        console.log((new Date()).toISOString()+' [ReqDBLog] '+req.ip+' '+req.originalUrl+' '+JSON.stringify(req.body));
        if (req.body.email == undefined){
            res.send('<script> alert("Pwd Reset Fail."); window.history.back(); </script>');
            return;
        }
        if (serverSetting['dbconfig'] == undefined){
            res.send('<script> window.location.href=".."; </script>');
            console.warn('db-config undefined.');
            return;
        }

        var realPwd = generateSalt();
        var pwd_salt = generateSalt();
        var pwd = sha256(realPwd+pwd_salt);

        var connection = mysql.createConnection(serverSetting['dbconfig']);
        connection.on('error', function() {});
        connection.connect();
        connection.query('UPDATE user SET pwd="'+pwd+'" , pwd_salt="'+pwd_salt+'" WHERE email="'+req.body.email+'";', function (error, results, fields) {
            if (error) throw error;
            if (results == undefined || results.length == 0){
                res.send('<script> alert("Pwd Reset Fail."); window.history.back(); </script>');
                connection.end();
                return;
            }
            mailOptions.subject = '[Tree of Builder] New Password';
            //res.send('<script> alert("Pwd Reset Success."); window.location = document.referrer; </script>');
            mailOptions.to = req.body.email;
            //mailOptions.html = layout_mail.toString().replace(/%AddressString%/g,'http://'+req.headers.host+'/Account/EmailAuth?id='+auth);
            mailOptions.html = '<p>New Password : ' + realPwd+'</p>';
            smtpTransport.sendMail(mailOptions, function(error, response){
                if (error){
                    console.log(error);
                } else {
                    console.log("Message sent : " + response.message);
                }
                smtpTransport.close();
            });
            res.send(layout_message.toString().replace(/%Message%/g, 'Sent Mail. Check your email').replace(/style.css/g, '../style.css'));
            connection.end();
            return;
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