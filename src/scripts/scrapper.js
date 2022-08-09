// esto es lo quiero inyectar a la web que visito

import axios from 'axios';
import { profileSelectors } from '../config/scrapperSelectors';
import { $, $$ } from '../utils/selectors';

function getToken(tokenkey){
    
    return document.cookie
    .split(';')
    .find(cookie => cookie.includes(tokenkey))
    .replace(tokenkey+'=','')
    .replaceAll('"',' ')
    .trim()
    

    //return document.cookie.match(/ajax.+";/)[0].replaceAll(/"|;/,'')
}

async function getContactInfo(){
    try{
        const token = getToken('JSESSIONID')
        const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? [] // le agregue o  
        const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles/${contactInfoName.slice(3,-2)}/profileContactInfo`   //borra el in    
        
        console.log(token,"TOKEN")
        const {data: {data}} = await axios.get(contactInfoURL, {  // borré esto .replace('in/','')
            headers: {
            accept      : 'application/vnd.linkedin.normalized+json+2.1', 
            'csrf-token': token
            }
        })
        
        return data
    } catch(error){
        console.log("ERROR", error)
    }
}

function getEspecificInfo(selector){
    const elements = $$(selector) // esta en blanco quiero seleccion el hermano
    const titles= []

    elements.forEach((listItem) => {
        const titleElement = $('span[aria-hidden]', listItem)
        titles.push(titleElement.textContent)
    })
    return titles
}//35036


async  function scrap(){

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

    console.log(profile)
}
scrap()