export function total(d, o) {
    let t = 0;
    for (const i of o)
        t += d[i].value;
    return t;
}
export function highest(d, o) {
    let h = 0;
    for (const i of o)
        if (d[i].value > h)
            h = d[i].value;
    return h;
}
