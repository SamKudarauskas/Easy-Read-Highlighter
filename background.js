function setDataPromise(storageLocation, parameterName, statusValue) {
  return new Promise((resolve, reject) => {
    if(storageLocation === "session"){
      resolve(chrome.storage.session.set({[parameterName]: statusValue}));
    } else if (storageLocation === "sync") {
      resolve(chrome.storage.sync.set({[parameterName]: statusValue}));
    } else if (storageLocation === "local") {
      resolve(chrome.storage.local.set({[parameterName]: statusValue}));
    } else {
      reject("invalid storage Location: " + storageLocation );
    }
  });
}
let activeTab = window.location.href;

setDataPromise("session", "activeTab" , activeTab);

const allP = document.getElementsByTagName('p');

const allLi = document.getElementsByTagName('li');

const allText = [...allP, ...allLi];

let allTextOriginalHTML = [];

function storeOriginalHTML() {
  let b, n;
  for (b = 0, n = allText.length; b < n; b++) {
    allTextOriginalHTML.push(allText[b].innerHTML);
  }
}
storeOriginalHTML();
function restoreDefaultHTML() {
  let b, n;
  for (b = 0, n = allText.length; b < n; b++) {
    allText[b].innerHTML = allTextOriginalHTML[b];
  }
}
function boldifyFirstSyllableFunction() {

  let i, l;
  for (i = 0, l = allText.length; i < l; i++) {

    let currentText = allText[i].innerText;

    let splitCurrentText = currentText.split(' ');

    let reconstructedText = '<span class="EasyReadTextStyler">';

    for (let g = 0, j = splitCurrentText.length; g < j; g++) {
    
      let currentWord = splitCurrentText[g];

      let reconstructedWord = "";

      let reconstruct = true;
      let reconstructWordBold = function(startValue) {
        for (let h = startValue, k = currentWord.length; h < k; h++) {
          reconstructedWord = reconstructedWord + currentWord[h];
        }
        return reconstructedWord;
      }

      let dealWithOtherSymbols = function(currentCharacter, currentCharacterComplement,checkForQuoteMarks) {

        if (currentWord[0] === currentCharacter) {

          reconstruct = false;

          let reconstructedWord = currentCharacter;

          if (currentWord[1] === currentCharacterComplement) {

            reconstructedWord = '<strong>' + currentCharacter + currentCharacterComplement + '</strong>';
            reconstructedText = reconstructedText + " " + reconstructedWord;

          } else if (checkForQuoteMarks === 1 && currentWord[1] === '"') {

            reconstructedWord = reconstructedWord + '"';

            if (currentWord.length === 3) {

              reconstructedWord = reconstructedWord + "<strong>" + currentWord[2] + "</strong>";

              reconstructedText = reconstructedText + " " + reconstructedWord;

            } else if (currentWord.length > 3) {

              reconstructedWord = reconstructedWord + "<strong>" + currentWord[2] + currentWord[3] + "</strong>";

              reconstructedText = reconstructedText + " " + reconstructedWord;

            } else {

              reconstructedText = reconstructedText + " " + reconstructedWord;

            }
          } else if (currentWord[2] === currentCharacterComplement) {

            reconstructedWord = reconstructedWord + "<strong>" + currentWord[1] + "</strong>" + currentCharacterComplement;
            reconstructedText = reconstructedText + " " + reconstructedWord;

          } else {

            reconstructedWord = reconstructedWord + "<strong>" + currentWord[1] + currentWord[2] + "</strong>";

            for (let h = 3, k = currentWord.length; h < k; h++) {
              reconstructedWord = reconstructedWord + currentWord[h];
            }

            reconstructedText = reconstructedText + " " + reconstructedWord;

          }
        }
      }

      dealWithOtherSymbols('"','"',0);
      dealWithOtherSymbols("'","'",0);
      dealWithOtherSymbols("(",")",1);
      dealWithOtherSymbols("[","]",1);
      dealWithOtherSymbols("{","}",1);

      if (reconstruct === true) {

        if (currentWord.length < 2 || currentWord[currentWord.length] === '"' || currentWord[currentWord.length] === ')' || currentWord[currentWord.length] === "'" || currentWord[currentWord.length] === ']' || currentWord[currentWord.length] === '}') {
            reconstructedWord = "<strong>" + currentWord[0] + "</strong>";

          reconstructWordBold(1);
    
        } else {

          reconstructedWord = "<strong>" + currentWord[0] + currentWord[1] + "</strong>";
 
          reconstructWordBold(2);
        }
      }

      if (reconstructedWord !== "<strong>undefined</strong>") {
        reconstructedText = reconstructedText + " " + reconstructedWord;
      }
    }
    reconstructedText = reconstructedText + "</span>";
    allText[i].innerHTML = reconstructedText;
  }
}
//======================================================================================================================
//functions imported from utils.js
//======================================================================================================================

async function setDataPromise(storageLocation, parameterName, statusValue, parameterSubName) {

    let dataBeingSet = {};

    if(parameterSubName !== undefined) {

        let result = await getDataPromise(storageLocation, parameterName);

        if(result !== undefined){
                dataBeingSet = result;
        }

        dataBeingSet[parameterSubName] = statusValue;

    } else {
        dataBeingSet = "";
        dataBeingSet = statusValue;
    }

    return new Promise((resolve, reject) => {
        if(storageLocation === "session"){
            resolve(chrome.storage.session.set({[parameterName]: dataBeingSet}));
        } else if (storageLocation === "sync") {
            resolve(chrome.storage.sync.set({[parameterName]: dataBeingSet}));
        } else if (storageLocation === "local") {
            resolve(chrome.storage.local.set({[parameterName]: dataBeingSet}));
        } else {
            reject("invalid storage Location: " + storageLocation );
        }
    });
}


async function getDataPromise(storageLocation, parameterName, parameterSubName) {
    function getDataFunctionPromise(storageLocation, parameterName) {
        let results = "";

        return new Promise((resolve, reject) => {
            if(storageLocation === "session"){
                results = chrome.storage.session.get([parameterName]);
            } else if (storageLocation === "sync") {
                results = chrome.storage.sync.get([parameterName]);
            } else if (storageLocation === "local") {
                results = chrome.storage.local.get([parameterName]);
            } else {
                reject("invalid storage Location: " + storageLocation );
            }

            resolve(results);
        });
    }

    return new Promise((resolve, reject) => {
        getDataFunctionPromise(storageLocation, parameterName).then((result) => {

            if (result[parameterName] !== undefined) {
                let currentData = result[parameterName];

                let dataBeingReturned = "";

                if(parameterSubName !== undefined) {

                    dataBeingReturned = currentData[parameterSubName];

                } else {

                    dataBeingReturned = currentData;
                }
                resolve(dataBeingReturned);
            } else {

                reject("result of " + parameterName + " stored in " + storageLocation + " is undefined");

            }
        })
    })
}
async function get_domain_from_url(url) {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    return a.hostname;
}

//======================================================================================================================
//function declarations for editing settings based off of user preferences
//======================================================================================================================

async function setWebsiteDefaultSettings() {
  let websiteDefaultSettingsObject = {
    "minimumFontSize": 15,
    "forceDarkModeStatus": "Disabled",
    "boldifyFirstSyllable": "Disabled"
  }
  setDataPromise("session", "temporarySettings", websiteDefaultSettingsObject);
}


async function storeActiveTab() {
  let activeTab = "";
  let activeTabDomain = "";

  activeTab = await getDataPromise("session", "activeTab")

  activeTabDomain = await get_domain_from_url(activeTab);
  setDataPromise("session", "activeTabDomain", activeTabDomain);
}

async function applyUserPreferences() {
  let activeTabDomain = await getDataPromise("session", "activeTabDomain");

  console.log("active tab is: " + activeTabDomain);

  getDataPromise("sync", activeTabDomain)
      .catch(() => {
          console.log("no data is stored ");
          setWebsiteDefaultSettings();
      })
      .then((result) => {
       setDataPromise("session", "temporarySettings" , result);
       getDataPromise("session", "temporarySettings").then((result) => {
           console.log("Settings that should be applied are: " + JSON.stringify(result));
       })

      })
}

//======================================================================================================================
//edit settings based off of user preferences
//======================================================================================================================

async function updateVisuals() {
    let webpageNewStyle={};
    let webpageMinFontSize = await  getDataPromise("session", "temporarySettings", "minimumFontSize");

    webpageNewStyle = {
        "font-size": webpageMinFontSize + "px"
    };
    await getDataPromise("session", "temporarySettings", "webpageFont")
        .then((result) => {
            if(result !== "undefined") {
                //console.log("webpage font is " + result);
                webpageNewStyle["font-family"] = result;
            } else {
                webpageNewStyle["font-family"] = "";
            }
        })
            .catch(() => {});
    applyNewStyles("p", webpageNewStyle);
}

async function runCodeAsync() {

    await storeActiveTab();

    await applyUserPreferences();

    await setDataPromise("session", "updateData", Math.random());
}

document.addEventListener("visibilitychange", () => {
    if(document.hidden) {
        setDataPromise("session", "refreshPage?", "Enabled");
    } else {
        getDataPromise("session", "refreshPage?").then((result) => {
            if(result === "Enabled") {
                let activeTab = window.location.href;
                setDataPromise("session", "activeTab" , activeTab).then(() => {
                })
                runCodeAsync();
                setDataPromise("session", "refreshPage?", "Disabled");
            }
        })
    }
})

runCodeAsync();
//======================================================================================================================
// functions that fire when new data is stored in "session"
//======================================================================================================================

function applyNewStyles(elementType, newStyles) {

  const elementsToBeStyled = document.getElementsByTagName(elementType);

  for (let f = 0; f < elementsToBeStyled.length; f++) {

    Object.assign(elementsToBeStyled[f].style, newStyles);

  }
}


chrome.storage.session.onChanged.addListener(() => {

  updateVisuals();

  //Force Dark Mode?

  const bodyElement = document.getElementsByTagName("body");

  getDataPromise("session", "temporarySettings", "forceDarkModeStatus").then((result) => {
    //console.log("Status of Force Dark Mode is: " + result);
    if(result === "Enabled") {
      bodyElement[0].classList.add("SK_ForceDarkMode");
    } else {
      bodyElement[0].classList.remove("SK_ForceDarkMode");
    }
  });

  //BoldifyFirstSyllable?

  getDataPromise("session", "temporarySettings", "boldifyFirstSyllable").then((result) => {
    //console.log("Status of Boldify First Syllable is: " + result);
    if(result === "Enabled") {
      boldifyFirstSyllableFunction();
    } else {
      restoreDefaultHTML();
    }
  });
});