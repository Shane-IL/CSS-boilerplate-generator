import arg from 'arg';
import inquirer from 'inquirer';

import { generateCSSBoilerplate } from './css-boilerplate-generator.js';

function parseArguments(rawArgs) {
    const args = arg({},{ argv: rawArgs.slice(2)});
    return {
      inputPath: args._[0],
      outputPath: args._[1]
    };
}

async function promptForMissingParams(params) {   
    const questions = [];
    if (!params.inputPath) {
      questions.push({
        type: 'input',
        name: 'inputPath',
        message: 'Please enter an input path'
      });
    }

    if (!params.outputPath) {
        questions.push({
          type: 'input',
          name: 'outputPath',
          message: 'Please enter an output path'
        });
    }
     
    const answers = await inquirer.prompt(questions);
    return {
      ...params,
      inputPath: params.inputPath || answers.inputPath,
      outputPath: params.outputPath || answers.outputPath,
    };
   }

export async function cli(args) {
    let parsedArgs = parseArguments(args);
    parsedArgs = await promptForMissingParams(parsedArgs);
    await generateCSSBoilerplate(parsedArgs.inputPath, parsedArgs.outputPath);
}