const express = require("express");
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', require('./web-routes/api'));// implement this
    app.use('/hook', require('./web-routes/hook'));// implement this

    app.get("/", function (req, res) {
        res.redirect('/app');
    });
    app.use("/app", express.static('./static'));

    app.use(function (req, res, next) {
        next(require('http-errors')(404, "Not found"));
    });

    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.send({
            error: true,
            response: err.message || "Unexpected server error"
        });
    });
};
