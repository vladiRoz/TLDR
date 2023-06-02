import { extractMainContent } from "./scripts/utils";
import  { callOpenApi } from "./scripts/utils.openai";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secret_name = "my-api-secrets";

export async function squeeze(event) {

    let url;
    if (event.url) {
        url = event.url;
    } else if (event.body) {
        const { body } = event;
        if (typeof body === 'string') {
            const params = JSON.parse(body);
            url = params.url;
        } else {
            url = body.url;
        }
    } else {
        return {
            statusCode: 401,
            body: JSON.stringify(
                {
                    data: 'no url',
                },
                null,
                2
            ),
        };
    }

    console.log('url', url)

    const client = new SecretsManagerClient({
        region: "us-east-1",
    });

    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
    } catch (error) {
        throw error;
    }

    const secret = response.SecretString;
    if (!secret){
        return {
            statusCode: 400,
            body: JSON.stringify(
                {
                    data: 'failed loading secrets',
                },
                null,
                2
            ),
        };
    }

    const { openApiKey } = JSON.parse(secret);

    const extractedText = await extractMainContent(url);
    const summery = await callOpenApi(extractedText, openApiKey);

    const wordMatchRegExp = /[^\s]+/g;

    const extractedTextWords = extractedText.matchAll(wordMatchRegExp);
    const extractedTextWordsCount = [...extractedTextWords].length;

    const summeryWords = summery.matchAll(wordMatchRegExp);
    const summeryWordsCount = [...summeryWords].length;

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                data: {
                    summery,
                    originalLength: extractedTextWordsCount,
                    summeryLength: summeryWordsCount,
                },
            },
            null,
            2
        ),
    };
}


