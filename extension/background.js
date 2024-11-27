//console.log("Background.js is running...");
let htmlContent; // store the page contents and then when the popup is clicked this variable is sent to the popup.js

let found = false; 
//listen for change in url and send the content of the page to the content.js
chrome.webNavigation.onCompleted.addListener((details) => {
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ["extension/content.js"]
  });
});

//check that the popup.js is connected before trying to send smtg to it
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {if(message.type === "popup_opened"){
    console.log("Popup opened, sending data");
  }
  sendResponse({ message: "html" ,content: htmlContent });

});


//receive the links containing the privacy policy keywords from the content.js
chrome.runtime.onMessage.addListener((message) => {if (message.type === "found_policy_pages") {
    //console.log("Background.js received the found policy");
    //console.log("message", message);
    //console.log(Array.from(message));

    //fetch the content of the links
    fetchLinkContent(message.links).then((results) => {
      htmlContent = results;
      results.forEach((result) => {
       //console.log("Background.js received the link content");
         //console.log(result);
      return {content: result.content, link: result.link, text: result.text};
       });
    });
    //console.log("htmlContent: ", htmlContent);
    //sendToFront();
  }
});



// helper method to fetch the html of the links
async function fetchLinkContent(links) {
  const results = await Promise.all(
    Array.from(links).map(async (link) => {
      try {
        const response = await fetch(link.href);
        if (response.ok) {
          //this stores the html content of the link --> send it to popup.js
          const html = await response.text();
          return { link: link.href, content: html, text: link.text };
        } else {
          return { link: link.href, error: `Failed to fetch: ${response.status}` };
        }
      } catch (error) {
        return { link: link.href, error: error.message };
      }
    })
  );
  //console.log("Here are the results inside of the fetchLinkContent() function in backround.js: ", results);

  return results;
}

//should be getting the content from the links that contain the privacy policy

//fetch the content of the links
// function fetchLinkContent(links) {
//   const results = Array.from(links).map(async (link) => {
//     try {
//       const response = await fetch(link.href);
//       if (response.ok) {
//         const html = await response.text();
//         return { link: link.href, content: html, text: link.text };
//       } else {
//         return { link: link.href, error: `Failed to fetch: ${response.status}` };
//       }
//     } catch (error) {
//       return { link: link.href, error: error.message };
//     }
//   });
//   console.log(results);
//   return results;
// }

// var linkTest = fetchLinkContent(findLinks());
// console.log("linkTest: ", linkTest);
// chrome.runtime.sendMessage({ type: "link_content", linkContents: linkTest });
