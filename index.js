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



const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('messages');
    // Insert some documents
    var myobj = { from: envelope['from'], phonenumber: envelope['phonenumber'], timestamp: envelope['timestamp'], message: envelope['message'], otp: envelope['otp']};

    collection.insertOne(
      myobj
    , function(err, result) {
    //   assert.equal(err, null);
    //   assert.equal(3, result.result.n);
    //   assert.equal(3, result.ops.length);
      console.log("Inserted 1 documents into the collection");
      callback(result);
    });
  }

const app = http.createServer((request, response) => {

    if (request.url != '/favicon.ico') {

     

      MongoClient.connect(mongodb_url, function(err, client) {
        const queryObject = url.parse(request.url,true).query;
        console.log(queryObject)
        sms_from = queryObject['from']
        sms_phonenumber = queryObject['phonenumber']
        sms_timestamp = Date.now();
        sms_message = queryObject['message']
        var re = new RegExp('(\\d\\d\\d\\d\\d\\d)');
        var result = re.exec(sms_message);
        if(result != null) {
            var sms_otp = result[1]
        } else {
            var sms_otp = '0'
        }
    
        envelope['sms_from'] = sms_from
        envelope['phonenumber'] = sms_phonenumber
        envelope['timestamp'] = sms_timestamp
        envelope['message'] = sms_message
        envelope['otp'] = sms_otp
        
        assert.equal(null, err);
        console.log("Connected successfully to server");
   
        const db = client.db(dbName);
     
        insertDocuments(db, function() {
            console.log("Connected inserted document to server");
            console.log(envelope)

            client.close();
         });
      });

    }
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end("{status: 'ok'}")

    // catch(err) {
    //     response.writeHead(503, { 'Content-Type': 'application/json' })
    //     response.end(`{status: 'fail', error: '${err}'`)
    // }
})

const PORT = 3003
app.listen(PORT)
console.log(`Server running on port ${PORT}`)