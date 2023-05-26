const fetch = require("node-fetch");
const callOpenApi = async (extractedText, openApiKey) => {

    console.log('callOpenApi');

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

    console.log('callOpenApi fetching');

    const response = await fetch(url, params);

    console.log('callOpenApi fetch return');

    const jsonData = await response.json();
    const { choices } = jsonData;
    if (choices.length) {
        const { message: { content }} = choices[0];
        return content;
    }

    return '';
}

module.exports.callOpenApi = callOpenApi;
