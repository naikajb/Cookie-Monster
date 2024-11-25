console.log("Content.js is running... (GLOABL)");
getHTMLContent();

//get the content of the page and the html content
function getHTMLContent() {
  console.log("Content.js is running... (LOCAL)");

  const pageContent = document.body.innerText;

  const pageHTML = document.documentElement.outerHTML;

  //send the content of the page to the background.js when page is loaded
  chrome.runtime.sendMessage({ message: "page_content", content: pageContent, html: pageHTML });

}

chrome.runtime.onMessage.addListener((request) => {
  if (request.type === "found_keywords") {
    console.log("Keywords found: ");
    console.log(request.keywords);
  }
});


// gets all the links on the current pade and returns them as an array of objects
function findLinks() {
  let links = document.querySelectorAll("a");

  let linkDetails = Array.from(links).map((link) => ({
    href: link.href, // Full URL of the link
    text: link.textContent.trim(), // Link text
    target: link.target || "_self", // Target attribute (e.g., _blank)


  }));

  let keywords = ["privacy policy", "privacy", "policy", "data policy", "cookie", "cookies", "cookie policy", "Privacy Policy", "Privacy", "Policy", "Data Policy", "Cookie", "Cookies", "Cookie Policy", "PRIVACY POLICY", "PRIVACY", "POLICY", "DATA POLICY", "COOKIE", "COOKIES", "COOKIE POLICY"];

  //filter out the links that contain the keywords
  let refinedLinkDetails = linkDetails.filter((link) => {
    return keywords.some((keyword) => link.text.includes(keyword));
  }
  );
  //return the links but remove any that could be empty 
  return refinedLinkDetails.filter((link) => link.href !== "");
}

console.log(findLinks());


//send a message that links containing privacy policy (and related words) have been found
chrome.runtime.sendMessage({ type: "found_policy_pages", links: findLinks().reverse() });



// (() => {
//   const fetchLinkContent = async (links) => {
//       const results = await Promise.all(
//           links.map(async (link) => {
//               try {
//                   const response = await fetch(link.href);
//                   if (response.ok) {
//                       const html = await response.text();
//                       return { link: link.href, content: html };
//                   } else {
//                       return { link: link.href, error: `Failed to fetch: ${response.status}` };
//                   }
//               } catch (error) {
//                   return { link: link.href, error: error.message };
//               }
//           })
//       );
//       return results;
//   };

//   // Example usage
//   const links = findLinks();

  

//   //fetchLinkContent(links).then(contents => console.log("this is the fetchLinkContent " +contents[0].content));

//   //send the content of the links to the background.js
//   chrome.runtime.sendMessage({ type: "link_content", links: fetchLinkContent(links) });
// })();