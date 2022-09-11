// Difference bars, big hak
import * as util from "./util.js";

/* Example box
[
    100, = X
    100, = Y
    300, = Width
    50   = Height
]
*/
/* Example dataset
 {
     "data": [10, 50, 40],
     "text": ["V+SD", "C+MP", "L+KD"],
     "color": ["#F00", "#0F0", "#00F"]
 }
 */

const FONT = "Adumu";

// the difference bars comparing stuff tm
export function differenceBar(ctx, box, data, opts) {
    ctx.clearRect(box[0], box[1], box[2], box[3]);

    // collect data
    let shorts = [];
    let values = [];
    let total = 0;
    for (const i in opts.order) {
        const t = util.total(data.parties, opts.order[i]);
        values.push(t);
        total += t;
        shorts[i] = "";
        for (const j in opts.order[i]) {
            shorts[i] += data.parties[opts.order[i][j]].short +
                (j == opts.order[i].length - 1 ? "" : "+");
        }
    }

    // render data
    let x = box[0];
    for (const i in opts.order) {
        ctx.fillStyle = opts.color[i];
        const w = (values[i] / total) * box[2];
        ctx.fillRect(x, box[1], w, box[3]);

        // text stuff
        ctx.fillStyle = "#FFF";
        ctx.font = "28px " + FONT;
        if (box[3] > 40)
            ctx.font = "40px " + FONT;
        ctx.textBaseline = "middle";
        // text alignment
        ctx.textAlign = "center";
        if (i == 0)
            ctx.textAlign = "start";
        else if (i == opts.order.length - 1)
            ctx.textAlign = "end";
        // text x coordinate
        let txtx = (w / 2) + x;
        if (i == 0)
            txtx = x + 5;
        else if (i == opts.order.length - 1)
            txtx = (box[0] + box[2]) - 5;
        // fill the text
        ctx.fillText(shorts[i], txtx, box[1] + (box[3] / 2), w);

        x += w;
    }
}

// create the chart of bars
export function mainBars(ctx, box, data, opts) {
    ctx.clearRect(box[0], box[1], box[2], box[3]);

    const BAR_WIDTH = 94;
    const TXT_BLOCK = 90;

    const tr = util.showConvert(opts);

    // find highest percent
    const high = util.highest(data.parties, tr);
    const space = (box[2] - (BAR_WIDTH * tr.length)) / (tr.length - 1);
    const maxHeight = box[3] - TXT_BLOCK;

    // populate bars
    let x = box[0];
    for (const i in tr) {
        const h = (data.parties[tr[i]].value / high) * maxHeight;

        ctx.fillStyle = opts.color[tr[i]];
        ctx.fillRect(x, box[1] + (maxHeight - h), BAR_WIDTH, h + TXT_BLOCK);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "60px " + FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data.parties[tr[i]].short, x + (BAR_WIDTH / 2), box[1] + maxHeight + (TXT_BLOCK / 2));

        const percent = data.parties[tr[i]].percentage.toFixed(1).replace(".", ",") + "%";
        ctx.font = "30px " + FONT;
        ctx.textBaseline = "bottom";
        ctx.fillText(percent, x + (BAR_WIDTH / 2), box[1] + maxHeight);

        x += (BAR_WIDTH + space);
    }
}

// pie chart go brr
export function pieChart(ctx, data, opts) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const tr = util.showConvert(opts);

    const total = util.total(data.parties, tr);
    const middle = ctx.canvas.width / 2;

    let currentAngle = 0;
    for (const i in tr) {
        //calculating the angle the slice (portion) will take in the chart
        const portionAngle = (data.parties[tr[i]].value / total) * 2 * Math.PI;
        //drawing an arc and a line to the center to differentiate the slice from the rest
        ctx.beginPath();
        ctx.arc(middle, middle, middle, currentAngle, currentAngle + portionAngle);
        currentAngle += portionAngle;
        ctx.lineTo(middle, middle);
        //filling the slices with the corresponding mood's color
        ctx.fillStyle = opts.color[tr[i]];
        ctx.fill();
    }
}
