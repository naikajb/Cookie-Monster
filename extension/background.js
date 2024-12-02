console.log("Background.js is running...");
let htmlContent; // store the page contents and then when the popup is clicked this variable is sent to the popup.js
var privacySummary;

//listen for change in url and send the content of the page to the content.js
// chrome.webNavigation.onCompleted.addListener((details) => {
//   chrome.scripting.executeScript({
//     target: { tabId: details.tabId },
//     files: ["extension/content.js"]
//   });
// });

//receive the links containing the privacy policy keywords from the content.js
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "summary_of_policies") {
    console.log("Background.js received the summary");
    console.log("summary : ", message.content);

    privacySummary = message.content.summary;
    chrome.sendMessage({type: "summary", content: message.content});
    //console.log("Background.js received the found policy");
    //console.log("message", message);
    //console.log(Array.from(message));

    //fetch the content of the links
    // fetchLinkContent(message.links).then((results) => {


    //   results.forEach((result) => {
    //   return {content: result.content, link: result.link, text: result.text};
    //    });
    //    htmlContent = results;
    // });


    //console.log("htmlContent: ", htmlContent);
    //sendToFront();

    //send the content of the links to the backend
    //sendToBackend(message.links);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type === "get_summary"){
    console.log("Background.js received the request for the summary");
    //console.log("message : ", privacySummary);
    
    sendResponse(privacySummary);
  }
})

