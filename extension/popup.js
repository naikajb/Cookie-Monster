console.log("Cookie Monster is running...");

var text = "";

//receive the summary policies from the background.js
chrome.runtime.onMessage.addListener((message) => {
    if(message.type == "summary_of_policies"){
        // console.log("Popup.js received the summary of policies");
        // console.log("message", message);
        // document.getElementById("response").innerHTML = "<p> Summary of the Privacy policy </p>";
        // document.getElementById("privacy-text-placeholder").style.display = "none";
        text = message.content.summary;
        console.log("text: ", text);
    }
});

//gets the title of the current web page when chrome extension is clicked
// chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     const title = document.getElementById("page-title");
//     title.innerHTML = "<h3> Privacy Policy for: " + tabs[0].title + "</h3>";
//     document.getElementById("privacy-text-placeholder").style.display = "none";
//     document.getElementById("response").innerHTML = "<p> Summary of the Privacy policy </p>";
//     document.getElementById("privacy-policy-text").innerHTML = "<p>" + text+ "</p>";



// });




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

