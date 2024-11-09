import type { Aspect, AspectContent, AspectKey } from "./types";

export async function getResponseFromLLM(
    aspect: AspectKey,
    cvContent: string,
    context: string,
): Promise<AspectContent> {
    // TODO : Generate Response From LLM
    return {} as AspectContent;
}
