# Local Image Replacer

Local Image Replacer is a Manifest V3 Chrome extension that temporarily replaces
any selected `<img>` element on a page with a local image file. The file is read
on your computer and is never uploaded.

## Installation

1. Open `chrome://extensions` in Chrome.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `chrome-image-replacer` folder.

## Usage

1. Open a regular web page.
2. Click the extension icon to enable selection mode immediately.
3. Move the pointer over an image. A blue outline marks the target.
4. Click the image and choose a local image file.
5. The image is replaced and selection mode turns off automatically.

An **ON** badge on the extension icon indicates that selection mode is active.
Click the extension icon again to turn it off without replacing an image.

## Notes

- A replacement lasts only in the current tab and disappears after a page reload.
- Chrome does not allow extensions to run on internal pages (`chrome://...`) or
  the Chrome Web Store.
- Image data is converted locally to a `data:` URL. No server request is made.
- The `activeTab` permission grants access only after you explicitly open the
  extension on a tab. The extension does not request permanent access to all sites.
