import fetch from "node-fetch";
import fs from "node:fs";
import zip from "node-stream-zip";

const EXTRACT_REGEX = /Val_([0-9]+)_(preliminar|slutlig)_([0-9]+)_(RD|KF|RF).zip/;
const BASE_URL = "https://resultat.val.se/resultatfiler";

(async function () {

    const req = await fetch(`${BASE_URL}/index.md5`);
    const txt = await req.text();

    /*
    0: full match
    1: date (yyyymmdd)
    2: preliminar eller slutlig
    3: valområde
    4: rd: riksdagsval, kf: kommunfull, rf: regionfull
    */
    const ls = txt.split("\n");
    for (const l of ls) {
        const rl = EXTRACT_REGEX.exec(l);
        if (rl == null)
            continue;
        if (rl[4] == "RD") {

            const sl = l.split("  ");
            const req2 = await fetch(`${BASE_URL}/${sl[1]}`);


        }
    }

})();

