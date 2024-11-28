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

    //function send this to backend/app.py
    sendToBackend(results);
    console.log("Here are the results inside of the fetchLinkContent function in content.js: ", results);
  });
}

//gets the html content of the policy pages
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

async function sendToBackend(content) {
  const backendURL = "http://127.0.0.1:5001/receive-content";
  console.log("Sending to backend: ", content);
  var  data = {
    privacyContent: content
  };

  fetch(backendURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response error " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      //htmlContent = data;
      privacySummary = data;
      console.log("Response from backend:", data);
      chrome.runtime.sendMessage({ type: "summary_of_policies", content: privacySummary });
    })
    .catch((error) => {
      console.log("Error sending to backend:", error);
    });

}

