console.log("Background.js is running...");

//listen for change in url and send the content of the page to the content.js
chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.scripting.executeScript({
    target: {tabId: details.tabId},
    files: ["extension/content.js"]
  });
});
