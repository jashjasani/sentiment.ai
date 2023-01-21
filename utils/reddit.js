import Snoowrap from 'snoowrap'
import fs from 'fs'

export default class RedditContent {
    constructor({ clientId, clientSecret, userAgent, password, username }) {
        this.r = new Snoowrap({
            clientId: clientId,
            clientSecret: clientSecret,
            userAgent: userAgent,
            password: password,
            username: username,
        })
        this.getPosts = async (
            query,
            type = 'link',
            limit = 1000,
            sort = 'new'
        ) => {
            let posts = await this.r.getSubreddit('all').search({
                query: 'elon musk',
                type: 'link',
                limit: 1000,
                sort: 'new',
            })
            let more = await posts.fetchMore({ amount: 100 })
            posts = posts.concat(more)
            posts = posts.map((e) => {
                let text = ''
                if (e.title != null) {
                    text += e.title
                }
                if (e.selftext != null) {
                    text += e.selftext
                }
                return text
            })
            return posts
        }
    }
}
