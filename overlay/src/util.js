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
// due to me losing braincells at an alarming rate
// i need to implement a different format so that
// the control panel does not explode
export function showConvert(o) {
    let a = [];
    for (const i of o.order) {
        if (o.show[i])
            a.push(i);
    }
    return a;
}
