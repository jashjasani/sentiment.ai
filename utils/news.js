import NewsApi from 'newsapi'

export default class NewsAPI {
    constructor(authToken) {
        this.authToken = authToken
        this.NewsApi = new NewsApi(this.authToken)
        this.fetch = async function (query,length) {
            const articles = await this.NewsApi.v2
                .everything({
                    q: query,
                    from: Date.now().toString(),
                    sortBy: 'relevancy',
                    language: 'en',
                    pageSize : length
                })
                return articles
                
        }
    }
}



