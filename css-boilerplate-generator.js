const fs = require('fs');
const readline = require('readline');

const classesRegex = /class="([a-z0-9 -])+"/
const idsRegex = /id="([a-z0-9 -])+"/

const CssBoilerPlateGenerator = {
    generateCSSBoilerplate: async (inputPath = "./index.html", outputPath = "./styles.css", defaultSelectors = [
        'html, body',
        'body',
        '*'
    ]) => {
        const fileStream = fs.createReadStream(inputPath);

        const rl = readline.createInterface({
            input: fileStream
        });

        const ansArr = [];

        for await (const line of rl) {
            const idMatches = line.match(idsRegex);
            if(idMatches?.length > 0)ansArr.push("#"+idMatches[0].substring(idMatches[0].indexOf('"') + 1, idMatches[0].lastIndexOf('"')));

            const classMatches = line.match(classesRegex);
            if(classMatches?.length > 0)ansArr.push("."+classMatches[0].substring(classMatches[0].indexOf('"') + 1, classMatches[0].lastIndexOf('"')));
        }

        const ansSet = new Set(ansArr.sort());

        fs.writeFile(outputPath, '', err=> {
            if(err) {
                console.error(err)
            } else {
                console.log("file created");
                const writeStream = fs.createWriteStream(outputPath);
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
