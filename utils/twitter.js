import axios from 'axios'

export default class Twitter {
    constructor(twitterAuthToken) {
        this.getMemes = async (word) => {
            const queryText = word + ' #meme'
            const headers = {
                Authorization: twitterAuthToken,
            }
            const images = []
            return await axios
                .get(
                    `https://api.twitter.com/2/tweets/search/recent?max_results=100&media.fields=url,media_key&expansions=attachments.media_keys&query=elon %23meme`,
                    { headers }
                )
                .then((response) => {
                    const tweets = response.data.includes["media"];
                    tweets.forEach(element => {
                        if (element['type'] === 'photo') {
                            images.push(element['url'])
                        }
                        
                    });
                    console.log(images);
                    // tweets.forEach((tweet) => {
                    //     if (tweet.entities && tweet.entities.media) {
                    //         tweet.entities.media.forEach(function (image) {
                    //             console.log(image.media_url);
                    //             images.push(image.media_url)
                    //         })
                    //     }
                    //     return images;
                    // })
                    return images
                })
                .catch((error) => {
                    console.log(error)
                })
            
        }

        this.getTweets = async (word, length) => {
            const headers = {
                Authorization: twitterAuthToken,
            }
            return await axios
                .get(
                    `https://api.twitter.com/2/tweets/search/recent?query=${word}&max_results=${length}`,
                    { headers }
                )
                .then(async (response) => response.data.data.map((e) => e.text))
                .catch((error) => {
                    throw error
                })
        }
    }
}
