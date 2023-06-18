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

















