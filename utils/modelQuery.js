const axios = require('axios');

module.exports = class Emotions{

    constructor(huggingfaceAuthToken){
        
        this.getEmotionsQuery = async(data) =>{
            return await axios.post(
              "https://api-inference.huggingface.co/models/joeddav/distilbert-base-uncased-go-emotions-student",
              {"inputs": data},
              {headers: {'Authorization': huggingfaceAuthToken}},
              ).then(response => response.data); 
        }
    }
} 
