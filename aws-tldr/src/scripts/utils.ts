import { createDocument } from "domino";
import { Parse } from "dom-readability";
import fetch from 'node-fetch';

const fetchMyDocument = async (url) => {
    let response = await fetch(url);
    // check status
    return response.text(); // Replaces body with response
}

export const extractMainContent = async (url) => {
    try {
        const html = await fetchMyDocument(url);
        if (html) {
            const htmlContent = Parse(html);
            if (htmlContent?.content) {
                const document = createDocument(htmlContent.content);
                return document.documentElement.textContent;
            }
        }
    } catch (err) {
        console.log('runReadability error:' + err); // Error handling
    }

    return '';
}
