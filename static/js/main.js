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
    setLayout: (layout) => {
        $("#left").html($(layout).clone());
        graph.WIDTH = $("#center").outerWidth();
        graph.HEIGHT = $("#center").outerHeight();
    },
    setTabBody: (layout) => {
        console.log(".hidden .tab-body-" + layout);
        $("#left .left-tab-body").html($(".hidden .tab-body-" + layout).clone());
    },
    create: () => {
        if ($("#left .left-tab-body").find(".tab-body-condition").length !== 0)
            httpPost("/api/add/condition", JSON.stringify({
                "type": "condition",
                "title": $("#left input.title").val(),
                "speech": $("#left textarea").val()
            })).then(() => { this.close(); });
        else
            httpPost("/api/add/action", JSON.stringify({
                "type": "action",
                "title": $("#left input.title").val(),
                "speech": $("#left textarea").val(),
                "header": $("#left input.header").val(),
                "body": $("#left input.body").val()
            })).then(() => { this.close(); });
    },
};
const initTabs = () => {
    $(".left-tab-item").click(function () {
        $(".left-tab-item").removeClass("active");
        $(this).addClass("active");
        drawer.setTabBody($(this).data("id"));
        initSaveBtn();
    });
};
const initSaveBtn = () => {
    $(".confirm-btn").click(() => {
        if ($("#left").find(".left-create").length !== 0)
            drawer.create();
        else
            drawer.save();
    });
};
$(() => {
    $(".js-add").click(() => {
        drawer.setLayout(".hidden .left-create");
        drawer.setTabBody('condition');
        drawer.open();
        initTabs();
    });
    center.init();
});