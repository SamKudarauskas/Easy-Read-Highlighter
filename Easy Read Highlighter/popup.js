//======================================================================================================================
// main function declarations
//======================================================================================================================

import { setDataPromise} from "./utils.js"

import { getDataPromise } from "./utils.js"

let webpageNewFontSize = "0";

// currentStylingOptions are ["minimumFontSize", "forceDarkModeStatus", "boldifyFirstSyllable", "webpageFont"]

const minFontSize = document.getElementById("min-font-size");
const forceDarkModeElement = document.getElementById("force-dark-mode");
const boldifyFirstSyllableElement = document.getElementById("boldify-first-syllable");
const webpageFontElement = document.getElementById("change-font-type");
const storeWebsitePreferences = document.getElementById("store-website-preferences");

chrome.storage.session.setAccessLevel({ accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS' });

function setBoldifyFirstSyllablePromise(statusValue) {
  return new Promise((resolve) => {
    resolve(chrome.storage.session.set({ boldifyFirstSyllable: statusValue}));
  });
}



async function setWebsitePreferences() {

  let userPreferencesObject = {};
  userPreferencesObject["minimumFontSize"] = await getDataPromise("session", "temporarySettings", "minimumFontSize").catch(() => {
    return 20;
  })
  userPreferencesObject["forceDarkModeStatus"] = await getDataPromise("session", "temporarySettings", "forceDarkModeStatus").catch(() => {
    return "Enabled";
  })
  userPreferencesObject["boldifyFirstSyllable"] = await getDataPromise("session", "temporarySettings", "boldifyFirstSyllable").catch(() => {
    return "Disabled";
  })
  userPreferencesObject["webpageFont"] = await getDataPromise("session", "temporarySettings", "webpageFont").catch(()=>{});
  //console.log(JSON.stringify(userPreferencesObject));


  let activeTabDomain = await getDataPromise("session", "activeTabDomain");

  await setDataPromise("sync", activeTabDomain, userPreferencesObject);
}

//======================================================================================================================
//on launch code
//======================================================================================================================

getDataPromise("session", "temporarySettings", "forceDarkModeStatus").then((result) => {
  if (result === "Enabled") {
    forceDarkModeElement.setAttribute("checked", "");
    setDataPromise("session", "temporarySettings", "forceDarkModeStatus", "Enabled");
  } else {
    setDataPromise("session", "temporarySettings", "forceDarkModeStatus", "Disabled");
  }
})

getDataPromise("session", "temporarySettings", "boldifyFirstSyllable").then((result) => {
  if (result === "Enabled") {
    boldifyFirstSyllableElement.setAttribute("checked", "");
    setDataPromise("session", "temporarySettings", "boldifyFirstSyllable", "Enabled");
  } else {
    setDataPromise("session", "temporarySettings", "forceDarkModeStatus", "Disabled");
  }
})

getDataPromise("session", "temporarySettings", "minimumFontSize")
  .then((result) => {
    minFontSize.value = result;
  })
  .catch(() => {})

getDataPromise("session", "temporarySettings", "webpageFont")
    .then((result) => {
      for(let i = 0; i < webpageFontElement.children.length; i++) {
        if(result === webpageFontElement.children[i].value) {
          webpageFontElement.children[i].setAttribute("selected", "selected");
          break;
        }
      }
    })
    .catch(()=>{});

//======================================================================================================================
//main code
//======================================================================================================================

minFontSize.addEventListener("input",function() {

  if (minFontSize.value > 30) {
    minFontSize.value = 30;
  }

  if (minFontSize.value < 8) {
    minFontSize.value = 8;
  }

  setDataPromise("session", "temporarySettings", minFontSize.value, "minimumFontSize");

});

forceDarkModeElement.addEventListener("click",function() {
  getDataPromise("session", "temporarySettings", "forceDarkModeStatus").then((result) => {
    if (result === "Enabled") {
      setDataPromise("session", "temporarySettings", "Disabled", "forceDarkModeStatus");
    } else if (result === "Disabled") {
      setDataPromise("session", "temporarySettings", "Enabled", "forceDarkModeStatus");
    } else {
      throw new Error("Invalid Status of Force Dark Mode. Reading: " + result);
    }
  })
});

boldifyFirstSyllableElement.addEventListener("click", function() {
  getDataPromise("session", "temporarySettings", "boldifyFirstSyllable").then((result) => {
    if (result === "Enabled") {
      setDataPromise("session", "temporarySettings", "Disabled", "boldifyFirstSyllable");

    } else {
      setDataPromise("session", "temporarySettings", "Enabled", "boldifyFirstSyllable");

    }
  })
})

storeWebsitePreferences.addEventListener("click", function() {
  setWebsitePreferences();
})

webpageFontElement.addEventListener("change", function()  {
  console.log("setting " + webpageFontElement.value);
  setDataPromise("session", "temporarySettings", webpageFontElement.value, "webpageFont")
})