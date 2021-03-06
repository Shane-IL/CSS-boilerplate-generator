import chalk from 'chalk';
import inquirer from 'inquirer';

import { lstat } from 'fs/promises';
import { createReadStream, createWriteStream, existsSync } from 'fs';
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

    if(existsSync(outputPath)) {
        const ans = await confirmExistingFileOverride();
        if(!ans) {
            console.error(`%s CSS file at specified output path already exists`, chalk.red.bold('ERROR'));
            process.exit(1);
        }
        
    }

    const fileStream =  createReadStream(inputPath);

    const rl = readline.createInterface({
        input: fileStream
    });

    const foundSelectors = new Set();

    for await (const line of rl) {
        const idMatches = line.match(idsRegex);
        if(idMatches && idMatches.length > 0){
            foundSelectors.add("#"+idMatches[0].substring(idMatches[0].indexOf('"') + 1, idMatches[0].lastIndexOf('"')));
        }
        const classMatches = line.match(classesRegex);
        if(classMatches && classMatches.length > 0) {
            const classString = classMatches[0].substring(classMatches[0].indexOf('"') + 1, classMatches[0].lastIndexOf('"'));
            const classArray = classString.split(" ");
            for(let className of classArray) {
                foundSelectors.add("."+className);
            }
        }
    }

    console.log("Creating File");
    const writeStream = createWriteStream(outputPath);
    defaultSelectors.forEach(selector=> writeStream.write(`${selector} {\n\n\n}\n\n`));
    [...foundSelectors].sort().forEach(selector=> writeStream.write(`${selector} {\n\n\n}\n\n`));
    writeStream.end();
    writeStream.on('finish', () => {
        console.log("%s CSS file created successfully", chalk.green.bold('DONE'));
        process.exit();
    })
}

async function confirmExistingFileOverride() {   
    const answers = await inquirer.prompt({
        type: 'confirm',
        name: 'confirmOverride',
        message: 'A CSS file with the name specified in your outputpath already exists, do you want to override it?'
    });
    return answers.confirmOverride;
}