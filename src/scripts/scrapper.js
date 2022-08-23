// esto es lo quiero inyectar a la web que visito

import axios from 'axios';
import { profileSelectors } from '../config/scrapperSelectors';
import { $, $$ } from '../utils/selectors';
import getCookie from '../utils/cookie';
import dayjs from 'dayjs'
import {waitForSelector, waitForScroll } from '../utils/waitFor';


async function getContactInfo(){
    try{
        const token = getCookie('JSESSIONID', document.cookie)
        const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? [] // le agregue o  
        const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles/${contactInfoName.slice(3,-2)}/profileContactInfo`   //borra el in    
        
        //console.log(token,"TOKEN")
        const {data: {data}} = await axios.get(contactInfoURL, {  // borré esto .replace('in/','')
            headers: {
            accept      : 'application/vnd.linkedin.normalized+json+2.1', 
            'csrf-token': token
            }
        })
        
        return data
    } catch(error){
        
        console.log("ERROR getContactInfo", error)
        throw new Error('error info de contacto')
    }
}

function getEspecificInfo(selector){
    try{
        const elements = $$(selector) // esta en blanco quiero seleccion el hermano
        return elements.map((listItem) => {
            if(!$('.pvs-entity__path-node', listItem)){
                const [title,enterprise,dateStringInfo] = $$('span[aria-hidden]', listItem).map(element => element.textContent)
                //console.log($$('span[aria-hidden]', listItem).map(element => element.textContent))
                //console.log(dateStringInfo.match(/.+·|\d{4} - \d{4}/),"QUE SOY")
                const [parsedRawDate] = dateStringInfo.match(/.+·|\d{4} - \d{4}/) ?? []
                const [startDate, endDate] = (parsedRawDate?.replace(/\s|·/g,'').split('-') ?? [])
                    .map(rawDateElement => dayjs(rawDateElement).isValid() ? dayjs(rawDateElement).toDate(): null)

                return({
                    title,
                    enterprise,
                    dateStringInfo,
                    startDate,
                    endDate
                })   }
        })
    }catch(error){
        console.log("ERROR getEspecificInfo", error)
    }
    }


async  function scrap(){

    try{
        console.log('INICIAL')
        await waitForSelector('h1')
        await waitForScroll()
        
        const name = $(profileSelectors.name).textContent
        const experienceTitles = getEspecificInfo(profileSelectors.experiencesElements)
        const educationTitles = getEspecificInfo(profileSelectors.educationElements)
        const contactInfo = await getContactInfo()
        const profile = {
            name,
            contactInfo,
            experienceTitles,
            educationTitles
        }
        const port = chrome.runtime.connect({name: "secureChannelScrapProfile"})

        port.postMessage({profile});        
        console.log('SOYPROFILEDEUNAPERSONA',profile)
    } catch(error){
        console.log("ERROR scrap",error)
    }
    
}
scrap()