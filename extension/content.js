//this will send a message to the background.js to check for cookie headers
chrome.runtime.sendMessage({ type: 'checkForCookie' });

//this will listen to the message sent by the background.js when cookies are found
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'cookiesFound') {
      console.log("Cookies for this page:", message.data);
      
      // Optionally display or process cookies in the DOM here
    }
  });

  console.log("Content.js is running...");