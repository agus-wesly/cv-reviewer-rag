import type { AspectKey } from "./types";

export type Prompt = {
    aspect: AspectKey;
    prompt: string;
};

export const BASE_PROMPT = `
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

export const OVERALL_IMPRESSION_PROMPT = `
Act as a professional CV ATS Reviewer. Your task is to give *Overall Impression* of the provided CV according to your knowledge of ATS aspect. Your review should consists of this following section : 
'''
> Analysis : This section contains your brief analysis of the *Overall Impression* of the CV. The analysis can also highlight the *already good part* or *the lack part* or *both*.
> Score : The number representing your score based on your analysis. The range is in persentage, between 0% and 100%.
'''

The *Analysis* should be simple and highlight the most important parts. Describe the analysis concisely with simple words. Assume that you are talking to the author of the CV. Ignore the HTML character like '<br>' because the *CV Content* is is extracted HTML raw data

CV Content: 
[[CONTENT]]
Output : 

`;

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
    {
        aspect: "overall",
        prompt: "",
    },
];
