import chalk from 'chalk';
import {lstat} from 'fs/promises';
import { createReadStream, createWriteStream, writeFile } from 'fs';
import readline from 'readline';

const classesRegex = /class="([a-z0-9 -])+"/;
const idsRegex = /id="([a-z0-9 -])+"/;

export async function generateCSSBoilerplate(inputPath = "./index.html", outputPath = "./styles.css", defaultSelectors = [
    'html, body',
    'body',
    '*'
]) {

    try {
        const stats = await lstat(inputPath);
        if(!stats.isFile()) {
            throw new Error('Input path does not lead to a file');
        }
    } catch (error) {
        console.error(`%s ${error}`, chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const fileStream =  createReadStream(inputPath);

    const rl = readline.createInterface({
        input: fileStream
    });

    const ansArr = [];

    for await (const line of rl) {
        const idMatches = line.match(idsRegex);
        if(idMatches && idMatches.length > 0)ansArr.push("#"+idMatches[0].substring(idMatches[0].indexOf('"') + 1, idMatches[0].lastIndexOf('"')));

        const classMatches = line.match(classesRegex);
        if(classMatches && classMatches.length > 0) {
            const classString = classMatches[0].substring(classMatches[0].indexOf('"') + 1, classMatches[0].lastIndexOf('"'));
            const classArray = classString.split(" ");
            for(let className of classArray) {
                ansArr.push("."+className);
            }
        }
    }

    const ansSet = new Set(ansArr.sort());

    writeFile(outputPath, '', err=> {
        if(err) {
            console.error(err)
        } else {
            console.log("File created");
            const writeStream = createWriteStream(outputPath);
            console.log("Writing default selectors");
            defaultSelectors.forEach(selector => writeCSSEntry(writeStream, selector));
            console.log("Writing id and class selectors");
            ansSet.forEach(selector => writeCSSEntry(writeStream, selector));
            writeStream.end();
            console.log("%s CSS file created successfully", chalk.green.bold('DONE'));
            process.exit();
        }
    });
}

function writeCSSEntry(ws, selector) {
    ws.write(`${selector} {\n\n\n}\n\n`);
}

