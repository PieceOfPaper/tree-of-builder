var fs = require('fs');
var https = require('https');

var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var serverCode = 'kr';
var isLocalServer = false;

var mysql = require('mysql');
var mysqls = require('sync-mysql');
var mysql_import = require('mysql-import');

process.argv.forEach(function (val, index, array) {
  if (val != undefined){
    //change server
    if (val == 'kr'){
      serverCode = 'kr';
      console.log('change server ' + serverCode);
    } else if (val == 'ktest'){
      serverCode = 'ktest';
      console.log('change server ' + serverCode);
    } else if (val == 'global'){
      serverCode = 'global';
      console.log('change server ' + serverCode);
    } else if (val == 'local'){
      serverCode = 'ktest';
      isLocalServer = true;
      console.log('change server ' + serverCode);
    }
  }
});

var dbconfig = [];
if (isLocalServer){
  dbconfig = {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'localhost',
    database : 'tree-of-builder',
    onerror: err=>console.log(err.message),
  };
} else if(serverCode == 'kr' || serverCode == 'ktest') {
  dbconfig = {
    host     : '35.220.156.207',
    user     : 'root',
    password : 'cGbwHENEf6AmkDhc',
    database : 'treeofbuilder',
    onerror: err=>console.log(err.message),
  };
}

var conns = new mysqls(dbconfig);

var filelist = undefined;
fs.readdir('./table_setting', (err, files) => {
  if (err) console.error(err);
  if (files === undefined || files.length == 0){
    console.log('no setting.')
    return;
  }
  filelist = files;
  import_db(0);
  //for (var i=0;i<files.length;i++){
  function import_db(i){
    if (i >= filelist.length) return;
    var table_setting_file = fs.readFileSync('./table_setting/'+filelist[i]);
    var column_setting = table_setting_file.toString().split('\n');
    var tablename = filelist[i].split('.')[0];

    var conn = mysql.createConnection(dbconfig);
    conn.on('error', function() {});
    conn.connect();
    console.log('Check Has Table : ' + tablename);
    conn.query('SELECT 1 FROM '+tablename+' LIMIT 1;', function (error, results, fields) {
      conn.end();
      if (error){
        console.log('Check Has Table : ' + tablename + ' => NOT HAS');
        console.log('Create Table : ' + tablename);
        var querystr ='CREATE TABLE '+tablename+' (';
        for (var j=0;j<column_setting.length;j++){
          if (j>0) querystr +=', '
          querystr +=column_setting[j];
        }
        querystr +=');';
        conns.query(querystr);
      } else {
        console.log('Check Has Table : ' + tablename + ' => HAS');
        for (var j=0;j<column_setting.length;j++){
          if (column_setting[j].trimLeft().startsWith('PRIMARY KEY')){
            console.log('Add Primary Key : ' + tablename + ' ' + column_setting[j]);
            var keyname = column_setting[j].split('(')[1].split(')')[0].trim();
            conns.query('ALTER TABLE '+tablename+' DROP PRIMARY KEY;');
            conns.query('ALTER TABLE '+tablename+' ADD PRIMARY KEY ('+keyname+');');
            continue;
          }
          var hasColumn = conns.query('SHOW COLUMNS FROM '+tablename+' LIKE "'+column_setting[j].trimLeft().split(' ')[0]+'";');
          if (hasColumn!=undefined && hasColumn.length>0){
            console.log('Update Column : ' + tablename + ' ' + column_setting[j]);
            conns.query('ALTER TABLE '+tablename+' MODIFY COLUMN '+column_setting[j]+';');
          } else {
            console.log('Add Column : ' + tablename + ' ' + column_setting[j]);
            conns.query('ALTER TABLE '+tablename+' ADD COLUMN '+column_setting[j]+';');
          }
        }
      }
      import_db(i + 1);
    });
  }
});