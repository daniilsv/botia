'use strict';
const router = require('express').Router();
var rp = require('request-promise');
const Graph = global.db.collection("graph");
let users = {};
const ObjectID = require('mongodb').ObjectID;
router.all('/call', async function (req, res, next) {
    console.log(req.body, req.params);
    let start = await Graph.findOne({ start: true });
    users[req.body.callEventNotification.calledParticipant] = start;
    res.send({
        "action": {
            "actionToPerform": "Continue",
            "displayAddress": req.body.callEventNotification.calledParticipant,
            "digitCapture": {
                "digitConfiguration": { "maxDigits": 1, "minDigits": 1 },
                "playingConfiguration": {
                    "playFileLocation": "http://clients.itis.team:10099/app/files/" + start.file
                },
                "callParticipant": [req.body.callEventNotification.calledParticipant]
            },
            "playAndCollectInteractionSubscription": {
                "callbackReference": {
                    "notifyURL": "http://clients.itis.team:10099/hook/digits"
                }
            }
        }
    });
});

router.all('/digits', async function (req, res, next) {
    console.log(req.body, req.params);
    let cur = users[req.body.mediaInteractionNotification.callParticipant];
    if (cur === undefined) { console.log("1"); return; }
    cur = await Graph.findOne({ _id: ObjectID(cur._id) });
    const resp = req.body.mediaInteractionNotification.mediaInteractionResult;
    if (resp === '') { console.log("2"); return; }
    const next_id = cur.children[resp];
    cur = await Graph.findOne({ _id: ObjectID(next_id) });
    if (!cur)
        cur = await Graph.findOne({ start: true });
    users[req.body.mediaInteractionNotification.callParticipant] = cur;
    if (cur.method === "post") {
        await rp({
            method: 'POST',
            uri: cur.url,
            headers: JSON.parse(cur.header),
            body: JSON.parse(cur.body),
            json: true
        });
    } else if (cur.method === "get") {
        await rp({
            uri: cur.url,
            json: true
        });
    }
    if (cur.finish === true) {
        delete users[req.body.mediaInteractionNotification.callParticipant];
        res.send({
            "action": {
                "actionToPerform": "EndCall",
                "displayAddress": req.body.mediaInteractionNotification.callParticipant
            }
        });
        return;
    }
    res.send({
        "action": {
            "actionToPerform": "Continue",
            "displayAddress": req.body.mediaInteractionNotification.callParticipant,
            "digitCapture": {
                "digitConfiguration": { "maxDigits": 1, "minDigits": 1 },
                "playingConfiguration": {
                    "playFileLocation": "http://clients.itis.team:10099/app/files/" + cur.file
                },
                "callParticipant": [req.body.mediaInteractionNotification.callParticipant]
            },
            "playAndCollectInteractionSubscription": {
                "callbackReference": {
                    "notifyURL": "http://clients.itis.team:10099/hook/digits"
                }
            }
        }
    });
});

module.exports = router;
