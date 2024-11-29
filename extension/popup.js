console.log("Cookie Monster is running...");

var text = "";


chrome.runtime.sendMessage({ type: "get_summary" }, (response) => {
    console.log("Response from background.js: ", response);
    text = response;
    console.log("text: ", text);
    document.getElementById("response").innerHTML = "<p> Summary of the Privacy policy </p>";
    document.getElementById("privacy-text-placeholder").style.display = "none";
    document.getElementById("privacy-policy-text").innerHTML = text || "<p>No privacy policy found</p>";
});

document.getElementById("privacy-policy-text").innerHTML = text || "<p>No privacy policy found</p>";


