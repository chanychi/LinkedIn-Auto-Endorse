const STORAGE = {
  'key': 'ListOfEndorsed'
}

const HISTORY_MAX = {
  'size': 5
}

const getExtLocalStorage = (key) => JSON.parse(localStorage.getItem(key) || '[]');

const setExtLocalStorage = (collection) => {
  if (collection?.length) localStorage.setItem(STORAGE.key, JSON.stringify(collection));
  return getExtLocalStorage(STORAGE.key);
}

const getMaxHistory = (collection) => collection.length > `${HISTORY_MAX.size}` ? collection.slice(-HISTORY_MAX.size) : collection.length ? collection : [];

const renderHistory = (collection) => {
  const span = document.querySelector('span');
  span.innerHTML = '';

  const nodes = collection.map(item => {
    const textNode = document.createTextNode(item);
    const separatorNode = document.createTextNode(' || ');
    return [textNode, separatorNode];
  }).flat().slice(0, -1);

  nodes.forEach(node => span.append(node));
}

const getEndorsedUsers = async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const result = await chrome.scripting.executeScript({
    args: [STORAGE],
    target: { tabId: tab.id },
    function: (storage) => {
      return [...JSON.parse(localStorage.getItem(storage.key) || "[]")];
    }
  })
  return result[0].result;
}
/*
createHistory query the tab's localStorage and returns a promise. The promise is passed to the popup to store it in the chrome's storage - allowing it to persist when the user is not on LinkedIn
*/
getEndorsedUsers()
  .then(setExtLocalStorage)
  .then(getMaxHistory)
  .then(renderHistory)
  .catch((error) => console.log(error));