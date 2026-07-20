# High Contrast Switch

An extension that toggles **forced colors** mode (high contrast) on a per-tab basis — handy for testing website accessibility without changing your system settings.

## How it works

- Clicking the extension icon enables emulation of the `forced-colors: active` media feature for the active tab via the Chrome DevTools Protocol (`Emulation.setEmulatedMedia`, using the `debugger` permission).
- Clicking again disables the emulation and detaches the debugger.
- The icon reflects the current state (on/off) for each tab individually.
- State is kept in `chrome.storage.session` and is reset when the tab is closed or when Chrome detaches the debugger itself (for example, when DevTools is opened).

## Installation (Developer mode)

1. Clone or download this repository:
   ```bash
   git clone https://github.com/<your-account>/chrome-extentions.git
   ```
2. Open Chrome and go to the extensions page: type `chrome://extensions` in the address bar and press Enter.
3. Enable the **Developer mode** toggle in the top-right corner of the page.
4. Click the **Load unpacked** button that appears.
5. In the folder picker, select the `hc-switch` folder inside the repository and click **Select**.
6. The extension appears in the list and its icon shows up on the toolbar. If you don't see the icon, click the puzzle piece 🧩 and pin **High Contrast Switch**.
7. Open any tab and click the extension icon — forced colors mode turns on. Click again to turn it off.

> When the mode is enabled, Chrome shows a banner saying "High Contrast Switch" started debugging this browser — this is expected, since the extension uses the DevTools Protocol. Don't dismiss it, or the emulation will be turned off.
