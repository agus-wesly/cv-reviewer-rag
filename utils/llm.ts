import type { AspectContent, AspectKey } from "./types";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null;
let model: GenerativeModel | null;

const BASE_PROMPT =
    "You are a smart CV ATS Reviewer. Your task is to analyze the CV so that it matches ATS format. You will also be provided with guidelines that you can use to help you analyzing. Hopefully your analysis can help them improve their CV so it match ATS format. Please not that you should give response with standar text only, without the markdown formatting and is parseable with JSON.parse method of javascript!";

export async function getResponseFromLLM(
    aspect: AspectKey,
    cvContent: string,
    context: string,
): Promise<AspectContent | null> {
    try {
        setupLLM();
        if (!genAI || !model) throw new Error("Error setup LLM !");

        const prompt = `
        Consider this following CV content extracted from a PDF document.
        CV : '${cvContent}'

        Consider this guideline extracted from a document.
        Guideline : '${context}'

        Consider the following Typescript type for the JSON schema : 
            'type AspectContent = {
                analysis: string;
                keySteps: Array<string>;
            }'

        Your task is to analyze the CV so that it matches ATS format. Spesifically about the aspect : ${aspect} of the CV. You can use the guideline provided as your additional tools to help you analyze it. Give the output only in JSON format that match the given JSON AspectContent type.
`;
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: BASE_PROMPT }],
                },
            ],
        });
        const { response } = await chat.sendMessage(prompt);
        const text = response.text();
        console.log("text: ", text);
        // TODO : Create parser to parse the output from LLM
        const aspectContentGenerated = JSON.parse(text) as AspectContent;
        return aspectContentGenerated;
    } catch (error) {
        console.log("Something went wrong", error);
        return null;
    }
}

function setupLLM() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
}
