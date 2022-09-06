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

export function differenceBar(ctx, box, data) {

    const total = util.total(data.data);

    let x = box[0];
    for (const i in data.data) {
        ctx.fillStyle = data.color[i];
        const w = (data.data[i] / total) * box[2];
        ctx.fillRect(x, box[1], w, box[3]);

        // text stuff
        ctx.fillStyle = "#FFF";
        ctx.font = "20px sans-serif"
        // text alignment
        ctx.textAlign = "center";
        if (i == 0)
            ctx.textAlign = "start";
        else if (i == data.data.length - 1)
            ctx.textAlign = "end";
        // text x coordinate
        let txtx = (w / 2) + x;
        if (i == 0)
            txtx = x;
        else if (i == data.data.length - 1)
            txtx = box[0] + box[2];
        // fill the text
        ctx.fillText(data.text[i], txtx, box[1] + (box[3] / 2));

        x += w;
    }
}

export function heightBars(ctx, box, data) {
    const BAR_WIDTH = 94;
    const TXT_BLOCK_SIZE = 50;
    // find highest percent
    const high = util.highest(data.data);

    const space = (box[2] - (BAR_WIDTH * data.data.length)) / (data.data.length - 1);
    const maxHeight = box[3] - TXT_BLOCK_SIZE;

    // populate bars
    let x = box[0];
    for (const i in data.data) {

        const h = (data.data[i] / high) * maxHeight;

        ctx.fillStyle = data.color[i];
        ctx.fillRect(x, box[1] + (maxHeight - h), BAR_WIDTH, h);
        
        const rgb = util.hexToRgb(data.color[i]);
        let hsl = util.rgbToHsl(rgb[0], rgb[1], rgb[2]);
        console.log(rgb, hsl);

        x += (BAR_WIDTH + space);

        /*bars[b].style.backgroundColor = json.colors[b];
        bars[b].style.height = `${Math.round()}px`;
        bars[b].children[0].innerText = `${json.percent[b].toFixed(1).replace(".", ",")}%`;
        bars[b].children[1].innerText = json.letters[b];*/
    }
}
