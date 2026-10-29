const status = document.querySelector("#status");

document.querySelector(".delay-list").addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-delay]");

  if (!button) {
    return;
  }

  const delay = Number(button.dataset.delay);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("Active tab not found");
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: "MAIN",
      args: [delay],
      func: (timeout) => {
        setTimeout(() => {
          debugger;
        }, timeout);
      }
    });

    status.textContent = delay === 0
      ? "Starting debugger"
      : `Debugger starts in ${delay / 1000} sec`;
    setTimeout(() => window.close(), 350);
  } catch (error) {
    status.textContent = "Cannot run on this page";
    console.error("Delayed Debugger:", error);
  }
});
