chrome.runtime.onInstalled.addListener(() => {
  // Ensure side panel is registered on install
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});


