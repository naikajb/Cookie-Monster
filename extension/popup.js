console.log("Cookie Monster is running...");


//this will listen to the requests sent by the network to check for cookie-headers
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "cookieDetected") {
    
    //this will display the cookie data in the popup
    const cookieData = document.getElementById('cookie-data');
    cookieData.innerHTML = JSON.stringify(message.data, null, 2);
    }else{
        console.log("No cookie detected");
    }
})




