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

      function saveEndorsement(name) {
        let storedNames = JSON.parse(localStorage.getItem('ListOfEndorsed') || "[]");
        let listOfEndorsed = [...new Set([...storedNames, name])];
        localStorage.setItem('ListOfEndorsed', JSON.stringify(listOfEndorsed));
      }

      function endorseSkills() {
        document.querySelectorAll('.pvs-navigation__text').forEach((i) => {
          if (i.innerHTML.indexOf('skills') > -1) {
            i.parentElement.click()

            setTimeout(function () {
              window.scrollTo(0, document.body.scrollHeight - 500);
              const skills = document.querySelectorAll('.pv2 > .artdeco-button--muted');

              for (let i = 0; i < skills.length; ++i) {
                endorseSkill(skills[i]);
              }
            }, 2000)
          }
        });
      }

      function endorseSkill(skillBtn) {
        const endorsed = !!skillBtn.querySelector('.artdeco-button__icon')
        if (!endorsed) {
          skillBtn.click();
        }
      }
      
      if (!getConnectionName?.innerHTML) return;
      if (url.hostname !== "www.linkedin.com" && !containsProfile) return;

      if (containsProfile) {
        saveEndorsement(getConnectionName.innerHTML);
      }

      endorseSkills();
    }
  })
})

