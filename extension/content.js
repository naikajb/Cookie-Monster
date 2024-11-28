console.log("Content.js is running... (GLOABL)");
//getHTMLContent();
findLinks();
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


  fetchLinkContent(refinedLinkDetails).then((results) => {
      
    results.forEach((result) => {
      return {content: result.content, link: result.link, text: result.text};
    });

    chrome.runtime.sendMessage({ type: "found_policy_pages", links: results });
    console.log("Here are the results inside of the fetchLinkContent function in content.js: ", results);
  });
}

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
  //console.log("Here are the results inside of the fetchLinkContent() function in content.js: ", results);

  return results;
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "summary_of_policies_received") {
    console.log("Summary of policies is received in content.js");
  }
});

//send a message that links containing privacy policy (and related words) have been found
//chrome.runtime.sendMessage({ type: "found_policy_pages", links: findLinks().reverse() });

//get the content of the page and the html content
// function getHTMLContent() {
//   console.log("Content.js is running... (LOCAL)");

//   const pageContent = document.body.innerText;

//   const pageHTML = document.documentElement.outerHTML;

//   //send the content of the page to the background.js when page is loaded
//   chrome.runtime.sendMessage({ message: "page_content", content: pageContent, html: pageHTML });

// }

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