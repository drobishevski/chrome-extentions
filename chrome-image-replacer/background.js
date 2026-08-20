chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type !== "IMAGE_REPLACER_MODE_CHANGED" || !sender.tab?.id) {
    return;
  }

  chrome.action.setBadgeText({
    tabId: sender.tab.id,
    text: message.active ? "ON" : ""
  });

  if (message.active) {
    chrome.action.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: "#2563eb"
    });
  }
});

async function ensureContentScript(tabId) {
  try {
    return await chrome.tabs.sendMessage(tabId, {
      type: "IMAGE_REPLACER_GET_STATUS"
    });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });

    return chrome.tabs.sendMessage(tabId, {
      type: "IMAGE_REPLACER_GET_STATUS"
    });
  }
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  try {
    const status = await ensureContentScript(tab.id);
    await chrome.tabs.sendMessage(tab.id, {
      type: "IMAGE_REPLACER_SET_ACTIVE",
      active: !status?.active
    });
  } catch {
    await chrome.action.setBadgeText({ tabId: tab.id, text: "" });
    await chrome.action.setTitle({
      tabId: tab.id,
      title: "Local Image Replacer is unavailable on this page"
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    chrome.action.setBadgeText({ tabId, text: "" });
    chrome.action.setTitle({ tabId, title: "Local Image Replacer" });
  }
});
