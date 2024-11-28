console.log("Cookie Monster is running...");

var contentForBackend = "";


//sends message to background.js to say it is opened
//receives as a response the content of the found privacy pages
chrome.runtime.sendMessage({ type: "popup_opened" }, (response) => {
    console.log(response);
    document.getElementById("response").innerHTML = "<p> Summary of the Privacy policy </p>";
    document.getElementById("privacy-text-placeholder").style.display = "none";
    document.getElementById("privacy-policy-text").innerText = response.content.summary;
    //console.log("response.content: ", response.content.summary);

});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "privacy_summary") {
        console.log("Popup received the privacy summary");
        console.log("message", message.summary);
    }

});
//gets the title of the current web page when chrome extension is clicked
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = document.getElementById("page-title");
    title.innerHTML = "<h3> Privacy Policy for: " + tabs[0].title + "</h3>";

});


// async function sendToBackend(content) {
//     const backendURL = "http://127.0.0.1:5001/receive-content";

//     const data = {
//         privacyContent: content
//     };

//     fetch(backendURL, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(data)
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error("Network response error " + response.status);
//             }
//             return response.json();
//         })
//         .then((data) => {
//             console.log("Response from backend:", data);
//         })
//         .catch((error) => {
//             console.log("Error sending to backend:", error);
//         });
   
// }

