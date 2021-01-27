// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {

          // The GraphQL data location is different depending on whether the user is logged in or not. (Why?)
          const isUserLoggedIn = (document.querySelector("html").classList[1] !== "not-logged-in");

          // The two regular expressions that follow are shamelessly taken from: https://github.com/instaloader/instaloader
          if (isUserLoggedIn) {
              postInfoObj = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\.__additionalDataLoaded\(.*?({.*"graphql":.*})\);<\/script>/)[1]);
          }
           else {
              postInfoObj = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));
          }

          const metadata = getPostMetadata(); // For use later...
          const graphQlMediaObj = postInfoObj.entry_data.PostPage[0].graphql.shortcode_media;

           // Easy case -- post consists of a single image or video.
          if (graphQlMediaObj.edge_sidecar_to_children == null)
          {
              // Video posts have a 'display_url' element too, which is just a thumbnail.
              downloadMediaFromPost((graphQlMediaObj.is_video === false) ? graphQlMediaObj.display_url : graphQlMediaObj.video_url,
                  constructDownloadedFilename(metadata.author.substring(1),
                                              metadata.upload_date,
                                    (graphQlMediaObj.is_video === true) ? "vid" : "img"));
          }

          else // Post has either multiple videos, multiple images, or some combination of both.
              for (var i = 0; i < graphQlMediaObj.edge_sidecar_to_children.edges.length; i++) {

                  const subpostObj = graphQlMediaObj.edge_sidecar_to_children.edges[i].node;

                  downloadMediaFromPost((subpostObj.is_video === false) ? subpostObj.display_url : subpostObj.video_url,
                      constructDownloadedFilename(metadata.author.substring(1),
                                                  metadata.upload_date,
                                        (subpostObj.is_video === true) ? "vid" : "img"));
          }
      }

      function downloadMediaFromPost(mediaUrl, filenameToSaveAs) {
          chrome.runtime.sendMessage({mediaUrl: mediaUrl, filename: filenameToSaveAs});
      }

      function getPostMetadata() {
          const jsonLd = JSON.parse(document.querySelector('script[type="application/ld+json"]').innerText);
          return {author : jsonLd.author.alternateName, caption: jsonLd.caption, upload_date: jsonLd.uploadDate};
      }

      function constructDownloadedFilename(author, dateUploaded, mediaFmt) {
          const today = new Date();
          const timestamp = 'DA_'.concat(today.getFullYear(),
                                  '-', today.getMonth(),
                                  '-', today.getDate(),
                                  'T', today.getHours(),
                                  '', today.getMinutes(),
                                  '', today.getSeconds());

          // There is a bug in the Chrome API that doesn't let you save filenames with a colon in them.
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1383262
          const uploadDate = 'DC_'.concat(dateUploaded.replaceAll(":", ""));
          return author.concat("__", timestamp, "__", uploadDate, (mediaFmt === "vid") ? "_v.mp4" : "_i.jpg");
      }
    }
  );
