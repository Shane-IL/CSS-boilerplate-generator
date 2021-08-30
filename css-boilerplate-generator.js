const fs = require('fs');
const readline = require('readline');

const classesRegex = /class="([a-z0-9 -])+"/
const idsRegex = /id="([a-z0-9 -])+"/

const defaultSelectors =  [
    'html, body',
    'body',
    '*',
    'header',
    'section',
    'footer'
];

const CssBoilerPlateGenerator = {
    generateCSSBoilerplate: async () => {
        const fileStream = fs.createReadStream("./index.html");

        const rl = readline.createInterface({
            input: fileStream
        });

        const ansArr = [];

        for await (const line of rl) {
            const matches = line.match(idsRegex);
            if(matches?.length > 0)ansArr.push("#"+matches[0].substring(matches[0].indexOf('"') + 1, matches[0].lastIndexOf('"')));
        }

        for await (const line of rl) {
            const matches = line.match(classesRegex);
            if(matches?.length > 0)ansArr.push("."+matches[0].substring(matches[0].indexOf('"') + 1, matches[0].lastIndexOf('"')));
        }

        const ansSet = new Set(ansArr.sort());

        fs.writeFile("./styles.css", "", err=> {
            if(err) {
                console.error(err)
            } else {
                console.log("file created");
                const writeStream = fs.createWriteStream('./styles.css');
                console.log("writing default selectors");
                defaultSelectors.forEach(selector => writeCSSEntry(writeStream, selector));
                console.log("writing class selectors");
                ansSet.forEach(selector => writeCSSEntry(writeStream, selector));
                writeStream.end();
            }
        });
    }
}

function writeCSSEntry(ws, selector) {
    ws.write(`${selector} {\n\n\n}\n\n`);
}

module.exports = CssBoilerPlateGenerator;
