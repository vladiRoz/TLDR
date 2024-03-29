import {extractMainContent, truncateString} from "./scripts/utils";
import  { callOpenApi } from "./scripts/utils.openai";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// listing url
// https://chromewebstore.google.com/detail/tldrai/ipkcbkclehnfbadlojaoamkjcohjpcmb?pli=1

const secret_name = "my-api-secrets";

// btc article
// sls invoke local -f squeeze --data '{"url":"https://www.coindesk.com/consensus-magazine/2023/04/01/balaji-srinivasans-1m-bitcoin-bet-could-be-right-but-i-hope-hes-wrong/?outputType=amp"}'

// basic html short article
// sls invoke local -f squeeze --data '{"url":"https://www.freecodecamp.org/the-fastest-web-page-on-the-internet"}'

// 9news
// sls invoke local -f squeeze --data '{"url":"https://www.9news.com.au/national/katy-gallagher-senate-statement-denies-misleading-parliament-brittany-higgins-allegations/c410f1cf-b78e-44f5-88e7-14d84e24112b"}'

// moores
// sls invoke local -f squeeze --data '{"url":"https://moores.samaltman.com"}'

// medium
// sls invoke local -f squeeze --data '{"url":"https://medium.com/@HILOofficial/why-choose-hilo-exploring-the-advantages-of-hilo-token-and-the-binary-prediction-platform-d5f73d6c10e6"}'

// sls invoke local -f squeeze --data '{"url":"https://pluralistic.net/2023/12/19/bubblenomics"}'

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
      extractedText = truncateString(extractedText);
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

    let summery;
    try {
      summery = await callOpenApi(extractedText, openApiKey);
    } catch (e) {
      console.log('extractMainContent error', e.message);
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            success: false,
            data: {
              message: e.message,
            },
          },
          null,
          2
        ),
      };
    }

    const wordMatchRegExp = /[^\s]+/g;

    const extractedTextWords = extractedText.matchAll(wordMatchRegExp)
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


