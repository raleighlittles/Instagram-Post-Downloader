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

          //  Initially, I tried to download the image file, then modify it in-place to edit the EXIF data.
          // Unfortunately, it turns out that there isn't a clean way to be able to edit files via the browser
          // (which makes sense in hindsight...)

          // Instead, we'll edit the raw JPG data (as a byte array) *before* saving the file.

          let rawJpgData = fetch(imageUrl).then(r => r.blob()).arrayBuffer();

          // TODO: Modify EXIF data here.

          // Chrome prohibits use of the Downloads API inside of content scripts.
          // TODO: Fix the parameters on this! Some are no longer needed with the different approach.
          // chrome.runtime.sendMessage({imgUrl: imageUrl, imgUploadDate: uploadDate, imgAuthor: author, imgCaption: caption});
      }

      
    }
  );