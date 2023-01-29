import Snoowrap from 'snoowrap'

export default class RedditContent {
    constructor({ clientId, clientSecret, userAgent, password, username }) {
        this.r = new Snoowrap({
            clientId: clientId,
            clientSecret: clientSecret,
            userAgent: userAgent,
            password: password,
            username: username,
        })
        this.getPosts = async (query, limit, type, sort) => {
            let posts = await this.r.getSubreddit('all').search({
                query: query,
                type: type ?? 'link',
                limit: limit ?? 10,
                sort: sort ?? 'new',
            })
            // let more = await posts.fetchMore({ amount: 0 })
            // posts = posts.concat(more)
            posts = posts.map((e) => {
                let text = ''
                if (e.title != null) {
                    text += e.title
                }
                if (e.selftext != null) {
                    text += e.selftext
                }
                return text.substring(0, 100)
            })
            return posts
        }
    }
}
