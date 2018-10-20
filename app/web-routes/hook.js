'use strict';
const router = require('express').Router();

const Graph = global.db.collection("graph");
let users = {};
router.all('/call', async function (req, res, next) {
    console.log(req.body, req.params);
    let start = await Graph.findOne({ start: true });
    console.log(start);
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
    if (cur === undefined) return;
    const resp = req.body.mediaInteractionNotification.mediaInteractionResult;
    if (resp === '') return;
    const next_id = cur.children[resp];
    cur = await Graph.findOne({ _id: next_id });
    users[req.body.mediaInteractionNotification.callParticipant] = cur;

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
