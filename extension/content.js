console.log("Content.js is running... (GLOABL)");

// const pageContent = document.body.innerText;
// //console.log("page content:", pageContent);

// const pageHTML = document.documentElement.outerHTML; 
// //console.log("Full HTML Content: ", pageHTML);

// //send the content of the page to the background.js when page is loaded
// chrome.runtime.sendMessage({message: "page_content", content: pageContent, html: pageHTML});

function getHTMLContent() {
  console.log("Content.js is running... (LOCAL)");

  const pageContent = document.body.innerText;
  //console.log("page content:", pageContent);

  const pageHTML = document.documentElement.outerHTML;
  //console.log("Full HTML Content: ", pageHTML);

  //send the content of the page to the background.js when page is loaded
  chrome.runtime.sendMessage({ message: "page_content", content: pageContent, html: pageHTML });

}

getHTMLContent();
