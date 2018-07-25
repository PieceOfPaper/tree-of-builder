var express = require('express');
var fs = require('fs');

var app = express();
var port = 3000;


app.use(express.static('web'));
 
app.get('/', function (req, response) {
    fs.readFile('index.html', function(error, data){
        if (error) {
            console.log(error);
            // 페이지를 찾을 수 없음
            // HTTP Status: 404 : NOT FOUND
            // Content Type: text/plain
            response.writeHead(404, {'Content-Type': 'text/html'});
         }else{	
            // 페이지를 찾음	  
            // HTTP Status: 200 : OK
            // Content Type: text/plain
            response.writeHead(200, {'Content-Type': 'text/html'});	
            
            // 파일을 읽어와서 responseBody 에 작성
            response.send(data);	
         }
    });
});

var skillPage = require('./web_script/web_skill')(app);
app.use('/Skill', skillPage);

var testPage = require('./web_script/web_test')(app);
app.use('/Test', testPage);



app.listen(port, function (){
  console.log("Connect " + port);
});