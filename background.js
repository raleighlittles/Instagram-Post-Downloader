// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
  });

// Called once content script has retrieved the image URL and metadata.
// Saves the final image.
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {

        console.log("Downloading image...");

        // Requires Chrome version 31 or later.
        chrome.downloads.download({url: request.imgUrl, filename: "instagram-downloader-placeholder-img.jpg"});

        console.log("Image downloaded!");
    }
)