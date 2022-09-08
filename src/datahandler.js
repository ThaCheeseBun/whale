import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";
import fsp from "node:fs/promises";
import fetch from "node-fetch";
import Zip from "adm-zip";
import {
    diffLines
} from "diff";
import {
    STORAGE_DIR
} from "../index.js";

/*
0: full match
1: date (yyyymmdd)
2: preliminar eller slutlig
3: valområde
4: rd: riksdagsval, kf: kommunfull, rf: regionfull
*/
const EXTRACT_REGEX = /Val_([0-9]+)_(preliminar|slutlig)_([0-9]+)_(RD|KF|RF)/;
//const BASE_URL = "https://resultat.val.se/resultatfiler";
const BASE_URL = "http://localhost:1337/resultatfiler";

// promisified version of data getter
function dataHelper(name, zip) {
    return new Promise(function (res, rej) {
        const entry = zip.getEntry(name);
        if (entry === null)
            return rej(new Error("Not Found"));
        entry.getDataAsync(function (data, err) {
            if (err)
                return rej(err);
            res(data);
        });
    });
}

// verify input data against certificate
function verifyData(data, sign) {
    return new Promise(async function (res, rej) {
        const certFilename = path.resolve(STORAGE_DIR, "val-sign-crt.pem");
        const certFile = await fsp.readFile(certFilename);
        const cert = new crypto.X509Certificate(certFile);
        crypto.verify("sha256", data, cert.publicKey, sign, function (err, r) {
            if (err)
                return rej(err);
            res(r);
        });
    });
}

// extract and convert required data
function extractConvert(raw) {
    // calculate others, yeezus
    const othersValue =
        raw.valomrade.rostfordelning.rosterPaverkaMandat.rosterOvrigaPartier.antalRoster +
        raw.valomrade.rostfordelning.rosterEjPaverkaMandat.antalRoster;
    const othersPercentage =
        raw.valomrade.rostfordelning.rosterPaverkaMandat.rosterOvrigaPartier.andelRoster +
        raw.valomrade.rostfordelning.rosterEjPaverkaMandat.andelRosterAvTotaltAntalRoster;
    // main output
    const out = {
        updated: raw.senasteUppdateringstid,
        total: raw.valomrade.totaltAntalRoster,
        districts: {
            counted: raw.valomrade.antalValdistriktRaknade,
            total: raw.valomrade.antalValdistriktSomSkaRaknas,
        },
        parties: [],
        others: {
            value: othersValue,
            percentage: othersPercentage
        }
    };
    // main parties
    for (const p of raw.valomrade.rostfordelning.rosterPaverkaMandat.partiRoster) {
        out.parties.push({
            name: p.partibeteckning,
            short: p.partiforkortning,
            color: p.fargkod,
            number: p.ordningsnummer,
            value: p.antalRoster,
            percentage: p.andelRoster
        });
    }
    return out;
}

// fetch new data from server
export function getData() {
    return new Promise(async function (res, rej) {
        // giant try catch for various unusual errors
        try {

            // get new index file with checksums
            const req1 = await fetch(`${BASE_URL}/index.md5`);
            const newIndex = await req1.text();
            // get old cached index file
            const cacheFile = path.resolve(STORAGE_DIR, "index.md5");
            let oldIndex = "";
            try {
                await fsp.access(cacheFile, fs.constants.W_OK | fs.constants.R_OK);
                oldIndex = await fsp.readFile(cacheFile, "utf-8");
            } catch (_) {
                // no cache on hand, ignore
            }

            // save new cache file
            await fsp.writeFile(cacheFile, newIndex);

            // compare indexes
            const change = diffLines(oldIndex, newIndex);
            for (const c of change) {

                // ignore old stuff
                if (!c.added)
                    continue;

                // loop through each line
                const ls = c.value.split("\n");
                for (const l of ls) {

                    // extract with regex
                    const rl = EXTRACT_REGEX.exec(l);
                    // ignore invalid
                    if (rl == null)
                        continue;

                    // if matching the one we want
                    if (rl[2] == "preliminar" && rl[3] == "00" && rl[4] == "RD") {

                        // request and open zip file
                        const sl = l.split("  ");
                        const req2 = await fetch(`${BASE_URL}/${sl[1]}`);
                        const buf = await req2.arrayBuffer();
                        const zip = new Zip(Buffer.from(buf));

                        // get main data file
                        const entryNameData = `Val_${rl[1]}_${rl[2]}_mandatfordelning_${rl[3]}_${rl[4]}.json`;
                        const data = await dataHelper(entryNameData, zip);
                        // get signature file
                        const entryNameSign = `Val_${rl[1]}_${rl[2]}_mandatfordelning_${rl[3]}_${rl[4]}_sign.sha256`;
                        const sign = await dataHelper(entryNameSign, zip);
                        // verify data against certificate
                        const good = await verifyData(data, sign);
                        if (!good)
                            return rej(new Error("Verification failed"));

                        // get and convert data
                        const json = JSON.parse(data.toString("utf-8"));
                        const converted = extractConvert(json);

                        return res(converted);

                    }

                }

            }

            // send null if no new data
            return res(null);

        } catch (e) {
            rej(e);
        }
    });
}
