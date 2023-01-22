import axios from 'axios'

export default class Twitter {
    constructor(twitterAuthToken) {
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
