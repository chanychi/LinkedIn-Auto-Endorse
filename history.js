async function createHistory() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      return [...JSON.parse(localStorage.getItem('ListOfEndorsed') || "[]")];
    }
  })
  return result[0].result;
}
/*
createHistory query the tab's localStorage and returns a promise. The promise is passed to the popup to store it in the chrome's storage - allowing it to persist when the user is not on LinkedIn
*/
createHistory()
  .then((data) => {
    const span = document.querySelector('span')
    const extensionStorage = JSON.parse(localStorage.getItem('ListOfEndorsed') || "[]");
    let lastFive;

    if (data?.length) localStorage.setItem('ListOfEndorsed', JSON.stringify(data));

    if (extensionStorage.length > 5) {
      lastFive = extensionStorage.slice(-5);
    } else if (extensionStorage.length !== 0) {
      lastFive = extensionStorage;
    }

    for (let i = 0; i < lastFive?.length; i++) {
      if (lastFive[i + 1]) {
        const textNode = document.createTextNode(lastFive[i] + ' || ');
        span.append(textNode);
        continue;
      }
      const textNode = document.createTextNode(lastFive[i]);
      span.append(textNode);
    }
  })
  .catch((error) => console.log(error));