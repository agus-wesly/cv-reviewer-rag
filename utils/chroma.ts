import * as pdfjsLib from "pdfjs-dist";
import { ChromaClient, GoogleGenerativeAiEmbeddingFunction } from "chromadb";
import type { AspectKey } from "./types";

const embedder = new GoogleGenerativeAiEmbeddingFunction({
    googleApiKey: process.env.GOOGLE_API_KEY as string,
});

pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.mjs";

type Collection = Awaited<ReturnType<ChromaClient["getOrCreateCollection"]>>;

let client: ChromaClient | null = null;
let collection: Collection;

export const aspectTitle: Record<AspectKey, string> = {
    skill: "Skill",
    profesionalSummary: "Professional Summary",
    education: "Education and Academic Achievments",
    experience: "Experienece",
    errorWriting: "Error in Writing and Grammar",
    contactInformation: "Contact Information",
    overall: "Overall Analysis",
};

export async function getContextFromChroma(aspect: AspectKey): Promise<string> {
    if (aspect === "overall") return "";
    try {
        await setupChroma();
        const results = await collection.query({
            queryTexts: `CV ATS guidelines in terms of ${aspectTitle[aspect]} are`,
            nResults: 10,
        });
        // console.log("Retrieved information for aspect " + aspect);
        // console.log(results.documents[0]);
        return results.documents[0].join("\n");
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
