'use strict';
const router = require('express').Router();
const Tts = require('../services/tts');
const ObjectID = require('mongodb').ObjectID;
const Graph = global.db.collection("graph");

router.get('/graph', async function (req, res, next) {
    res.send(await Graph.find({}).toArray());
});

router.post('/add', async function (req, res, next) {
    const file = Date.now();
    Tts(req.body.speech, file);
    req.body.file = file + ".wav";
    Graph.insertOne(req.body);
    res.send(true);
});

router.get('/delete/:id', async function (req, res, next) {
    await Graph.deleteOne({ "_id": req.params._id });
    res.send(true);
});

router.post('/update', async function (req, res, next) {
    const file = Date.now();
    Tts(req.body.speech, file);
    req.body.file = file + ".wav";
    console.log(req.body, { _id: req.body._id });
    const _id = ObjectID(req.body._id);
    delete req.body._id;
    Graph.updateOne({ _id: _id }, { $set: req.body });
    res.send(true);
});



module.exports = router;

