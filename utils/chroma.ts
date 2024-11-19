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

const aspectTitle: Record<AspectKey, string> = {
    organizationalActivity: "Organization",
    skill: "Skill",
    summary: "summary",
    education: "Education",
    experience: "Experienece",
    errorWriting: "Error",
    achievment: "Achievment",
    contactInformation: "Contact",
    overallAnalysis: "Overall Analysis",
};

export async function getContextFromChroma(aspect: AspectKey) {
    try {
        await setupChroma();
        const results = await collection.query({
            queryTexts: `How should I optimize the ${aspectTitle[aspect]} section in my CV for ATS compatibility?`,
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
        // TODO : Find good way to separate each chunk & put it inside prompt.
        return results.documents[0].join(" || ");
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
