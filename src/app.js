const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const https = require('https');
const http = require('http');
const console = require("JrModules/jrConsole");
const fs = require("fs-extra");

let ports = {
    http: 20007,
    https: 20008
}


let options = null;
if(true){ // if testing at home with laptop running test server
    console.test("Test mode");
    isTestMode = true;
}else{
    options = {
        cert: fs.readFileSync('fullchain.pem'),
        key: fs.readFileSync('privkey.pem')
    }
}




/***********************************************************
** Server Setup
************************************************************/

// setup the express server
const app = express();
app.use(bodyParser.json({limit: '8mb'}));

// Allows access to the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true , limit: '8mb'}));


app.route(`/`).get((req, res) => {
    res.type('.html');
    res.send("?");
});

app.route(`/slots`).get((req, res) => {
    res.type('.html');
    res.send(fs.readFileSync(path.join(__dirname, "public","html","index.html")));
});




/***********************************************************
** Run Server
************************************************************/

// Create the Https server
https.createServer(options, app).listen(ports.https);

// Create the http server
if(isTestMode){
    console.log(`Starting server on port ${ports.http}`);
    http.createServer(app).listen(ports.http);
}else{
    console.log(`Forwarding ${ports.http} to ${ports.https}`);
    http.createServer(function (req, res) {
        res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
        res.end();
    }).listen(ports.http);
}

console.log('Server started!');

