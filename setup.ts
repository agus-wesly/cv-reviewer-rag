import { readdir } from "node:fs/promises";
import * as pdfjsLib from "pdfjs-dist";
import {
    ChromaClient,
    GoogleGenerativeAiEmbeddingFunction,
    type Documents,
    type IDs,
} from "chromadb";
import type { TextItem } from "pdfjs-dist/types/src/display/api";

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
    googleApiKey: "AIzaSyAeX_8PudInBdQegoOxcJqU6o3MsOHP53I",
});

async function main() {
    try {
        console.log("=======INITIALIZING CHROMA=======");
        await setupChroma();
        console.log("=======DONE INITIALIZING=======");
        const files = await readdir("./cv");
        let documents = [];
        let ids = [];

        for (let i = 0; i < files.length; ++i) {
            const documentPdf = await pdfjsLib.getDocument("./cv/" + files[i])
                .promise;
            const numberOfPages = documentPdf.numPages;
            for (let i = 1; i <= numberOfPages; ++i) {
                const page = await documentPdf.getPage(i);
                const textContent = await page.getTextContent();
                const items = textContent.items;
                let name = "default";
                let summaryText = "";
                for (let j = 0; j < items.length; ++j) {
                    const currText = items[j] as TextItem;
                    //@ts-ignore
                    if (name !== currText.fontName) {
                        if (name !== "default") {
                            // changed
                            if (summaryText.length > 5) {
                                documents.push(summaryText);
                                ids.push(`id-${i}-${j}-${currText.fontName}`);
                                summaryText = "";
                            }
                        }
                        name = currText.fontName;
                    }
                    summaryText += currText.str;
                }
            }
        }
        await storeInChromaDB(documents, ids);
        console.log("DONE stored");
    } catch (e) {
        console.error("Error", e);
    }
    return 0;
}

async function setupChroma() {
    return new Promise(async (res) => {
        if (!client) {
            client = new ChromaClient({ path: "http://localhost:5555" });
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
        console.log(`DONE EMBEDDING :D Start : ${start} End : ${end}`);
        sleep(50);
        start = end;
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
