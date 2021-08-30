# CSS Boilerplate Generator #

To make a CSS file add this to a node script:

`const cssClassGenerator = require('./css-class-generator.js');`  
`cssClassGenerator.generateCSSBoilerplate();`

Currently, the script looks for an `index.html` file in the root and then generates the a boilerplate CSS files names `styles.css` at the same root with a list of the main html sections as well as all the id's and classes with no stying

This was mainly made for the specific use case where I needed an empty css file with all the classes from an html page, in the future I will add the option to pass in input and output file paths, custom default selectors and some default styling options.
