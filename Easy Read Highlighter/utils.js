export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}

export async function applyNewStyles(elementType,newStyles) {

  const elementsToBeStyled = document.getElementsByTagName(elementType);

  for (let f = 0; f < elementsToBeStyled.length; f++) {

    Object.assign(elementsToBeStyled[f].style, newStyles);

  }
}

export async function setDataPromise(storageLocation, parameterName, statusValue, parameterSubName) {

    let dataBeingSet = {};

    if(parameterSubName !== undefined) {

        let result = await getDataPromise(storageLocation, parameterName);

        if(result !== undefined){
            //console.log("result is: " + JSON.stringify(result));
                dataBeingSet = result;
        }

        dataBeingSet[parameterSubName] = statusValue;
        //console.log("data being set is: " + JSON.stringify(dataBeingSet));
        //console.log("hit!");

        dataBeingSet[parameterSubName] = statusValue;
        //console.log("data being set is: " + JSON.stringify(dataBeingSet));

    } else {
        dataBeingSet = "";
        dataBeingSet = statusValue;

        //console.log("REGULAR dataBeingSet is " + dataBeingSet);
    }

    //let dataBeingSet = statusValue;

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

export async function getDataPromise(storageLocation, parameterName, parameterSubName) {
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

            //console.log("returned data is: " + JSON.stringify(result));

            if (result[parameterName] !== undefined) {
                let currentData = result[parameterName];

                //console.log("in the get function, the current Data is " + JSON.stringify(currentData));

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
export async function get_domain_from_url(url) {
    let a = document.createElement('a');
    a.setAttribute('href', url);
    return a.hostname;
}
