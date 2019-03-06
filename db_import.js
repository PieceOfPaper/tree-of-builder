var fs = require('fs');
var https = require('https');

var csv = require('csv-parser');
var xml = require('xml-parser');

var TGA = require('tga');
var PNG = require('pngjs').PNG;
var PNGCrop = require('png-crop');

var serverCode = 'kr';
var isLocalServer = false;

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

var dbimporter = mysql_import.config(dbconfig);
dbimporter.import('table_structure_dump.sql').then(()=> {
	console.log('### DB Import Success.')
});