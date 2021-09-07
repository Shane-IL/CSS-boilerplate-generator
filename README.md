# CSS Boilerplate Generator #

This CLI module creates a basic .css boilerplate file from a given .html file with all the classes and id's found in the html file.
To run it from the cli run:

```
create-css-boilerplate {input file path} {output file path}
```

Currently the script only takes these two arguments and outputs the css file relative to the folder it's being run from. It also adds some default css selectors to the file

The default selectors array is 
```
[
    'html, body',
    'body',
    '*'
]
```
    
My next step is to take an optional array of default selectors as an argument that will override the above default. 

This was mainly made for the specific use case where I needed an empty css file with all the classes from an html page and I figured it would be a good opportunity to learn how to make an npm cli module with node. I'll slowly add options to make this as generic and useful as possible. 

