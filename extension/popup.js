console.log("Cookie Monster is running...");

var contentForBackend = "";


//sends message to background.js to say it is opened
//receives as a response the content of the found privacy pages
chrome.runtime.sendMessage({ type: "popup_opened" }, (response) => {
    console.log("received from background.js: ", response);

    document.getElementById("response").innerHTML = "<p> Privacy Policy found: </p>";

    //display the links that contain the privacy policy
    document.getElementById("privacy-text-placeholder").style.display = "none";
    const privacyLinks = document.getElementById("privacy-policy-text");
    privacyLinks.innerHTML = "<h4> Privacy Policy Links: </h4>" + response.content;
    console.log("response.content: ", response.content);

    contentForBackend = response.content;
    console.log("contentForBackend: ", contentForBackend);

    sendToBackend(contentForBackend);

});

//gets the title of the current web page when chrome extension is clicked
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = document.getElementById("page-title");
    title.innerHTML = "<h3> Privacy Policy for: " + tabs[0].title + "</h3>";

});


chrome.runtime.onMessage.addListener((message => {if (message.type === "html_content") {
        console.log("Popup.js received the html content");
        console.log(message.html);
    }
}));

chrome.runtime.onMessage.addListener((message) => {if (message.type === "text_found") {
        console.log("Popup.js received the text content");
        console.log(message.html);
    }
});

chrome.runtime.onMessage.addListener((message) => {if (message.type === "links_with_html") {
        console.log("Popup.js received the links with html content");
    }
});


async function sendToBackend(content) {
    const backendURL = "http://127.0.0.1:5001/receive-content";

    const data = {
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
            console.log("Response from backend:", data);
        })
        .catch((error) => {
            console.log("Error sending to backend:", error);
        });
   
}

