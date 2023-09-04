
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

// DEVELOPMENT DUMMY DEMO
// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//     if (message.eventType === 'summery') {
//
//         setTimeout(() => {
//             const response = {
//                 success: true,
//                 data: {
//                     originalLength: 2000,
//                     summeryLength: 200,
//                     summery: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
//                 }
//             };
//
//         console.log('** sending demo response back', response);
//
//             sendResponse({
//                 success: true,
//                 responseEventType: 'summarizedArticle',
//                 data: response.data,
//             });
//
//             // sendResponse({
//             //     success: false,
//             //     data: {
//             //         message: "failure"
//             //     },
//             // });
//
//         }, 1000);
//
//         return true;
//     }
// });
