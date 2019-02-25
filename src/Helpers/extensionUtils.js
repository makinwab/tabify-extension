/* global chrome */
export function getCurrentTab (callback) {
  if (chrome.tabs) {
    chrome.tabs.getSelected(null, function (tab) {
      callback(tab)
    })
  } else {
    callback(window.location)
  }
}
