import express from 'express'
import expressWs from 'express-ws'
const app = expressWs(express()).app
import Reddit from './utils/reddit.js'
import Twitter from './utils/twitter.js'
import Emotions from './utils/modelQuery.js'
import fs from 'fs'
import NewClient from './utils/news.js'


// Credentials for APIs from config.json
const creds = JSON.parse(fs.readFileSync('config.json').toString())

// Initialize clients for each API
const redditClient = new Reddit(creds.redditCreds)
const twitterClient = new Twitter(creds.twitterCreds)
const newsClient = new NewClient(creds.newsapiAuth)


const modelClientReddit = new Emotions(creds.openAiCreds)
const modelClientTwitter = new Emotions(creds.openAiCreds)


const PORT = 5000
const LENGTH = 50
const NEWS_LENGTH = 10 
// WebSocket route for real-time communication between client and server
app.ws('/:query', (ws, req) => {
    // Extract query from params
    const query = req.params.query

    ws.on('message', async (msg) => {
        // Perform tasks in parallel using Promise.all()
        // Get posts and tweets with the given query and specified length
        // console.log(query)
        const [redditPosts, twitterPosts] = await Promise.all([
            redditClient.getPosts(query, LENGTH),
            twitterClient.getTweets(query, LENGTH),
        ])
        var redditEmotions
        var twitterEmotions
        // Analyze emotions in the posts and tweets
        try {
            ;[redditEmotions, twitterEmotions] = await Promise.all([
                (redditEmotions = await modelClientReddit.runCompletion(
                    redditPosts
                )),
                (twitterEmotions = await modelClientTwitter.runCompletion(
                    twitterPosts
                )),
            ])
        } catch (error) {
            console.log(error)
            console.log('retrying')
            setTimeout(async () => {
                ;[redditEmotions, twitterEmotions] = await Promise.all([
                    (redditEmotions = await modelClientReddit.runCompletion(
                        redditPosts
                    )),
                    (twitterEmotions = await modelClientTwitter.runCompletion(
                        twitterPosts
                    )),
                ])
            }, 20000)
        }

        // console.log(
        //     JSON.stringify({ reddit: redditEmotions, twitter: twitterEmotions })
        // )
        // // Send the emotions analysis results back to the client
        ws.send(
            JSON.stringify({ reddit: redditEmotions, twitter: twitterEmotions })
        )
    })
})

//endpoint for news
app.ws('/news/:query', (ws, req) => {
    const query = req.params.query
    
    let articles
    ws.on('message', async function (mes) {
        while(articles==undefined){
            try{
                articles = await Promise.resolve(newsClient.fetch(query,NEWS_LENGTH))
            } catch(e){
                console.log(e);
            }            
        }
        ws.send(JSON.stringify({ articles : articles }))
    })
})

app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})
