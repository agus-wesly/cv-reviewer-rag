import * as pdfjsLib from "pdfjs-dist";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { getContextFromChroma } from "./chroma";
import { getResponseFromLLM } from "./llm";
import type { Aspect, AspectContent, AspectKey } from "./types";

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

export async function processCV(cvContent: string): Promise<Aspect> {
    const aspect = {} as Aspect;
    for (const aspectKey of Object.keys(aspect)) {
        /* Set default value so if something went wrong,
            we still got something to display.*/
        const defaultResponse: AspectContent = {
            analysis: "",
            keySteps: [],
        };
        aspect[aspectKey as AspectKey] = defaultResponse;

        const retrievedContext = await getContextFromChroma(aspectKey);
        const responseFromLLM = await getResponseFromLLM(
            aspectKey as AspectKey,
            cvContent,
            retrievedContext,
        );
        if (responseFromLLM) {
            aspect[aspectKey as AspectKey] = responseFromLLM;
        }
    }

    return aspect;
}
