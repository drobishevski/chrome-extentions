# Chrome Extensions

A small collection of Chrome extensions for website development and testing.

## Installation

1. Clone the repository or download it as an archive:

   ```bash
   git clone https://github.com/drobishevski/chrome-extentions.git
   ```

2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the folder of the extension you want to install:

   - `hc-switch` — toggles high contrast mode;
   - `chrome-image-replacer` — replaces images on a page with local files.

6. If needed, pin the extension to the browser toolbar from the **Extensions** menu (the puzzle-piece icon).

To install both extensions, repeat steps 4–5 for each folder.

## Extensions

### High Contrast Switch

Toggles emulation of the system high contrast mode (`forced-colors`) independently for each tab. It is useful for quickly testing website accessibility and appearance without changing system settings.

Click the extension icon to enable the mode, then click it again to disable it. Chrome displays a debugging notification while the mode is active—this is expected because the extension uses the Chrome DevTools Protocol.

### Local Image Replacer

Temporarily replaces any `<img>` element on a page with an image file from your computer. The file is processed locally and is never uploaded.

Click the extension icon, move the pointer over the target image, click it, and select a local file. The replacement lasts until the page is reloaded. The extension cannot run on Chrome internal pages or the Chrome Web Store.
