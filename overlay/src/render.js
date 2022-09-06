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

    // collect data
    let shorts = [];
    let values = [];
    let total = 0;
    for (const i in opts.data) {
        const t = util.total(data, opts.data[i]);
        values.push(t);
        total += t;
        shorts[i] = "";
        for (const j in opts.data[i]) {
            shorts[i] += data[opts.data[i][j]].short +
                (j == opts.data[i].length - 1 ? "" : "+");
        }
    }

    // render data
    let x = box[0];
    for (const i in opts.data) {
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
        else if (i == opts.data.length - 1)
            ctx.textAlign = "end";
        // text x coordinate
        let txtx = (w / 2) + x;
        if (i == 0)
            txtx = x + 5;
        else if (i == opts.data.length - 1)
            txtx = (box[0] + box[2]) - 5;
        // fill the text
        ctx.fillText(shorts[i], txtx, box[1] + (box[3] / 2), w);

        x += w;
    }
}

// create the chart of bars
export function heightBars(ctx, box, data, opts) {
    const BAR_WIDTH = 94;
    const TXT_BLOCK = 90;

    // find highest percent
    const high = util.highest(data, opts);
    const space = (box[2] - (BAR_WIDTH * opts.length)) / (opts.length - 1);
    const maxHeight = box[3] - TXT_BLOCK;

    // populate bars
    let x = box[0];
    for (const i in opts) {
        const h = (data[opts[i]].value / high) * maxHeight;

        ctx.fillStyle = data[opts[i]].color;
        ctx.fillRect(x, box[1] + (maxHeight - h), BAR_WIDTH, h + TXT_BLOCK);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "60px " + FONT;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(data[opts[i]].short, x + (BAR_WIDTH / 2), box[1] + maxHeight + (TXT_BLOCK / 2));

        const percent = data[opts[i]].percent.toFixed(1).replace(".", ",") + "%";
        ctx.font = "30px " + FONT;
        ctx.textBaseline = "bottom";
        ctx.fillText(percent, x + (BAR_WIDTH / 2), box[1] + maxHeight);

        x += (BAR_WIDTH + space);
    }
}

// pie chart go brr
export function pieChart(ctx, data, opts) {
    const total = util.total(data, opts);
    const middle = ctx.canvas.width / 2;

    let currentAngle = 0;
    for (const i in data) {
        //calculating the angle the slice (portion) will take in the chart
        const portionAngle = (data[opts[i]].value / total) * 2 * Math.PI;
        //drawing an arc and a line to the center to differentiate the slice from the rest
        ctx.beginPath();
        ctx.arc(middle, middle, middle, currentAngle, currentAngle + portionAngle);
        currentAngle += portionAngle;
        ctx.lineTo(middle, middle);
        //filling the slices with the corresponding mood's color
        ctx.fillStyle = data[opts[i]].color;
        ctx.fill();
    }
}
