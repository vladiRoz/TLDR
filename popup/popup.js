console.log("This is a popup!");

document.addEventListener('DOMContentLoaded', function() {

    const loadingElement = document.getElementById('loading-container');
    const popupElement = document.getElementById('content');
    const header = document.getElementById('header-container');

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        console.log('** url', url);

        chrome.runtime.sendMessage({ eventType: 'summery', data: { url: url } }, function (res) {

            console.log('res', res);

            const { responseEventType, data } = res;

            if (responseEventType === 'summarizedArticle') {

                const { originalLength, summeryLength, summery } = data;

                loadingElement.style.display = 'none';
                popupElement.style.display = 'flex';
                header.style.display = 'flex';

                document.getElementById('header-title').innerText = `Title`;
                const readingTime = Math.round((originalLength - summeryLength) / 200);
                document.getElementById('header-text').innerText = ` saved ${readingTime} min read`;
                document.getElementById('content').innerText = summery;

            } else if (responseEventType === 'inflight') {
                console.log('inflight');
            }
        });
    });
});

