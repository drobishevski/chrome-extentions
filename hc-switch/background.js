const DEBUGGER_VERSION = "1.3";

function getActionIconPath(prefix) {
  return {
    16: `assets/png/${prefix}-16.png`,
    32: `assets/png/${prefix}-32.png`,
    48: `assets/png/${prefix}-48.png`,
    128: `assets/png/${prefix}-128.png`
  };
}

async function setActionIcon(tabId, isEnabled) {
  await chrome.action.setIcon({
    tabId,
    path: getActionIconPath(isEnabled ? "on" : "off")
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  const tabId = tab.id;
  const debuggee = { tabId };

  try {
    const storageKey = `forcedColors_${tabId}`;
    const stored = await chrome.storage.session.get(storageKey);
    const isEnabled = stored[storageKey] === true;

    if (isEnabled) {
      await disableForcedColors(debuggee, tabId, storageKey);
    } else {
      await enableForcedColors(debuggee, tabId, storageKey);
    }
  } catch (error) {
    console.error("Forced Colors Toggle:", error);

    await setActionIcon(tabId, false);

    await chrome.action.setTitle({
      tabId,
      title: `Error: ${error.message}`
    });
  }
});

async function enableForcedColors(debuggee, tabId, storageKey) {
  await chrome.debugger.attach(debuggee, DEBUGGER_VERSION);

  await chrome.debugger.sendCommand(
    debuggee,
    "Emulation.setEmulatedMedia",
    {
      media: "",
      features: [
        {
          name: "forced-colors",
          value: "active"
        }
      ]
    }
  );

  await chrome.storage.session.set({
    [storageKey]: true
  });

  await setActionIcon(tabId, true);

  await chrome.action.setTitle({
    tabId,
    title: "Forced Colors enabled - click to disable"
  });
}

async function disableForcedColors(debuggee, tabId, storageKey) {
  try {
    await chrome.debugger.sendCommand(
      debuggee,
      "Emulation.setEmulatedMedia",
      {
        media: "",
        features: []
      }
    );
  } finally {
    try {
      await chrome.debugger.detach(debuggee);
    } catch {
      // The extension may have already detached from the tab.
    }
  }

  await chrome.storage.session.remove(storageKey);

  await setActionIcon(tabId, false);

  await chrome.action.setTitle({
    tabId,
    title: "Enable Forced Colors"
  });
}

/*
 * If the tab is closed, remove its saved state.
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {
  await chrome.storage.session.remove(`forcedColors_${tabId}`);
});

/*
 * If Chrome detaches the debugger itself, reset the displayed state.
 * For example, this can happen when DevTools is opened.
 */
chrome.debugger.onDetach.addListener(async (source) => {
  if (!source.tabId) {
    return;
  }

  const tabId = source.tabId;

  await chrome.storage.session.remove(`forcedColors_${tabId}`);

  try {
    await setActionIcon(tabId, false);

    await chrome.action.setTitle({
      tabId,
      title: "Enable Forced Colors"
    });
  } catch {
    // The tab may have already been closed.
  }
});