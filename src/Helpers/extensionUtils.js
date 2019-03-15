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

export function removeCurrentTab(callback) {
  if (chrome.tabs) {
    getCurrentTab(tab => {
      chrome.tabs.remove(tab.id, () => {})
    })
  } else {
    window.close()
  }
}