'use strict';
let graph = {
    sq: [],
    lines: [],
    x: 75,
    y: 50,
    WIDTH: 400,
    HEIGHT: 300,
    dragok: false,
    curr_sq: 0,
    rect_size: 30,
    createSq: (x, y, w, h, cx, cy) => {
        this.sq.push({
            x: x,
            y: y,
            w: w,
            h: h,
            cx: cx,
            cy: cy
        })
    },

    createLines: (src, dst, data) => {
        this.lines.push({
            src: src,
            dst: dst,
            data: data
        })
    },

    rect: (x, y, w, h, cx, cy) => {
        this.ctx.beginPath();
        this.ctx.rect(x, y, w, h);
        this.ctx.closePath();
        this.ctx.fill();
    },
    setData: (data) => {
        this.sq = [];
        this.lines = [];
        for (i = 0; i < 300; i += 30) {
            this.createSq(x + i, y + i, rect_size, rect_size, x +rect_size/2, y + rect_size / 2);
        }

        for (i = 0; i < sq.length - 2; i++) {
            this.createLines(i, i + 1);
        }
    },
    init: () => {
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.canvas.onmousedown = this.myDown;
        this.canvas.onmouseup = this.myUp;
        return setInterval(this.draw, 10);
    },

    draw: () => {
        this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.ctx.fillStyle = "#444444";
        for (i = 0; i < lines.length; i++) {
            this.rect(sq[lines[i].sq1].x - 15, sq[lines[i].sq1].y - 15, rect_size, rect_size, sq[lines[i].sq1].cx, sq[lines[i].sq1].y);
            this.ctx.moveTo(sq[lines[i].sq1].cx, sq[lines[i].sq1].cy);
            this.ctx.lineTo(sq[lines[i].sq2].cx, sq[lines[i].sq2].cy);
            this.ctx.stroke();
        }
    },

    myMove: (e) => {
        if (dragok) {
            this.curr_sq.x = e.pageX - canvas.offsetLeft;
            this.curr_sq.y = e.pageY - canvas.offsetTop;
        }
    },

    myDown: (e) => {
        for (var r of sq) {
            if (e.pageX < r.x + 15 + canvas.offsetLeft && e.pageX > r.x - 15 +
                this.canvas.offsetLeft && e.pageY < r.y + 15 + canvas.offsetTop &&
                e.pageY > r.y - 15 + canvas.offsetTop) {
                this.curr_sq = r
                this.curr_sq.x = e.pageX - canvas.offsetLeft;
                this.curr_sq.y = e.pageY - canvas.offsetTop;
                dragok = true;
                this.canvas.onmousemove = this.myMove;
            }
        }
    },

    myUp: () => {
        dragok = false;
        this.canvas.onmousemove = null;
    }
};