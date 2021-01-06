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

      // Sources: https://people.cs.umass.edu/~liberato/courses/2017-spring-compsci365/lecture-notes/05-utf-16-bit-twiddling-parsing-exif/
      function appendExifData(rawImgArray) {
        // From: https://en.wikipedia.org/wiki/List_of_file_signatures
        // We know the first 12 bytes are occupied by the JPEG 'header'.
        // The next 2 bytes record the JFIF version.
        // The next byte is the Density unit.
        // The next 2 bytes are the X-density.
        // The next 2 bytes are the Y-density.
        // The next byte is a horizontal pixel count.
        // The next byte is a vertical pixel count.
        // Lastly, comes the thumbnail data. Instagram's images don't seem to use the thumbnail data thankfully,
        // so this is where our metadata will begin, on the 21st byte.

        const exifMarker = "0xff 0xe1";

        // This is the length of the entire EXIF block (JPG calls them 'APP') 
        // that will contain the 'DateTimeOriginal' property and its actual value.
        const dateTimeLength = "0xb8";

        // 'Exif' in ASCII, followed by a null byte, followed by 'MM' in ASCII to denote
        // big Endianness (M for motorola), followed by the constant '42' in whatever endianness is used.
        const exifPrefix = "0x45 0x78 0x69 0x66 0x00 0x4d 0x4d 0x00 0x2a";
        const IFDOffset = "0x00 0x00 0x00 0x08";

        
        const numIFdEntries = "0x00 0x01";
      }
    }
  );