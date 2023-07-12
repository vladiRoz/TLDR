console.log("This is a popup!");

document.addEventListener('DOMContentLoaded', function() {
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
                popupElement.style.display = 'block';

                const readingTime = Math.round((originalLength - summeryLength) / 200);
                document.getElementById('header').innerText = `⏱ saved ${readingTime} min read`;
                document.getElementById('content').innerText = summery;
                document.getElementById('footer').style.backgroundColor = '#ccc';

            } else if (responseEventType === 'inflight') {
                console.log('inflight');
            }
        });
    });

    // Get the loading and popup elements
    const loadingElement = document.getElementById('loading');
    const popupElement = document.getElementById('popup');

    // Show loading state
    loadingElement.style.display = 'block';
    popupElement.style.display = 'none';


});

