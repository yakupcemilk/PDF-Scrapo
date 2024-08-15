const fs = require('fs');
const path = require('path');

// Internal state of the library
let pdfData = null;
let parsedText = null;

// Reads the PDF file from the specified file path
function readPDFFile(filePath) {
    try {
        pdfData = fs.readFileSync(filePath, 'utf8');
        return pdfData;
    } catch (err) {
        console.error(`Could not read the PDF file: ${err.message}`);
        return null;
    }
}

// Parses the PDF data and extracts text
function parsePDF() {
    if (!pdfData) {
        console.error('No PDF data available.');
        return null;
    }

    const lines = pdfData.split('\n');
    const text = [];

    let inStream = false;

    lines.forEach(line => {
        line = line.trim();

        if (line === "stream") {
            inStream = true;
        } else if (line === "endstream") {
            inStream = false;
        } else if (inStream) {
            const match = /\((.*)\) Tj/.exec(line);
            if (match) {
                text.push(match[1]);
            }
        }
    });

    parsedText = text.join('\n');
    return parsedText;
}

// Saves the raw PDF data and parsed text to a file
function saveToFile(filename) {
    if (!pdfData || !parsedText) {
        console.error('No data available.');
        return;
    }

    const combinedContent = `RAW PDF DATA:\n\n${pdfData}\n\nPARSED TEXT:\n\n${parsedText}`;
    fs.writeFileSync(filename, combinedContent, 'utf8');
}

// Processes the PDF file and saves the results to a text file
function processPDF(inputFilePath, outputFilePath) {
    readPDFFile(inputFilePath);
    parsePDF();
    saveToFile(outputFilePath);
}

// Module exports
module.exports = {
    readPDFFile,
    parsePDF,
    saveToFile,
    processPDF,
    getPdfData: () => pdfData,
    getParsedText: () => parsedText
};
