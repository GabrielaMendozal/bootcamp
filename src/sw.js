import { db } from "./config/conexionDexie"

async function inyectScript(path, tabId){
    const options = {
        target: { tabId},
        files: [path]
    }
    
    return chrome.scripting.executeScript(options)
}

async function inyectScriptCandidates(tabId){
    return inyectScript("scripts/scrapCandidates.js", tabId)
}

chrome.action.onClicked.addListener((tab) =>{
    console.log('click')
    inyectScriptCandidates(tab.id)
    /*const options = {
        target: { tabId: tab.id},
        files: ["scripts/scrapCandidates.js"]
    }
    chrome.scripting.executeScript(options)*/
})
// en adelante es servicew envio mensaje
chrome.runtime.onConnect.addListener((port)=> {
    const secureChannels = ['secureChannelScrap', 'secureChannelScrapProfile']
    if(!(secureChannels.includes(port.name)))
        throw new Error('Not secure Channel')

    switch (port.name) {
        case secureChannels[0]:
            console.log('sc1')
            port.onMessage.addListener(async (msg, {sender:{tab: {id:tabId, url: tabUrl}}}) => {
                    
            const originalUrlParams = new URLSearchParams(tabUrl.match(/\?.+/)[0].replace('?', ''))
            const page = originalUrlParams.has('page') ? Number(originalUrlParams.get('page'))+1 : 2
            //await chrome.tabs.update(tabId, {url: tabUrl+'&page='+page})
               
        
                db.urlsCandidate.add({
                urls: msg.URLsCandidates
                });

                const{id} = await chrome.tabs.create({url: msg.URLsCandidates[0]})
                
                inyectScript('scripts/scrapper.js',id)
            
            //createUrlsDB()
            //inyectScriptCandidates(tabId)
            
           
            });
          
            
            break;
        case secureChannels[1]:
            console.log('sc2')
            port.onMessage.addListener(async ({profile}, {sender: {tab: {id: tabId}}})=> {
                
                //console.log("objeto",typeof(urlsRaw))
                    db.profiles.add(profile)
                const [urlsRaw] = await db.urlsCandidate.toArray();

                for(let i=0; i<urlsRaw.urls.length; i++){
                    const {id} = await chrome.tabs.update(tabId, {url:urlsRaw.urls[i]})
                    inyectScript('scripts/scrapper.js',tabId)                    
                }             
            })
            break;
    
        default:
            break;
    }
    
  });