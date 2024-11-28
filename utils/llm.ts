import { aspectTitle } from "./chroma";
import { parseResponseFromLLM } from "./formatter";
import { prompts } from "./prompt";
import type { AspectContent, AspectKey } from "./types";
import {
    GenerativeModel,
    GoogleGenerativeAI,
    SchemaType,
    type GenerationConfig,
} from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null;
let model: GenerativeModel | null;

const config: GenerationConfig = {
    temperature: 0.25,
    topP: 0.25,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
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
        },
        required: ["analysis", "keySteps"],
    },
};

const BASE_PROMPT = `
Act as a proffesional CV ATS Reviewer. Your task is to review the *[[ASPECT]]* aspect of the provided CV according to your knowledge and the given guidelines. Your review sould consists of this following section : 
'''
> Analysis : This section contains your brief analysis of the *[[ASPECT]]* aspect of the CV. The analysis can also highlight the *already good part* or *the lack part* or *both*.
> Key Steps : This section contains list of brief step that the author of CV can do based on your analysis. The Key Steps is an array with brief step generated as its item. Key Steps contains maximum 3 of the most important step.
> Score : The number representing your score based on your  analysis. The range is in persentage, between 0% and 100%.
'''

The *Analysis* and *Key Steps* should be simple and highlight the most important parts. Use simple word that easy to understand. Assume that you are talking to the author of the CV. Ignore the HTML character like '<br>' because the *CV Content* is is extracted HTML raw data

You will be given 2 type of guidelines. The *From Document Guidelines* and User Defined Guideline*. Some *From Document Guidelines* sometimes contain irrelevant information about the *[[ASPECT]]* aspect. If such the case, ignore that particular *From Document Guideline*. And *User Defined Guideline* should have higher presedence than the *Document Guidelines*.

Also Consider the following Typescript type for the JSON schema :
  type AspectContent = {
      analysis: string;
      keySteps: Array<string>;
      score: number;
}

You should give the output only in JSON format that match the given JSON AspectContent type.

CV Content: 
[[CONTENT]]

From Document Guideline:
[[DOCUMENT_GUIDELINE]]

User Defined Guidelines : 
[[USER_GUDELINE]]

Output : 
`;

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
            generationConfig: config,
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
    const userGuideline = prompts.find((pr) => pr.aspect === aspectKey);
    if (!userGuideline) throw new Error("User Guideline not found");
    return (
        BASE_PROMPT.replaceAll("[[CONTENT]]", content)
            // TODO
            .replaceAll("[[ASPECT]]", aspectTitle[aspectKey])
            .replaceAll("[[DOCUMENT_GUIDELINE]]", documentGuideline)
            .replaceAll("[[USER_GUDELINE]]", userGuideline.prompt)
    );
}

function setupLLM() {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
}
