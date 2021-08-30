# CSS Boilerplate Generator #

To make a CSS file add this to a node script:

```
const CssBoilerPlateGenerator = require('./css-boilerplate-generator.js'); 
CssBoilerPlateGenerator.generateCSSBoilerplate(
        inputPath : string : optional, 
        outputPath : string : optional, 
        defaultSelectors : arr : optional
);
```

Currently, the script looks for an `index.html` file in the root and then generates a boilerplate CSS files named `styles.css` at the same root with a list of the main html sections as well as all the id's and classes with no stying. The input and output paths can be overridden by passing in a file path when calling the function.

The default selectors array is 
```
[
    'html, body',
    'body',
    '*'
]
```
    
It can also be overridden with an array of whatever default selectors you want. 

This was mainly made for the specific use case where I needed an empty css file with all the classes from an html page, in the future I will add the option to pass in  some default styling options.

