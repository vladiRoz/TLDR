
console.log("content loaded 1");

// function removeSpinner(){
//     const spinner = document.getElementById("spinner");
//     if (spinner) {
//         spinner.remove();
//     }
// }
//
// function showSpinner() {
//     const article = document.querySelector("article");
//     const spinner = document.createElement("div");
//     spinner.id = "spinner";
//
//     article.appendChild(spinner);
//
//     // Support for API reference docs
//     const heading = article.querySelector("h1");
//     // Support for article docs with date
//     const date = article.querySelector("time")?.parentNode;
//     (date ?? heading).insertAdjacentElement("afterend", spinner);
// }

function showSummery(data) {
    const { summery, originalLength, summeryLength } = data;
    const article = document.querySelector("article");
    if (article) {
        console.log('in article');

        const readingTime = Math.round((originalLength - summeryLength) / 200);
        const readTimeText = `⏱ saved ${readingTime} min read`;

        const div = document.createElement("div");

        const originalReadTimeP = document.createElement("p");
        // Use the same styling as the publish information in an article's header
        originalReadTimeP.classList.add("color-secondary-text", "type--caption");
        originalReadTimeP.textContent = readTimeText;

        const summeryP = document.createElement("p");
        summeryP.textContent = summery;

        div.appendChild(originalReadTimeP);
        div.appendChild(summeryP);

        // Support for API reference docs
        const heading = article.querySelector("h1");
        // Support for article docs with date
        const date = article.querySelector("time")?.parentNode;
        (date ?? heading).insertAdjacentElement("afterend", div);
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.action === 'article') {
            // removeSpinner();
            showSummery(request.data);
        } else if (request.action === 'inflight'){
            console.log('inflight');
            // showSpinner();
        }
    }
);
