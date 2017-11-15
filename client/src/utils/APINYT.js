import axios from "axios";
const BASEURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=";
const APIKEY = "&api-key=b9f91d369ff59547cd47b931d8cbc56b:0:74623931";

export default {
  search: function (searchterm, numberofrecords, startyear, endyear) {
    let query = searchterm;
    if (parseInt(startyear)) {
      query += "&begin_date=" + startyear + "0101";
    };
    if (parseInt(endyear)) {
      query += "&end_date=" + endyear + "1231";
    } 
    return axios.get(BASEURL + query + APIKEY);
  }
};
