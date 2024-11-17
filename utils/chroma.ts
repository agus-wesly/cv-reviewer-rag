import * as pdfjsLib from "pdfjs-dist";
import { ChromaClient, GoogleGenerativeAiEmbeddingFunction } from "chromadb";

const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GOOGLE_API_KEY as string,
});

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

type Collection = Awaited<ReturnType<ChromaClient["getOrCreateCollection"]>>;

let client: ChromaClient | null = null;
let collection: Collection;

export async function getContextFromChroma(aspect: string) {
    try {
        await setupChroma();
        const results = await collection.query({
            queryTexts: `How should I optimize the ${aspect} section in my CV for ATS compatibility?`,
            nResults: 5,
            whereDocument: {
                $or: [
                    {
                        $contains: aspect.toLowerCase(),
                    },
                    {
                        $contains: aspect,
                    },
                ],
            },
        });
        console.log(results.documents[0]);
        return results.documents[0].join("||");
    } catch (error) {
        console.log("err", error);
        return "";
    }
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
