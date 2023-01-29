import express from 'express'
import expressWs from 'express-ws'
const app = expressWs(express()).app
import Reddit from './utils/reddit.js'
import Twitter from './utils/twitter.js'
import Emotions from './utils/modelQuery.js'
import fs from 'fs'
import NewClient from './utils/news.js'
import Model from './utils/model.js'

let domain_emotions = {
    'Science and technology': [
        'outdated',
        'complex',
        'unreliable',
        'advanced',
        'efficient',
        'innovative',
    ],
    'Business and finance': [
        'unstable',
        'uncertain',
        'fraudulent',
        'profitable',
        'successful',
        'secure',
    ],
    'Health and medicine': [
        'unhealthy',
        'dangerous',
        'ineffective',
        'beneficial',
        'healing',
        'preventative',
    ],
    'Education and academia': [
        'boring',
        'irrelevant',
        'outdated',
        'engaging',
        'informative',
        'empowering',
    ],
    'Politics and government': [
        'corrupt',
        'inefficient',
        'divisive',
        'just',
        'fair',
        'representative',
    ],
    'Religion and spirituality': [
        'dogmatic',
        'divisive',
        'intolerant',
        'enlightening',
        'unifying',
        'meaningful',
    ],
    'Arts and entertainment': [
        'shallow',
        'uninspired',
        'formulaic',
        'creative',
        'entertaining',
        'inspiring',
    ],
    'Social issues and advocacy': [
        'divisive',
        'polarizing',
        'ineffective',
        'unifying',
        'empowering',
        'impactful',
    ],
    'Environment and conservation': [
        'destructive',
        'polluted',
        'unsustainable',
        ' preserving',
        'clean',
        'renewable',
    ],
    Product: [
        'faulty',
        'dangerous',
        'overpriced',
        'high-quality',
        'reliable',
        'affordable',
    ],
    Domains: [
        'Science and technology',
        'Business and finance',
        'Health and medicine',
        'Education and academia',
        'Politics and government',
        'Religion and spirituality',
        'Arts and entertainment',
        'Social issues and advocacy',
        'Environment and conservation',
        'Product',
    ],
}
// Credentials for APIs from config.json
const creds = JSON.parse(fs.readFileSync('config.json').toString())

// Initialize clients for each API
const redditClient = new Reddit(creds.redditCreds)
const twitterClient = new Twitter(creds.twitterCreds)
const newsClient = new NewClient(creds.newsapiAuth)

const modelClientReddit = new Emotions(creds.openAiCreds)
const modelClientTwitter = new Emotions(creds.openAiCreds)

const model = new Model('Bearer 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')

const model1 = new Model('Bearer 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')

const PORT = 5000
const LENGTH = 10
const NEWS_LENGTH = 10

async function Threading(app, labels) {
    let tempDomain = []
    for (let index = 0; index < app.length; index++) {
        const element = await model.query({
            inputs: app[index],
            parameters: {
                candidate_labels: labels,
            },
        })
        if (element.labels) tempDomain.push(element.labels[0])
    }
    return tempDomain
}

async function ThreadingEmotions(app, domain) {
    let tempEmotions = []
    for (let index = 0; index < app.length; index++) {
        const element = await model1.query({
            inputs: app[index],
            parameters: {
                candidate_labels: domain_emotions[domain[index]],
            },
        })
        if (element.labels) tempEmotions.push(element.labels[0])
    }
    return tempEmotions
}

// WebSocket route for real-time communication between client and server
app.ws('/:query', (ws, req) => {
    // Extract query from params
    const query = req.params.query
    let redditDomains, twitterDomains, redditEmotions, twitterEmotions

    ws.on('message', async (msg) => {
        // Perform tasks in parallel using Promise.all()
        // Get posts and tweets with the given query and specified length
        // console.log(query)
        let params = {}
        let params_domains = {}
        const [redditPosts, twitterPosts] = await Promise.all([
            redditClient.getPosts(query, LENGTH),
            twitterClient.getTweets(query, LENGTH),
        ])

        try {
            redditDomains = await Threading(
                redditPosts,
                domain_emotions['Domains']
            )
            twitterDomains = await Threading(
                twitterPosts,
                domain_emotions['Domains']
            )
            redditEmotions = await ThreadingEmotions(redditPosts, redditDomains)
            twitterEmotions = await ThreadingEmotions(
                twitterPosts,
                twitterDomains
            )

            redditEmotions.forEach((e)=>{
                if (params[e]) params[e] +=1
                else params[e] = 1
            })
            twitterEmotions.forEach((e)=>{
                if (params[e]) params[e] +=1
                else params[e] = 1
            })
            redditDomains.forEach((e)=>{
                if (params_domains[e]) params_domains[e] +=1
                else params_domains[e] = 1
            })
            twitterDomains.forEach((e)=>{
                if (params_domains[e]) params_domains[e] +=1
                else params_domains[e] = 1
            })
        } catch (error) {
            console.log(error)
            console.log('retrying')[(redditDomains, twitterDomains)] =
                await Promise.all([
                    Threading(redditPosts),
                    Threading(twitterPosts),
                ])
        }
        ws.send(
            JSON.stringify({
                domains : params_domains,
                emotions : params
            })
        )
    })
})

//endpoint for news
app.ws('/news/:query', (ws, req) => {
    const query = req.params.query

    let articles
    ws.on('message', async function (mes) {
        while (articles == undefined) {
            try {
                articles = await Promise.resolve(
                    newsClient.fetch(query, NEWS_LENGTH)
                )
            } catch (e) {
                console.log(e)
            }
        }
        ws.send(JSON.stringify({ articles: articles }))
    })
})

app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})
