console.log("Cookie Monster is running...");

//gets the title of the current web page when chrome extension is clicked
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = document.getElementById("page-title");
    title.innerHTML = "<h3> Privacy Policy for: " + tabs[0].title + "</h3>";

});

// Inject content.js into the active tab
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tabs[0].id },
//         files: ["extension/content.js"],
//     });
// });


//when extension clicked get the content of the page
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     //once you have the content of the page, display to popup that it was uptained
//     const extensionContent = document.getElementById("response");
//     extensionContent.innerHTML = "<p> HTML content was obtained<br></p>";

//     //display the content of the page
//     extensionContent.innerHTML += "<br> " + request.content;

//     const privacyPolicy = document.getElementById("privacy-policy-container");
//     privacyPolicy.style.display = "block";

//     //find the privacy policy
//     const content = request.content;
//     findPolicy(content);
// });

//goal of the function is to parse through the content of the page and find the privacy policy 
//go through html 
function findPolicy(content) {
    let keywords = ["privacy policy", "privacy", "policy", "data policy", "data", "cookie", "cookies", "cookie policy", "Privacy Policy", "Privacy", "Policy", "Data Policy", "Data", "Cookie", "Cookies", "Cookie Policy", "PRIVACY POLICY", "PRIVACY", "POLICY", "DATA POLICY", "DATA", "COOKIE", "COOKIES", "COOKIE POLICY"];

    let foundKeywords = keywords.filter((keyword) =>
        content.includes(keyword)
    );
    console.log(foundKeywords);

    chrome.runtime.sendMessage({ type: "found_keywords", keywords: foundKeywords });
}

//get the privacy policy
chrome.runtime.onMessage.addListener ((request) => {
    if (request.type === "found_policy"){
        document.getElementById("response").innerHTML = "<p> Privacy Policy found: </p>";
        
        //display the links that contain the privacy policy
        document.getElementById("privacy-text-placeholder").style.display = "none";

        const links = request.links;
        const privacyLinks = document.getElementById("privacy-policy-text");
        privacyLinks.innerHTML = "<h4> Privacy Policy Links: </h4>";

        
    }
})

// get the content of the links from the content.js file 
//it should be getting the content from the links that contain the privacy policy
// chrome.runtime.onMessage.addListener((request) =>{
//     if (request.type === "link_content"){
//         const links = request.links;

//         console.log(links);
//     }
// });

//fetch the content of the links


chrome.runtime.onMessage.addListener((message => {
    if (message.type === "html_content"){
        console.log("Popup.js received the html content");
        console.log(message.html);
    }
}));

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "text_found") {
        console.log("Popup.js received the text content");
        console.log(message.html);
    }
});