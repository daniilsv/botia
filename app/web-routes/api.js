'use strict';
const router = require('express').Router();
const Tts = require('../services/tts');

const Graph = global.db.collection("graph");

router.get('/graph', async function (req, res, next) {
    res.send(await Graph.find({}).toArray());
});

router.post('/add/condition', async function (req, res, next) {
    const file = Date.now();
    Tts(req.body.speech, file);
    req.body.file = file + ".wav";
    Graph.insertOne(req.body);
    res.send(true);
});

router.post('/add/action', async function (req, res, next) {
    Graph.insertOne(req.body);
    res.send(true);
});

router.get('/delete/:id', async function (req, res, next) {
    await Graph.deleteOne({ "id": parseInt(req.params.id) });
    res.send(true);
});

router.post('/update', async function (req, res, next) {
    Graph.updateOne({ "id": req.body.id }, req.body);
    res.send(true);
});



module.exports = router;

