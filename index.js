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

const app = http.createServer((request, response) => {
    const queryObject = url.parse(request.url,true).query;
    from = queryObject['from']
    phonenumber = queryObject['phonenumber']
    message = queryObject['message']
    try {
        console.log(from)
        console.log(phonenumber)
        console.log(message)

        var re = new RegExp('^(\\d\\d\\d\\d\\d\\d)$');
        var opt = re.exec(message);

        response.writeHead(200, { 'Content-Type': 'application/json' })
        // response.end(JSON.stringify(callflow_obj))
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