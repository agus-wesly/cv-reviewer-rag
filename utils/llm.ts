import { aspectTitle } from "./chroma";
import { parseResponseFromLLM } from "./formatter";
import { BASE_PROMPT, OVERALL_IMPRESSION_PROMPT, prompts } from "./prompt";
import type { AspectContent, AspectKey } from "./types";
import {
    GenerativeModel,
    GoogleGenerativeAI,
    SchemaType,
    type GenerationConfig,
    type Schema,
} from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null;
let model: GenerativeModel | null;

export async function getResponseFromLLM(
    aspect: AspectKey,
    cvContent: string,
    context: string,
): Promise<AspectContent | null> {
    let text;
    try {
        setupLLM();
        if (!genAI || !model) throw new Error("Error setup LLM !");

        const prompt = getPrompt(aspect, cvContent, context);
        const result = await model.generateContent({
            generationConfig: getConfig(aspect),
            contents: [{ role: "user", parts: [{ text: prompt }] }],
        });
        text = result.response.text();
        const aspectContentGenerated = parseResponseFromLLM<AspectContent>(text);
        return aspectContentGenerated;
    } catch (error) {
        console.log("Something went wrong", error);
        return null;
    }
}

function getPrompt(
    aspectKey: AspectKey,
    content: string,
    documentGuideline: string,
) {
    if (aspectKey === "overall")
        return OVERALL_IMPRESSION_PROMPT.replaceAll("[[CONTENT]]", content);

    const userGuideline = prompts.find((pr) => pr.aspect === aspectKey);
    if (!userGuideline) throw new Error("User Guideline not found");
    return BASE_PROMPT.replaceAll("[[CONTENT]]", content)
        .replaceAll("[[ASPECT]]", aspectTitle[aspectKey])
        .replaceAll("[[DOCUMENT_GUIDELINE]]", documentGuideline)
        .replaceAll("[[USER_GUDELINE]]", userGuideline.prompt);
}

function getConfigProperties(aspectKey: AspectKey): Schema["properties"] {
    if (aspectKey === "overall") {
        return {
            analysis: {
                type: SchemaType.STRING,
            },
            score: {
                type: SchemaType.NUMBER,
            },
        };
    }
    return {
        analysis: {
            type: SchemaType.STRING,
        },
        keySteps: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.STRING,
            },
        },
        score: {
            type: SchemaType.NUMBER,
        },
    };
}

function getConfig(aspectKey: AspectKey): GenerationConfig {
    return {
        temperature: 0.25,
        topP: 0.25,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
            type: SchemaType.OBJECT,
            properties: getConfigProperties(aspectKey),
            required: ["analysis", "score"],
        },
    };
}

function setupLLM() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
}
