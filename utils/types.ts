export type AspectContent = {
    analysis: string;
    keySteps: Array<string>;
};

export type Aspect = {
    contactInformation: AspectContent;
    skill: AspectContent;
    summary: AspectContent;
    experience: AspectContent;
    achievment: AspectContent;
    education: AspectContent;
    organizationalActivity: AspectContent;
    errorWriting: AspectContent;
    overallAnalysis: Omit<AspectContent, "keySteps">;
};

export type AspectKey = keyof Aspect;
