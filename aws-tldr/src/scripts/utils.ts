import { createDocument } from "domino";
import fetch from 'node-fetch';
import { Readability } from "@mozilla/readability";
import { JSDOM } from 'jsdom';

const fetchMyDocument = async (url) => {
    let response = await fetch(url);
    // check status
    return response.text(); // Replaces body with response
}

const assert = (object: any, msg: string) => {
  if (!object) {
    throw new Error(msg);
  }
}

export const extractMainContent = async (url) => {
    const html = await fetchMyDocument(url);
    assert(html, 'fetch issue');
    if (html) {
      const document = new JSDOM(html).window.document;
      const htmlContent = new Readability(document).parse();
        assert(htmlContent, 'parse issue');
        if (htmlContent?.content) {
            const document = createDocument(htmlContent.content);
            return document.documentElement.textContent;
        }
        assert(htmlContent?.content, 'no content');
    }

    return '';
}

export const fetchWithRetry = async(url, options, maxRetries, retryInterval) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response.json();
      } else {
        // Optionally, you can handle non-2xx responses and retry if needed.
        console.log('Non-2xx response:', response.status);
        throw new Error('Non-2xx response');
      }
    } catch (error) {
      console.error('retrying retries: ', retries);
      console.error('openApi error', error.message);
      retries++;

      if (retries < maxRetries) {
        // Wait for the specified interval before retrying.
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  }

  throw new Error('Max retries exceeded.');
}
















