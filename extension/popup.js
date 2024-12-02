console.log("Cookie Monster is running...");

var text = "";
document.getElementById("get-privacy-analysis-button").onclick = () => {
    console.log("Clicked get-privacy-analysis-button");
    document.getElementById("get-privacy-analysis-button").style.display = "none";
    document.getElementsByClassName("loader")[0].style.display = "block";
    
    //document.getElementById("response").style.display = "flex";
    //document.getElementById("page-title").style.display = "none";
    document.getElementById("content").style.display = "flex";
    document.getElementById("content").style.justifyContent = "flex-start";
    // chrome.runtime.sendMessage({ type: "get_summary" }, (response) => {
    //     console.log("Response from background.js: ", response);
    //     text = response;
    //     console.log("text: ", text);

    //     console.log("Response from background.js: ", response);

    //     // Hide the loader and display the summary
    //     document.getElementsByClassName("loader")[0].style.display = "none";
    //     document.getElementById("privacy-policy-text").innerHTML = response || "<p>No privacy policy found</p>";
    //     document.getElementById("privacy-policy-text").style.display = "block";
    // });

    getSummary();
    

}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const title = document.getElementById("page-title");
    title.innerText = tabs[0].url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0];

});

async function getSummary() {
    const url = "http://127.0.0.1:5001/get-privacy";

    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (!response.ok) {
            throw new Error("Network response error " + response.status);
        }
        return response.json();
    }).then((data) => {
        console.log("Data: ", data);

        //hide the loader element 
        document.getElementById("page-title").style.display = "none";
        document.getElementsByClassName("loader")[0].style.display = "none";
        document.getElementById("analysis-header").innerText += (document.getElementById("page-title").innerText);
        document.getElementById("analysis-header").style.display = "block";
        document.getElementById("good-points").innerHTML = "<h3>Good Points</h3>";
        document.getElementById("bad-points").innerHTML = "<h3>Bad Points</h3>";
        

        data.good_points.forEach((point) => {
            console.log("Point: ", point);
            const li = document.createElement("li");
            li.innerText = point;
            li.style.listStyleType = "square";
            document.getElementById("good-points").appendChild(li);
        })
        data.bad_points.forEach((point) => {
            console.log("Point: ", point);
            const li = document.createElement("li");
            li.style.listStyleType = "square";
            li.innerHTML =  point ;
            document.getElementById("bad-points").appendChild(li);
        })

        document.getElementById("overall_text").innerText = data.overall_text;
        
        document.getElementById("response").style.display = "flex";
        // document.getElementById("response").style = {"display": "flex", "flex-direction": "column"};
    })
    .catch((error) => {
        console.log("Error: ", error);
    });
}
// chrome.runtime.sendMessage({ type: "get_summary" }, (response) => {
//     console.log("Response from background.js: ", response);
//     text = response;
//     console.log("text: ", text);
//     // document.getElementById("response").innerHTML = "<p> Summary of the Privacy policy </p>";
//     // document.getElementById("privacy-text-placeholder").style.display = "none";
//     // document.getElementById("privacy-policy-text").innerHTML = text || "<p>No privacy policy found</p>";
// });

//document.getElementById("privacy-policy-text").innerHTML = text || "<p>No privacy policy found</p>";

