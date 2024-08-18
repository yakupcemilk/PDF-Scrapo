# PDF-Scrapo.js
PDF-Scrapo.js, scrapes PDF.

> [!IMPORTANT]
> PDF-Scrapo.js is JS library for parsing and processing PDF files, nothing much than this.

## Usage
```bash
npm install pdf-scrapo
```
or 
```bash
yarn add pdf-scrapo
```

an example here for example usage:

```javascript
const { readPDFFile, parsePDF, processParsedText, replace, saveToFile, processPDF, getParsedText } = require('pdf-scrapo.js');

const inputFilePath = 'input.pdf';
readPDFFile(inputFilePath);

const parsedText = parsePDF();
console.log('Parsed Text:', parsedText);

const styledText = processParsedText('Italic');
console.log('Styled Text:', styledText);

const translatedText = [
    'Bu basit bir PDF\'dir',
    'Bu kalın metin',
    'Bu italik metin'
];

const replacedText = replace(parsedText, translatedText);
console.log('Replaced Text:', replacedText);

const outputFilePath = 'output_translated.pdf';
saveToFile(outputFilePath);

processPDF(inputFilePath, 'output.txt');
```

all the functions that PDF-Scrapo.js has:
1. readPDFFile
1. parsePDF
1. processParsedText
1. replace
1. saveToFile
1. processPDF
1. getPdfData as pdfData
1. getParsedText as parsedText