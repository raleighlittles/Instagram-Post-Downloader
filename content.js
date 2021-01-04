// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {
          const imageUrl = document.querySelector("meta[property='og:image']").getAttribute('content');

          const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);

          const author = jsonLd.author.alternateName;
          const caption = jsonLd.caption;
          const uploadDate = jsonLd.uploadDate;

          console.log("Image URL: " + imageUrl);
          console.log("Uploaded date: " + uploadDate);
          console.log("Author: " + author);
          console.log("Caption: " + caption);

          // Chrome prohibits use of the Downloads API inside of content scripts.
          chrome.runtime.sendMessage({imgUrl: imageUrl, imgUploadDate: uploadDate, imgAuthor: author, imgCaption: caption});
      }
    }
  );