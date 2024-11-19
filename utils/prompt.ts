import type { AspectKey } from "./types";

export type Prompt = {
    aspect: AspectKey;
    prompt: string;
};

export const prompts: Array<Prompt> = [
    {
        aspect: "contactInformation",
        prompt: `
> CV ATS should include *Name*, *Phone Number*, *Email* and *LinkedIn Profile*
> CV ATS should contains proffesional and formal *Email address* and avoid informal one.
`,
    },
    {
        // TODO : IGNORE <br>
        aspect: "errorWriting",
        prompt: `
> CV ATS should contains correct spelling and grammar
> CV ATS should contains  consistent formatting
`,
    },
    {
        aspect: "experience",
        prompt: `
> CV ATS should contains Job Titles, Company names, Dates and Brief Description of responsibilities.
> The Work Experience should contains detailed description and quantifiable results 
`,
    },
];
