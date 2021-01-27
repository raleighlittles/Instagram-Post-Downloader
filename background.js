// background.js

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
    });
  });


// Message handler that fires once the content script has retrieved the image.
// (Chrome prohibits use of the Downloads API inside of *content* scripts.)
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Requires Chrome version 31 or later.
        chrome.downloads.download({url: request.mediaUrl, filename: request.filename});
    }
)
