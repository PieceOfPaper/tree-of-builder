module.exports = function(app, dbclient){
    var express = require('express');
    var fs = require('fs');


const { Pool, Client } = require('pg');

const config = {
  user: 'postgres',
  host     : "35.220.243.168",
  database : 'postgres',
  password: 'FE5iFatpuJFC8kjB',
  port: 5432,
  // this object will be passed to the TLSSocket constructor
  ssl : {
    rejectUnauthorized : false,
    ca   : fs.readFileSync("server-ca.pem").toString(),
    key  : fs.readFileSync("client-cert.pem").toString(),
    cert : fs.readFileSync("client-cert.pem").toString(),
  }
};

const client = new Client(config);
client.connect((err) => {
  if (err) {
    console.error('error connecting', err.stack)
  } else {
    console.log('connected')
    client.end()
  }
});
    
    var route = express.Router();
    route.get('/', function (req, res) {
        res.send('no data');
    });

    return route;
}