'use strict';
const drawer = {
    open: () => {
        $("#left").addClass("open");
    },
    close: () => {
        $("#left").removeClass("open");
    },
    toggle: () => {
        $("#left").toggleClass("open");
    },
    setLayout: () => {
        $("#left").html($(".hidden .left").clone());
        initSaveBtn();
    },
    create: () => {
        httpPost("/api/add", JSON.stringify({
            "title": $("#left input.title").val(),
            "speech": $("#left textarea").val(),
            "url": $("#left input.url").val(),
            "method": $(".met-btn.active").data("method"),
            "header": $("#left input.header").val(),
            "body": $("#left input.body").val()
        })).then(() => { drawer.close(); });
        $("#left input.id").val("null");
    },
    save: () => {
        httpPost("/api/update", JSON.stringify({
            "_id": $("#left input.id").val(),
            "title": $("#left input.title").val(),
            "speech": $("#left textarea").val(),
            "url": $("#left input.url").val(),
            "method": $(".met-btn.active").data("method"),
            "header": $("#left input.header").val(),
            "body": $("#left input.body").val()
        })).then(() => { drawer.close(); });
        $("#left input.id").val("null");
    }
};

const initSaveBtn = () => {
    $(".met-btn").click(function () {
        $(".met-btn").removeClass("active");
        $(this).addClass("active");
    });
    $(".confirm-btn").click(() => {
        if ($("#left input.id").val() === "null")
            drawer.create();
        else
            drawer.save();
    });
};
$(function () {
    console.log("awdawdawd");
    $(".js-add").click(() => {
        drawer.setLayout();
        drawer.open();
    });
    initGraph();
    center.init();
});
let myDiagram;
const initGraph = () => {
    var gr = go.GraphObject.make;

    myDiagram = gr(go.Diagram, "myDiagramDiv", {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true
    });

    myDiagram.nodeTemplate =
        gr(go.Node, "Auto",
            { locationSpot: go.Spot.Center },
            gr(go.Shape, "RoundedRectangle",
                {
                    width: 200, height: 70,
                    fill: "#C4C4C4", // the default fill, if there is no data bound value
                    portId: "", cursor: "pointer",
                    // borderColor: "#C4C4C4",
                    strokeWidth: 0,
                    fromLinkable: true, fromLinkableSelfNode: true,
                    toLinkable: true, toLinkableSelfNode: true
                },
                new go.Binding("fill", "color")),
            gr(go.TextBlock,
                {
                    font: "24px sans-serif",
                    stroke: '#333',
                    margin: 6,  // make some extra space for the shape around the text
                    isMultiline: false,  // don't allow newlines in text
                    editable: false  // allow in-place editing by user
                },
                new go.Binding("text", "text").makeTwoWay()),
            {
                cursor: "pointer",
                click: function (e, obj) {
                    let block = blocks[obj.part.data.key];
                    console.log(block.title);
                    drawer.setLayout(".hidden .left-create");
                    jQuery("#left input.id").val(block._id || "null");
                    jQuery("#left input.title").val(block.title || "");
                    jQuery("#left textarea").val(block.speech || "");
                    jQuery("#left input.url").val(block.url || "");
                    jQuery("#left input.header").val(block.header || "");
                    jQuery("#left input.body").val(block.body || "");
                    drawer.open();
                }
            }

        );

    myDiagram.linkTemplate =
        gr(go.Link,
            { toShortLength: 5, relinkableFrom: true, relinkableTo: true },  // allow the user to relink existing links
            gr(go.Shape, { strokeWidth: 2 }, new go.Binding("stroke", "color")),
            gr(go.Shape, { toArrow: "Standard", stroke: null }, new go.Binding("fill", "color")),
            gr(go.Shape, "RoundedRectangle",
                {
                    fill: "#C4C4C4",
                    width: 25, height: 20,

                }),
            gr(go.TextBlock,
                {
                    font: "14px sans-serif",
                    stroke: '#333',
                    margin: 6,  // make some extra space for the shape around the text
                    isMultiline: false,  // don't allow newlines in text
                    editable: false  // allow in-place editing by user
                },
                new go.Binding("text", "color").makeTwoWay()),
            {
                cursor: "pointer",
                click: function (e, obj) {
                    let b = null;
                    for (let v in blocks[obj.part.data.from].children)
                        if (blocks[obj.part.data.from].children[v] === obj.part.data.to) { b = v; break; }
                    let no = prompt("Enter number for this way:", b || "");
                    if (!blocks[obj.part.data.from].children) blocks[obj.part.data.from].children = {};
                    try { delete blocks[obj.part.data.from].children[b]; } catch (_) { }
                    for (let vv in myDiagram.model.linkDataArray) {
                        if (myDiagram.model.linkDataArray[vv].from === obj.part.data.from && myDiagram.model.linkDataArray[vv].to === obj.part.data.to)
                            myDiagram.model.linkDataArray[vv].color = no;
                    }
                    blocks[obj.part.data.from].children[no] = obj.part.data.to;
                    myDiagram.rebuildParts();
                    httpPost("/api/update", JSON.stringify(blocks[obj.part.data.from]));
                }
            }
        );
};