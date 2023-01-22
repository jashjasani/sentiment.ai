const axios = require('axios');

module.exports =  class Twitter {
  constructor(twitterAuthToken){

    this.getTweets = async(word)=>{

      const headers = {
          'Authorization': twitterAuthToken
      }
      return await axios.get(`https://api.twitter.com/2/tweets/search/recent?query=${word}&max_results=10`, {headers})
        .then(async response => response.data.data.map(e => e.text)) 
        .catch(error => {
          throw error;
        });
    }
  }
}


