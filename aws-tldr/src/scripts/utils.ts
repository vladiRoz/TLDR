import fetch from 'node-fetch';
import {Readability} from "@mozilla/readability";
import {JSDOM} from 'jsdom';
import { createDocument } from 'domino';
const fs = require('fs');
const got = require('got');

const assert = (object: any, msg: string) => {
  if (!object) {
    throw new Error(msg);
  }
}

export const extractMainContent = (url) => {
  return new Promise((resolve) => {
    got(url).then(response => {
      const html = response.body;
      assert(html, 'fetch issue');
      if (html) {
        const document = new JSDOM(html).window.document;
        const htmlContent = new Readability(document).parse();
        assert(htmlContent, 'parse issue');
        if (htmlContent?.content) {
          const document = createDocument(htmlContent.content);
          resolve(document.documentElement.textContent);
        }
        assert(htmlContent?.content, 'no content');
      }
    });
  });
}

export const fetchWithRetry = async (url, options, maxRetries, retryInterval) => {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response.json();
      } else {
        const error = await response.json();
        const { error: innerError } = error;
        console.error('error', innerError.message);
        throw new Error();
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

  throw new Error('Unable to TLDR');
}

const saveToFile = (html) => {
  fs.writeFile('vladiOutput.html', html, (err) => {
    if (err) {
      console.error('Error saving HTML content:', err);
    } else {
      console.log('HTML content saved to output.html');
    }
  });
}

const fetchMyDocument = async (url) => {
  let response = await fetch(url);
  // check status
  return response.text(); // Replaces body with response
}

export const truncateString = (input: string): string => {
  const maxLength = 4096;

  if (input.length > maxLength) {
    return input.slice(0, maxLength);
  } else {
    return input;
  }
}
















