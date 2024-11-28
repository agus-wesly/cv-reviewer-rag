import type { AspectKey } from "./types";

export type Prompt = {
    aspect: AspectKey;
    prompt: string;
};

export const prompts: Array<Prompt> = [
    {
        aspect: "profesionalSummary",
        prompt: `
> CV ATSs should contain Professional Summary at the beginning of it.
`,
    },
    {
        aspect: "contactInformation",
        prompt: `
> CV ATS should include *Name*, *Phone Number*, *Email* and *LinkedIn Profile*
> CV ATS should contains proffesional and formal *Email address* and avoid informal one.
`,
    },
    {
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
    {
        aspect: "skill",
        prompt: `
> CV ATS's skill section should be expanded with spesific example.
> CV ATS's Skill section should use *relevant keywords* from the job description.
`,
    },
    {
        aspect: "education",
        prompt: `
> CV ATS should contain relevant coursework or projects  that showcase skill and knowledge
> Relevant coursework or projects may also highlight any academic awards or honors received during studies
`,
    },
];
