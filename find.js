////////////////////////////////////////
/////
///// sms-mongo
///// Accepts SMS messages from Anveo.com and stores them in MangoDB.
/////
///// Jon Mitchell - March 2021
/////  
///// jon@altinc.ca
/////
////////////////////////////////////////

require = require("esm")(module/* , options */)

module.exports = require("./main.js")

const http = require('http')
const url = require('url');

var mongodb_url = "mongodb://mongo1:22523/";
const envelope = Array

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Database Name
const dbName = 'sms';

// Use connect method to connect to the server
// MongoClient.connect(mongodb_url, function(err, client) {
//   assert.equal(null, err);
//   console.log("Connected successfully to server");

//   const db = client.db(dbName);

//   client.close();
// });

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('messages');
  // Find some documents
  

  collection.find({phonenumber: '18045001392'}, {sort: {_id:-1}, limit: 1}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}


const app = http.createServer((request, response) => {
    const queryObject = url.parse(request.url,true).query;
    // sms_from = queryObject['from']
    // sms_phonenumber = queryObject['phonenumber']
    // sms_timestamp = Date.now();
    // sms_message = queryObject['message']
    // var re = new RegExp('(\\d\\d\\d\\d\\d\\d)');
    // var result = re.exec(sms_message);
    // if(result != null) {
    //     var sms_otp = result[1]
    // } else {
    //     var sms_otp = '0'
    // }

    // envelope['sms_from'] = sms_from
    // envelope['phonenumber'] = sms_phonenumber
    // envelope['timestamp'] = sms_timestamp
    // envelope['message'] = sms_message
    // envelope['otp'] = sms_otp
    
    // console.log(envelope)



  MongoClient.connect(mongodb_url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected correctly to server");
    
      const db = client.db(dbName);

        findDocuments(db, function() {
          client.close();
      });
    });
      

    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end("{status: 'ok'}")

    // catch(err) {
    //     response.writeHead(503, { 'Content-Type': 'application/json' })
    //     response.end(`{status: 'fail', error: '${err}'`)
    // }
})

const PORT = 3004
app.listen(PORT)
console.log(`Server running on port ${PORT}`)