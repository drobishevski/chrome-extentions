(() => {
  if (globalThis.__localImageReplacerInstalled) {
    return;
  }
  globalThis.__localImageReplacerInstalled = true;

  const ACTIVE_CLASS = "local-image-replacer-active";
  const TARGET_CLASS = "local-image-replacer-target";
  const STYLE_ID = "local-image-replacer-style";

  let active = false;
  let hoveredImage = null;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html.${ACTIVE_CLASS}, html.${ACTIVE_CLASS} * {
        cursor: crosshair !important;
      }
      html.${ACTIVE_CLASS} img.${TARGET_CLASS} {
        outline: 4px solid #2563eb !important;
        outline-offset: 2px !important;
        filter: brightness(1.06) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function notifyModeChanged() {
    chrome.runtime.sendMessage({
      type: "IMAGE_REPLACER_MODE_CHANGED",
      active
    }).catch(() => {});
  }

  function setActive(nextActive) {
    active = Boolean(nextActive);
    ensureStyles();
    document.documentElement.classList.toggle(ACTIVE_CLASS, active);

    if (!active && hoveredImage) {
      hoveredImage.classList.remove(TARGET_CLASS);
      hoveredImage = null;
    }

    notifyModeChanged();
    return active;
  }

  function findImage(event) {
    return event.composedPath().find(
      (node) => node instanceof HTMLImageElement
    ) || null;
  }

  function replaceImage(image, file) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      image.removeAttribute("srcset");
      image.removeAttribute("sizes");
      image.src = String(reader.result);
      setActive(false);
    }, { once: true });
    reader.readAsDataURL(file);
  }

  document.addEventListener("pointerover", (event) => {
    if (!active) return;
    const image = findImage(event);
    if (!image || image === hoveredImage) return;

    hoveredImage?.classList.remove(TARGET_CLASS);
    hoveredImage = image;
    image.classList.add(TARGET_CLASS);
  }, true);

  document.addEventListener("pointerout", (event) => {
    if (!active || !hoveredImage) return;
    if (event.relatedTarget && hoveredImage.contains(event.relatedTarget)) return;

    hoveredImage.classList.remove(TARGET_CLASS);
    hoveredImage = null;
  }, true);

  document.addEventListener("click", (event) => {
    if (!active) return;
    const image = findImage(event);
    if (!image) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.hidden = true;
    document.documentElement.appendChild(input);

    input.addEventListener("change", () => {
      const file = input.files?.[0];
      input.remove();
      if (file) replaceImage(image, file);
    }, { once: true });
    input.addEventListener("cancel", () => input.remove(), { once: true });
    input.click();
  }, true);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "IMAGE_REPLACER_GET_STATUS") {
      sendResponse({ active });
    } else if (message.type === "IMAGE_REPLACER_SET_ACTIVE") {
      sendResponse({ active: setActive(message.active) });
    }
  });
})();
