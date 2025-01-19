export type AspectContent = {
    analysis: string;
    keySteps: Array<string>;
    score: number;
};

export type Aspect = {
    contactInformation: AspectContent;
    skill: AspectContent;
    profesionalSummary: AspectContent;
    experience: AspectContent;
    education: AspectContent;
    errorWriting: AspectContent;
    overall: Omit<AspectContent, "keySteps">;
};

export type AspectKey = keyof Aspect;
