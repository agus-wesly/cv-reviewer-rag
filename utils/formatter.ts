export function parseResponseFromLLM<T = any>(textResponse: string) {
    const parsed = textResponse
        .replaceAll("```json```", "")
        .replaceAll("```", "");
    const aspectContentGenerated = JSON.parse(parsed) as T;
    return aspectContentGenerated;
}
