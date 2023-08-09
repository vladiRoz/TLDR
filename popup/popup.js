console.log("This is a popup!");

document.addEventListener('DOMContentLoaded', function() {

    const loadingElement = document.getElementById('loading-container');
    const popupElement = document.getElementById('content');
    const header = document.getElementById('header-container');
    const content = document.getElementById('content');

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        console.log('** url', url);

        chrome.runtime.sendMessage({ eventType: 'summery', data: { url: url } }, function (res) {

            console.log('res', res);

            const { success, responseEventType, data } = res;

            loadingElement.style.display = 'none';
            popupElement.style.display = 'flex';
            header.style.display = 'flex';

            if (success) {
                if (responseEventType === 'summarizedArticle') {
                    const { originalLength, summeryLength, summery } = data;
                    const readingTime = Math.round((originalLength - summeryLength) / 200);
                    document.getElementById('header-subtitle-text').innerText = ` saved ${readingTime} min read`;
                    content.innerText = summery;
                }
            } else {
                content.style.display = 'none';
                document.getElementById('failure-container').style.display = 'flex';
                document.getElementById('header-subtitle').style.visibility = 'hidden';
            }
        });
    });
});

