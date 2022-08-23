import {$} from "../utils/selectors";

$('#search-form').addEventListener('submit', async (e) =>{
    e.preventDefault()
    const keyword = $('#to-search', e.target).value
    const url = 'https://www.linkedin.com/search/results/people/?keywords='+ keyword
    const {id} = await chrome.tabs.create({url}) //uso id para poder inyectar en esta pestaña scrapping devuelve objetos pestaña
    //$('#to-search')

    //contexto popat puedo enviar id desde el sw o enviar
    const options = {
        target: { tabId: tab.id},
        files: ["scripts/scrapCandidates.js"]
    } 
    chrome.scripting.executeScript(options)
})

//tres