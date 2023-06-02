import fetch from "node-fetch";
export const callOpenApi = async (extractedText, openApiKey) => {
    const url = "https://api.openai.com/v1/chat/completions";

    const data = {
        "model": "gpt-3.5-turbo",
        "messages": [{"role": "user", "content": extractedText}]
    };

    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openApiKey}`,
        },
        body: JSON.stringify(data),
    }

    const response = await fetch(url, params);

    const jsonData = await response.json();
    const { choices } = jsonData;
    if (choices.length) {
        const { message: { content }} = choices[0];
        return content;
    }

    return '';
}
