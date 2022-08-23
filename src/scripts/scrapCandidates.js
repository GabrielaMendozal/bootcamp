import {searchSelectors} from "../config/scrapperSelectors";
import { waitForScroll, waitForSelector } from "../utils/waitFor";
import {$,$$}   from "../utils/selectors";

async function init(){
    await waitForSelector(searchSelectors.paginateResultsContainer)

    await waitForScroll(100,100)

    const URLsCandidates = $$(searchSelectors.paginateResultsContainer)
        .map(element => $('.app-aware-link', element).href)
    
    console.log('SOYURLSDE10PERSONAS',URLsCandidates)

    //pasar url como mensajes con runtime
    const port = chrome.runtime.connect({name: "secureChannelScrap"});
    port.postMessage({URLsCandidates});

} 
init()

//esta es la inyeccion yd esde aqui puedo esperar por el selector se vuele async

// este se crea para jalar todos los candidatos

//tres