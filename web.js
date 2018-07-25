var express = require('express');
var fs = require('fs');

var csv = require('csv-parser');

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
  res.send('Tree of Builder')
});

var configTable = [];
fs.createReadStream('web/Test/config.ies')
  .pipe(csv())
  .on('data', function (data) {
    //console.log('ClassID: %s DefNumValue: %s ClassName: %s Type: %s', data.ClassID, data.DefNumValue, data.ClassName, data.Type);
    configTable.push(data);
  });

app.get('/Test_CSV', function (req, response) {
  var output = '<h1>Test SCV</h1>';
  for(var i = 0; i < configTable.length; i ++) {
    //console.log('ClassID: %s ClassName: %s', item.ClassID, item.ClassName);
    output += '<p>[' + configTable[i].ClassID + '] ' + configTable[i].ClassName + '</p>';
  }
    //response.writeHead(200, {'Content-Type': 'text/html'});	
    response.send(output);
    
});

// TO DO : 라우트 쪼개서 작업하자
// https://opentutorials.org/course/2136/12445
// web에 페이지에 대한 정보들을 넣어두고, 불러와서 사용한다.
// 쪼개진 라우터들은 web_script에 넣어둔다.


app.listen(port, function (){
  console.log("Connect " + port);
});