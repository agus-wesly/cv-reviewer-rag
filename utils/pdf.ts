import * as pdfjsLib from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

export async function extractCV(cv: File) {
    const arrayBuf = await cv.arrayBuffer();
    const documentPdf = await pdfjsLib.getDocument(arrayBuf).promise;
    const numberOfPages = documentPdf.numPages;
    let summaryText = "";
    for (let i = 1; i <= numberOfPages; ++i) {
        const page = await documentPdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items;
        let name = "default";
        for (let j = 0; j < items.length; ++j) {
            const currText = items[j] as TextItem;
            if (name !== currText.fontName) {
                if (name !== "default") {
                    // changed
                    summaryText += "<br>";
                }
                name = currText.fontName;
            }
            summaryText += currText.str;
        }
    }
    return summaryText;
}
