async function createHistory() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

  const result = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      return [...JSON.parse(localStorage.getItem('ListOfEndorsed') || "[]")];
    }
  })
  return result[0].result;
}

createHistory().then((data) => {
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