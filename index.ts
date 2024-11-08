import { parseArgs } from "util";
import * as pdfjsLib from "pdfjs-dist";
import { ChromaClient, GoogleGenerativeAiEmbeddingFunction } from "chromadb";

const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GOOGLE_API_KEY as string,
});

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

type Collection = Awaited<ReturnType<ChromaClient["getOrCreateCollection"]>>;

let client: ChromaClient | null = null;
let collection: Collection;

async function main() {
    const { values } = parseArgs({
        args: Bun.argv,
        options: {
            query: {
                type: "string",
            },
        },
        allowPositionals: true,
    });
    try {
        console.log("=======INITIALIZING CHROMA=======");
        await setupChroma();
        const results = await collection.query({
            queryTexts: values.query ?? "cv ats",
            nResults: 10,
        });
        console.log(results);
    } catch (error) {
        console.log("err", error);
    }
    return 0;
}

async function setupChroma() {
    return new Promise(async (res, rej) => {
        try {
            if (!client) {
                client = new ChromaClient({ path: process.env.CHROMA_BACKEND_URL });
            }
            collection = await client.getOrCreateCollection({
                name: "my_collection_new",
                embeddingFunction: embedder,
            });
            res(null);
        } catch (error) {
            rej(error);
        }
    });
}

main();
