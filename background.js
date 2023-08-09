
const summerize = (url) => {

    const params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
    }

    const squeezeUrl = "https://wdfx7nzg1k.execute-api.us-east-1.amazonaws.com/squeeze";

    return fetch(squeezeUrl, params);
}

const sendMessageToTab = async (tab, message) => {
    return chrome.tabs.sendMessage(tab.id, message);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.eventType === 'summery') {

        const {url} = message.data;
        summerize(url)
            .then((res) => {
                return res.json();
            }).then((response) => {
                console.log('** response', response);
                if (response) {
                    const { success } = response;
                    sendResponse({
                        success,
                        responseEventType: 'summarizedArticle',
                        data: success ? response.data : { message: response.data.message },
                    });
                } else {
                    sendResponse({ success: false, data: { message: 'failure1' } });
                }
            }).catch((reason) => {
                console.log('** catch', reason);
                sendResponse({ success: false, data: { message: 'failure2' } });
            });

        return true;
    }
});

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.eventType === 'summery') {
//
//         setTimeout(() => {
//             const response = {
//                 success: true,
//                 data: {
//                     originalLength: 2000,
//                     summeryLength: 200,
//                     summery: 'DEMO sending to content The recent slide of Deutsche Bank shares has reignited concerns among investors about the global banking system, leading some to speculate that we may be facing another financial crisis. This time, however, we are more prepared; commercial banks are too big to fail and governments will undoubtedly bail them out. Bitcoin, with its limited supply and resistance against seizure, is seen as a viable alternative to fiat currencies that are inflating away. The recent rise in bitcoin\'s price, particularly from early March, may be a result of investors seeking a hedge against the fall of the US dollar, as well as increasing adoption in the developing world. But widespread adoption will take time, and it\'s crucial for bitcoin\'s advocates to focus on educating different audiences about its advantages and practical uses. The goal should be slow and steady adoption, rather than a sudden surge that could lead to widespread value destruction and government intervention.'
//                 }
//             };
//
//         console.log('** sending demo response back', response);
//
//             // sendResponse({
//             //     success: true,
//             //     responseEventType: 'summarizedArticle',
//             //     data: response.data,
//             // });
//
//             sendResponse({
//                 success: false,
//                 data: {
//                     message: "failure"
//                 },
//             });
//
//         }, 1000);
//
//         return true;
//     }
// });
