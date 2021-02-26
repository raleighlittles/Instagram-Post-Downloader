// content.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action" ) {

          // The GraphQL data location is different depending on whether the user is logged in or not. (Why?)
          const isUserLoggedIn = (document.querySelector("html").classList[1] !== "not-logged-in");
          var graphQlMediaObj;

          // The two regular expressions that follow are shamelessly taken from: https://github.com/instaloader/instaloader
          if (isUserLoggedIn) {
              postInfoObj = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\.__additionalDataLoaded\(.*?({.*"graphql":.*})\);<\/script>/)[1]);
              graphQlMediaObj = postInfoObj.graphql.shortcode_media;
          }
           else {
              postInfoObj = JSON.parse(document.documentElement.outerHTML.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));
              graphQlMediaObj = postInfoObj.entry_data.PostPage[0].graphql.shortcode_media;
          }

           // Easy case -- post consists of a single image or video.
          if (graphQlMediaObj.edge_sidecar_to_children == null)
          {
              // Video posts have a 'display_url' element too, which is just a thumbnail.
              downloadMediaFromPost((graphQlMediaObj.is_video === false) ? graphQlMediaObj.display_url : graphQlMediaObj.video_url,
                  constructDownloadedFilename(graphQlMediaObj.owner.username,
                                              graphQlMediaObj.taken_at_timestamp,
                                    (graphQlMediaObj.is_video === true) ? "vid" : "img"));
          }

          else // Post has either multiple videos, multiple images, or some combination of both.
              for (var i = 0; i < graphQlMediaObj.edge_sidecar_to_children.edges.length; i++) {

                  const subpostObj = graphQlMediaObj.edge_sidecar_to_children.edges[i].node;

                  downloadMediaFromPost((subpostObj.is_video === false) ? subpostObj.display_url : subpostObj.video_url,
                      constructDownloadedFilename(graphQlMediaObj.owner.username,
                                                  graphQlMediaObj.taken_at_timestamp,
                                        (subpostObj.is_video === true) ? "vid" : "img"));
          }
      }

      function downloadMediaFromPost(mediaUrl, filenameToSaveAs) {
          chrome.runtime.sendMessage({mediaUrl: mediaUrl, filename: filenameToSaveAs});
      }

      function constructDownloadedFilename(author, dateUploadedUnixTs, mediaFmt) {
          const today = new Date();
          const timestamp = 'DA_'.concat(today.getFullYear(),
                                  '-', today.getMonth(),
                                  '-', today.getDate(),
                                  'T', today.getHours(),
                                  '', today.getMinutes(),
                                  '', today.getSeconds());

          // Unix epochs/timestamps are in units of seconds, whereas javascript date objects use milliseconds.
          const uploadDateObj = new Date(dateUploadedUnixTs * 1000);

          const uploadDate = 'DC_'.concat(uploadDateObj.getFullYear(),
              '-', uploadDateObj.getMonth(),
              '-', uploadDateObj.getDate(),
              'T', uploadDateObj.getHours(),
              '', uploadDateObj.getMinutes(),
              '', uploadDateObj.getSeconds());

          return author.concat("__", timestamp, "__", uploadDate, (mediaFmt === "vid") ? "_v.mp4" : "_i.jpg");
      }
    }
  );
