import axios from 'axios'

export default class Twitter {
    constructor(twitterAuthToken) {
        this.twitterAuthToken = twitterAuthToken
        this.getTweets = async (word, length) => {
            const headers = {
                Authorization: this.twitterAuthToken,
            }
            return await axios
                .get(
                    `https://api.twitter.com/2/tweets/search/recent?query=${word}&max_results=${length}`,
                    { headers }
                )
                .then(async (response) => response.data.data.map((e) => e.text.substring(0, 100)))
                .catch((error) => {
                    throw error
                })
        }
    }
}
