#!/usr/bin/env node
'use strict';
process.title = 'botia';

global.db = null;

const http = require('http');
const app = require('express')();
const port = process.env.PORT || 10099;

connect().then(function () {
    require('./app/web-app')(app);
    app.set('port', port);
    listen();
    require("./app/app")();
    sndin();
});

async function connect() {
    let MongoClient = require('mongodb').MongoClient;
    let client = await MongoClient.connect('mongodb://botia:bo123tia@127.0.0.1/botia', {
        useNewUrlParser: true,
        reconnectTries: 60,
        reconnectInterval: 1000
    });
    db = client.db('botia');
}

function listen() {
    let web_server = http.createServer(app);
    web_server.listen(port);
    web_server.on('listening', function onListening() {
        console.log('Web listening on port ' + port);
    });
}

function sndin() {
    let last = null;
    process.openStdin().addListener("data", async function (d) {
        if (d.toString().trim().length !== 0)
            last = d.toString().trim();
        switch (last) {
            case "sock":

                break;
        }
    });
}
