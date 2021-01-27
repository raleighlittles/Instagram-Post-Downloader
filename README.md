# Background

A few weeks ago, it was announced that [hundreds of Instagram Chrome extensions were infected with malware](https://press.avast.com/third-party-browser-extensions-from-instagram-facebook-vimeo-and-others-infected-with-malware). The specific downloader I used was on that list, and so, left with no other option, I decided to write my own.

# About

This is a Chrome extension for downloading Instagram posts.

# Installation

1. Go to the main Chrome Extensions page: chrome://extensions/

![screenshot-1](https://raw.githubusercontent.com/raleighlittles/Instagram-Post-Downloader/main/docs/extension-installation-instructions.png?token=AAQJY4OIM6UHD3OZJNLIDQTADJHMM)

2. Click "Load unpacked"

3. Point to the directory where you cloned this repo.

# Usage/Features

Navigate to a specific Instagram post's page, e.g: `https://www.instagram.com/p/CKW1c2PLbq2/` then click the download icon in your toolbar.

![screenshot-2](https://raw.githubusercontent.com/raleighlittles/Instagram-Post-Downloader/main/docs/browser-action-usage.png?token=AAQJY4PCHYJTZUBPLDXBUZTADJH5Q)

Supports all kinds of Instagram posts, both single and multiple, and includes video. Also does not require login!

Downloaded images/video contain the following in the filename:

1. The uploader's username
2. The date the post was uploaded
3. The date the post was downloaded

# Feature Wishlist

- [ ] Add support for downloading stories
- [ ] Add support for downloading story highlights
- [ ] Include post metadata (caption, author, date uploaded) as part of the EXIF data in the highlighted image
