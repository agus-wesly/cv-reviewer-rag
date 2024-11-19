import {
    GenerativeModel,
    GoogleGenerativeAI,
    SchemaType,
    type GenerationConfig,
} from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null;
let model: GenerativeModel | null;

const generationConfig: GenerationConfig = {
    temperature: 0.3,
    topP: 0.15,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
            knowledge: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.STRING,
                },
            },
        },
    },
};

export async function getPreprocessedChunks(
    cvContent: string,
): Promise<Array<string>> {
    try {
        setupLLM();
        if (!genAI || !model) throw new Error("Error setup LLM !");
        const chatSession = model.startChat({
            generationConfig,
        });
        const result = await chatSession.sendMessage(cvContent);
        const responseText = result.response.text();
        return parseResponseText(responseText);
    } catch (error) {
        console.log("Something went wrong", error);
        return [];
    }
}
function parseResponseText(responseText: string): Array<string> {
    const replaced = responseText.replaceAll("```json", "").replaceAll("```", "");
    try {
        const parsed = JSON.parse(replaced);
        return parsed.knowledge;
    } catch (error) {
        console.log("Parsing Error", error);
        return [];
    }
}

function setupLLM() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction:
                "Act as document parser that can turn unstructured data extracted from document into desired json format. I will provide you with text data extracted from CV ATS Guideline document. I want you to analyze that document get the knowledge required to make ATS CV. Every knowledge you provide should following this format :  \n\n'CV ATS should have <BRIEFANALYZED_ASPECT>. <THE REST OF EXPLANATION>'\n\nYour response should be in json like format and for each knowledge should be stored inside an array. Each knowledge string should contain plain string without any formatting symbol ",
        });
    }
}
