const { readPDFFile, parsePDF, processParsedText, replace, saveToFile, processPDF, getParsedText } = require('../pdf-scrapo.js');

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
