const fs = require('fs');
const path = require('path');

let pdfData = null;
let parsedText = [];
let fontMap = {};


function readPDFFile(filePath) {
    try {
        pdfData = fs.readFileSync(filePath, 'utf8');
        return pdfData;
    } catch (err) {
        console.error(`Could not read the PDF file: ${err.message}`);
        return null;
    }
}

function parsePDF() {
    if (!pdfData) {
        console.error('No PDF data available.');
        return [];
    }

    const lines = pdfData.split('\n');
    const text = [];
    fontMap = {};

    let inStream = false;
    let currentFont = null;

    lines.forEach(line => {
        line = line.trim();

        if (line === "stream") {
            inStream = true;
        } else if (line === "endstream") {
            inStream = false;
        } else if (line.startsWith('/BaseFont')) {
            const match = /\/BaseFont\s\/(\w+)(?:-Bold|-Oblique)?/.exec(line);
            if (match) {
                currentFont = match[1];
                fontMap[currentFont] = match[0];
            }
        } else if (inStream) {
            const match = /\((.*)\) Tj/.exec(line);
            if (match) {
                text.push({ text: match[1], font: currentFont });
            }
        }
    });

    parsedText = text;
    return parsedText;
}

function processParsedText(style) {
    if (!parsedText) {
        console.error('No parsed text available.');
        return null;
    }

    const styleMap = {
        Italic: '-Oblique',
        Bold: '-Bold'
    };

    if (!styleMap[style]) {
        console.error('Invalid style provided.');
        return null;
    }

    parsedText = parsedText.map(item => {
        if (item.font) {
            item.font = `${item.font}${styleMap[style]}`;
        }
        return item;
    });

    return parsedText;
}

function replace(parsedText, newTexts) {
    if (!Array.isArray(parsedText)) {
        console.error('Parsed text is not an array.');
        return null;
    }

    if (!Array.isArray(newTexts)) {
        console.error('New texts should be an array.');
        return null;
    }

    if (parsedText.length !== newTexts.length) {
        console.error('Parsed text and new texts arrays do not match in length.');
        return null;
    }

    return parsedText.map((item, index) => ({
        text: newTexts[index] || item.text,
        font: item.font
    }));
}

function saveToFile(filename) {
    if (!pdfData || !parsedText) {
        console.error('No data available.');
        return;
    }

    const combinedContent = `\n\n${pdfData}\n\n`;
    fs.writeFileSync(filename, combinedContent, 'utf8');
}

function processPDF(inputFilePath, outputFilePath) {
    readPDFFile(inputFilePath);
    parsePDF();
    saveToFile(outputFilePath);
}

module.exports = {
    readPDFFile,
    parsePDF,
    processParsedText,
    replace,
    saveToFile,
    processPDF,
    getPdfData: () => pdfData,
    getParsedText: () => parsedText
};
