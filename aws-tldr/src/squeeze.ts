import { extractMainContent } from "./scripts/utils";
import  { callOpenApi } from "./scripts/utils.openai";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const secret_name = "my-api-secrets";

// btc article
// sls invoke local -f squeeze --data '{"url":"https://www.coindesk.com/consensus-magazine/2023/04/01/balaji-srinivasans-1m-bitcoin-bet-could-be-right-but-i-hope-hes-wrong/?outputType=amp"}'

// basic html short article
// sls invoke local -f squeeze --data '{"url":"https://www.freecodecamp.org/the-fastest-web-page-on-the-internet"}'

// 9news
// sls invoke local -f squeeze --data '{"url":"https://www.9news.com.au/national/katy-gallagher-senate-statement-denies-misleading-parliament-brittany-higgins-allegations/c410f1cf-b78e-44f5-88e7-14d84e24112b"}'

// moores
// sls invoke local -f squeeze --data '{"url":"https://moores.samaltman.com"}'

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

    console.log('url', url);

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
                    success: false,
                    data: {
                      message: 'failed loading secrets',
                    },
                },
                null,
                2
            ),
        };
    }

    const { openApiKey } = JSON.parse(secret);

    let extractedText;
    try {
      extractedText = await extractMainContent(url);
    } catch (e) {
      console.log('extractMainContent error', e);
        return {
          statusCode: 400,
          body: JSON.stringify(
            {
              success: false,
              data: {
                message: 'failed to extract',
              },
            },
            null,
            2
          ),
        };
    }

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
              success: true,
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


