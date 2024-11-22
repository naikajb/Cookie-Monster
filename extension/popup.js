console.log("Cookie Monster is running...");

//gets the title of the current web page when chrome extension is clicked
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = document.getElementById("page-title");
    title.innerHTML = "<h3> Privacy Policy for: " + tabs[0].title + "</h3>";

});

// Inject content.js into the active tab
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["extension/content.js"],
    });
});


//when extension clicked get the content of the page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //once you have the content of the page, display to popup that it was uptained
    const extensionContent = document.getElementById("response");
    extensionContent.innerHTML = "<p> HTML content was obtained obtained </p>";
    extensionContent.innerHTML += request.content;

    //find the privacy policy
    const content = request.content;

});
