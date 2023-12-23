import { fetchWithRetry } from "./utils";
export const callOpenApi = async (extractedText, openApiKey) => {
    const url = "https://api.openai.com/v1/chat/completions";

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": `Summarize: ${extractedText}`}]
    };

    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openApiKey}`,
        },
        body: JSON.stringify(data),
    }

    const response = await fetchWithRetry(url, params, 3, 1000);

    const { choices } = response;
    if (choices.length) {
      const { message: { content }} = choices[0];
      return content;
    }

    throw new Error('Unable to TLDR');
}
