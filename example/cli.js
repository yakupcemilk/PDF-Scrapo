const readline = require('readline');
const path = require('path');
const { processPDF, getPdfData, getParsedText } = require('../pdf-scrapo.js');

// Set up command line interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for PDF file name
rl.question('Please enter the PDF file name (including extension): ', (inputFileName) => {
    const inputFilePath = path.join(__dirname, inputFileName);
    const outputFilePath = path.join(__dirname, 'output.txt');

    processPDF(inputFilePath, outputFilePath);

    // Display raw PDF data and parsed text
    console.log('RAW PDF DATA:\n');
    console.log(getPdfData());
    console.log('PARSED TEXT:\n');
    console.log(getParsedText());

    rl.close();
});
