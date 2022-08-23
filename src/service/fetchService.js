class FetchService{
    urlApi = "http://localhost:3000/urlsProfiles";

    async createUrlProfiles(urlsCandidates){
        return fetch(this.urlApi,{
            method : "POST",
            body : JSON.stringify({urlsCandidates}),
            headers: {
                'Content-type' : 'application/json; charset-UTF-8'
            }
        });
    }
}

export default FetchService();