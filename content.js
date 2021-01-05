// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {

          const IgImgUrl = document.querySelector("meta[property='og:image']").getAttribute('content');

          const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);

          const author = jsonLd.author.alternateName;
          const caption = jsonLd.caption;
          const uploadDate = jsonLd.uploadDate;

          console.log("Image URL: " + IgImgUrl);
          console.log("Uploaded date: " + uploadDate);
          console.log("Author: " + author);
          console.log("Caption: " + caption);

          //  Initially, I tried to download the image file, then modify it in-place to edit the EXIF data.
          // Unfortunately, it turns out that there isn't a clean way to be able to edit files via the browser
          // (which makes sense in hindsight...)

          // Instead, we'll edit the raw JPG data (as a byte array) *before* saving the file.

          // You can only use `await` in an async function, but Chrome doesn't let you use asynchronous listeners.
          // See: https://stackoverflow.com/a/63949798/1576548

           async function getImgArrayBuffer(url) {
            return await fetch(url).then(r => r.blob()).then(b => b.arrayBuffer());
          }

          getImgArrayBuffer(IgImgUrl).then(function(result) {
             let rawJpgData = new Uint8Array(result);

            // TODO: Modify EXIF data here.
            let modifiedJpgData = rawJpgData; //PLACEHOLDER

            let imgBlob = new Blob([modifiedJpgData], {type: "image/jpeg"});
            let localImgUrl = URL.createObjectURL(imgBlob);

            // TODO: Use the uploader's username and the current date as the filename.
            chrome.runtime.sendMessage({imgName: "instagram-downloaded-image.jpg", imgUrl: localImgUrl});
          });   
      }
    }
  );