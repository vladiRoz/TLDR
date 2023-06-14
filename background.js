
// chrome.runtime.onInstalled.addListener(() => {
//     chrome.action.setBadgeText({
//         text: "",
//     });
// });

const extensions = 'chrome://extensions/'
const webstore = 'https://developer.chrome.com/docs/webstore'

const spinnerFrames = ["|", "/", "-", "\\"];

const summerize = async (url) => {

    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    }

    const squeezeUrl = "https://wdfx7nzg1k.execute-api.us-east-1.amazonaws.com/squeeze";

    try {
        const response = await fetch(squeezeUrl, params);
        const jsonData = await response.json();
        if (jsonData) {
            return jsonData;
        }
    } catch (e) {
        console.log('api error', e);
        return '';
    }

    return '';
}

const sendMessageToTab = async (tab, message) => {
    return chrome.tabs.sendMessage(tab.id, message);
}

chrome.action.onClicked.addListener(async (tab) => {
    console.log("onClicked", tab.url);
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    // const prevState = await chrome.action.getBadgeText({tabId: tab.id});
    // Next state will always be the opposite
    // const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    // await chrome.action.setBadgeText({
    //     tabId: tab.id,
    //     text: nextState,
    // });

    let counter = 0;
    const spinnerInterval = setInterval(() => {
        chrome.action.setBadgeText({ text: spinnerFrames[counter % spinnerFrames.length] });
        counter++;
    }, 200);

    console.log('calling summerize');
    // TODO add types to response
    const response = await summerize(tab.url);

    // await chrome.action.setBadgeText({
    //     tabId: tab.id,
    //     text: "Processing",
    // });

    // const response = await new Promise((resolve) =>{
    //     setTimeout(() => {
    //         resolve({
    //             originalLength: 2000,
    //             summeryLength: 200,
    //             summery: 'sending to content The recent slide of Deutsche Bank shares has reignited concerns among investors about the global banking system, leading some to speculate that we may be facing another financial crisis. This time, however, we are more prepared; commercial banks are too big to fail and governments will undoubtedly bail them out. Bitcoin, with its limited supply and resistance against seizure, is seen as a viable alternative to fiat currencies that are inflating away. The recent rise in bitcoin\'s price, particularly from early March, may be a result of investors seeking a hedge against the fall of the US dollar, as well as increasing adoption in the developing world. But widespread adoption will take time, and it\'s crucial for bitcoin\'s advocates to focus on educating different audiences about its advantages and practical uses. The goal should be slow and steady adoption, rather than a sudden surge that could lead to widespread value destruction and government intervention.'
    //         });
    //     }, 1000);
    // });

    chrome.action.setBadgeText({ text: '' });
    clearInterval(spinnerInterval);

    console.log("response", response);
    if (response) {
        const { success, data } = response;
        if (success) {
            try {
                await sendMessageToTab(tab, {
                    action: 'article',
                    data: {
                        summery: data.summery,
                        originalLength: data.originalLength,
                        summeryLength: data.summeryLength,
                    }
                });
            } catch (e) {
                console.log('sendMessageToTab error', e)
            }
        } else {
            console.log("unsuccessful call", data.message);
        }
    } else {
        console.log("empty response");
    }


    // if (nextState === "ON") {
    //     // Insert the CSS file when the user turns the extension on
    //     await chrome.scripting.insertCSS({
    //         files: ["focus-mode.css"],
    //         target: { tabId: tab.id },
    //     });
    // } else if (nextState === "OFF") {
    //     // Remove the CSS file when the user turns the extension off
    //     await chrome.scripting.removeCSS({
    //         files: ["focus-mode.css"],
    //         target: { tabId: tab.id },
    //     });
    // }

});

// executeScript example
// chrome.scripting
//     .executeScript({
//         target : {tabId : getTabId()},
//         files : [ "script.js" ],  // or
//          func : getTitle,
//     })

// loading of async request
// function getTabId() { ... }
// async function addIframe() {
//     const iframe = document.createElement("iframe");
//     const loadComplete =
//         new Promise(resolve => iframe.addEventListener("load", resolve));
//     iframe.src = "https://example.com";
//     document.body.appendChild(iframe);
//     await loadComplete;
//     return iframe.contentWindow.document.title;
// }
//
// chrome.scripting
//     .executeScript({
//         target : {tabId : getTabId(), allFrames : true},
//         func : addIframe,
//     })
//     .then(injectionResults => {
//         for (const frameResult of injectionResults) {
//             const {frameId, result} = frameResult;
//             console.log(`Frame ${frameId} result:`, result);
//         }
//     });
