// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {

          // The GraphQL data location is different depending on whether the user is logged in or not. (Why?)
          const isUserLoggedIn = (document.querySelector("html").classList[1] === "not-logged-in");

          // The two regular expressions that follow are shamelessly taken from: https://github.com/instaloader/instaloader
          if (isUserLoggedIn) {
              totalPostInfo = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\.__additionalDataLoaded\(.*?({.*"graphql":.*})\);<\/script>/)[1]);
          }
           else {
              totalPostInfo = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));
          }
          const metadata = getPostMetadata();
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
        const dateTimeLength = "0xb8"; // TODO Fix this

        // 'Exif' in ASCII, followed by a null byte, followed by 'MM' in ASCII to denote
        // big Endianness (M for motorola), followed by the constant '42' in whatever endianness is used.
        const exifPrefix = "0x45 0x78 0x69 0x66 0x00 0x4d 0x4d 0x00 0x2a";
        const IFDOffset = "0x00 0x00 0x00 0x08";
        
        // 3 IFD entries for the 3 metadata fields we're using.
        const numIFdEntries = "0x00 0x01";
      }

      function getPostMetadata() {
          const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);
          return {author : jsonLd.author.alternateName, caption: jsonLd.caption, upload_date: jsonLd.uploadDate};
      }

      function constructDownloadedFilename(author, mediaFmt) {
          const today = new Date();
          const timestamp = ''.concat(today.getFullYear(),
                                  '_', today.getMonth(),
                                  '_', today.getDate(),
                                  '_', today.getHours(),
                                  '_', today.getMinutes(),
                                  '_', today.getSeconds());

          if (mediaFmt === "img") {
              return author.concat('__T', timestamp, "__img.jpg");
          }

          else {
              return author.concat('__T', timestamp, "__vid.mp4");
          }
      }
    }
  );