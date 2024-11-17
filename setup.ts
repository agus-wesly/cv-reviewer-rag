import { readdir } from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist";
import {
    ChromaClient,
    GoogleGenerativeAiEmbeddingFunction,
    type Documents,
    type IDs,
} from "chromadb";
import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { splitText } from "./utils/pdf";

// import {OllamaEmbeddingFunction} from "chromadb";
// const embedder = new OllamaEmbeddingFunction({
//     url: "http://127.0.0.1:11434/api/embeddings",
//     model: "llama2"
// })

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

type Collection = Awaited<ReturnType<ChromaClient["getOrCreateCollection"]>>;

let client: ChromaClient | null = null;
let collection: Collection;

const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GOOGLE_API_KEY as string,
});

async function main() {
    try {
        console.log("=======INITIALIZING CHROMA=======");
        await setupChroma();
        console.log("=======DONE INITIALIZING=========");
        const files = await readdir("./cv");

        for (let i = 0; i < 15; ++i) {
            let document = [];
            const documentPdf = await pdfjsLib.getDocument("./cv/" + files[i])
                .promise;
            const numberOfPages = documentPdf.numPages;
            for (let j = 1; j <= numberOfPages; ++j) {
                const page = await documentPdf.getPage(j);
                const textContent = await page.getTextContent();
                const items = textContent.items;
                let name = "default";
                let summaryText = "";
                for (let k = 0; k < items.length; ++k) {
                    const currText = items[k] as TextItem;
                    //@ts-ignore
                    if (name !== currText.fontName) {
                        if (name !== "default") {
                            // changed
                            if (summaryText.length > 5) {
                                document.push(summaryText);
                                summaryText = "";
                            }
                        }
                        name = currText.fontName;
                    }
                    summaryText += currText.str;
                }
            }
            const documentText = document.join("<br>");
            const [documents, ids] = await splitText(documentText, 500, 150);
            console.log("⚱️PStoring documents with index : " + i);
            await storeInChromaDB(documents, ids);
            console.log("✅ Done Storing documents with index : " + i);
            await sleep(1000);
        }
    } catch (e) {
        console.error("Error", e);
    }
    return 0;
}

async function setupChroma() {
    return new Promise(async (res) => {
        if (!client) {
            client = new ChromaClient({ path: process.env.CHROMA_BACKEND_URL });
        }
        collection = await client.getOrCreateCollection({
            name: "my_collection_new",
            embeddingFunction: embedder,
        });
        res(null);
    });
}

const MAX_ITEM = 100;
async function storeInChromaDB(documents: Documents, ids: IDs) {
    let start = 0;
    while (start < documents.length) {
        let end = start + MAX_ITEM;
        await collection.add({
            documents: documents.slice(start, end),
            ids: ids.slice(start, end),
        });
        start = end;
        await sleep(50);
    }
    Promise.resolve(null);
}

async function sleep(time: number) {
    return new Promise((res) => {
        setTimeout(() => {
            res(null);
        }, time || 50);
    });
}

await main();
