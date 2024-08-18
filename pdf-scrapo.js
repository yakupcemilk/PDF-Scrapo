const fs = require('fs');
const path = require('path');

let pdfData = null;
let parsedText = null;
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
        return null;
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

function replace(parsedText, newText) {
    if (!parsedText) {
        console.error('No parsed text provided.');
        return null;
    }

    if (!newText || newText.length !== parsedText.length) {
        console.error('Invalid new text provided.');
        return null;
    }

    const newContent = parsedText.map((item, index) => ({
        text: newText[index],
        font: item.font
    }));

    let updatedPDF = pdfData;
    parsedText.forEach((item, index) => {
        const regex = new RegExp(`\\(${item.text}\\) Tj`, 'g');
        updatedPDF = updatedPDF.replace(regex, `(${newContent[index].text}) Tj`);
    });

    pdfData = updatedPDF;

    return newContent;
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
