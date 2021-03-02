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

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://96.126.70.135:27017/";
var db_name = "sms"

const app = http.createServer((request, response) => {
    const queryObject = url.parse(request.url,true).query;
    from = queryObject['from']
    phonenumber = queryObject['phonenumber']
    message = queryObject['message']
    var re = new RegExp('^(\\d\\d\\d\\d\\d\\d)$');
    var otp = re.exec(message);
    try {
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(db_name);
            var myobj = { from: from, phonenumber: phonenumber, message: message, otp: otp};
            dbo.collection("messages").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
            });
        });

        console.log(from)
        console.log(phonenumber)
        console.log(message)
        
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end("{status: 'ok'}")

    }

    catch(err) {
        response.writeHead(503, { 'Content-Type': 'application/json' })
        response.end(`{status: 'fail', error: '${err}'`)
    }
})

const PORT = 3003
app.listen(PORT)
console.log(`Server running on port ${PORT}`)