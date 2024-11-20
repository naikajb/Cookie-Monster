console.log("Background.js is running...");

//this will listen to the requests sent by the network to check for cookie-headers
chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    console.log("Network request detected:", details);
    // loop through the headers to check for cookie headers
    details.responseHeaders.forEach((header) => {
      if (header.name.toLowerCase() === "permissions-policy") {
        //console.log("Cookie found: ", header.value);

        //read cookie and send it to popup
        let cookie = parseCookie(header.value);
        console.log("Parsed cookie info: ", cookie);

        //send cookie to popup
        chrome.runtime.sendMessage({ 
          type: 'cookieDetetcted',
          data: cookie,
        });
      }
    });

    return { responseHeaders: details.responseHeaders };
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

function parseCookie(cookie) {
  const cookieInfo = {};
  const attributes = cookie.split("; ");
  
  attributes.forEach((attribute) => {
    const [key, value] = attribute.split("=");
    cookieInfo[key] = value || true;
  });

  return cookieInfo;
}

// this listens to the message sent by the content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "checkForCookie") {
    console.log("Checking for cookie from content.js message...");
    
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.cookies.getAll({ url: tabs[0].url }, (cookies) => {
        console.log("Cookies found: ", cookies);
        
        chrome.tabs.sendMessage(tabs[0].id, {type: 'cookieDetected', data: cookies});
      });
    });
  }
});