// Snag our button
let btn = document.getElementById("endorse-btn")
// Run on click
btn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true }) // Find current tab

  chrome.scripting.executeScript({ // Run the following script on our tab
    target: { tabId: tab.id },
    function: () => {
      const currURLWindow = window.location.href;
      const url = new URL('', currURLWindow);
      const containsProfile = url.pathname.includes("/in/");
      const getConnectionName = document.querySelector("h1");
      let listOfEndorsed = [];

      if (!getConnectionName?.innerHTML) return;
      if (url.hostname !== "www.linkedin.com" && !containsProfile) return;

      if (containsProfile) {
        let storedNames = JSON.parse(localStorage.getItem('ListOfEndorsed') || "[]");
        listOfEndorsed = [...new Set([...storedNames, getConnectionName?.innerHTML])];
        localStorage.setItem('ListOfEndorsed', JSON.stringify(listOfEndorsed));
      }

      document.querySelectorAll('.pvs-navigation__text').forEach((i) => {
        if (i.innerHTML.indexOf('skills') > -1) {
          i.parentElement.click()

          setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight - 500);
            const skills = document.querySelectorAll('.pv2 > .artdeco-button--muted');

            for (let i = 0; i < skills.length; ++i) {
              const btn = skills[i];
              const endorsed = !!btn.querySelector('.artdeco-button__icon')
              if (!endorsed) {
                btn.click();
              }
            }
          }, 2000)
        }
      });
    }
  })
})