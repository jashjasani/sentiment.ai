import express from 'express'
import expressWs from 'express-ws'
const app = expressWs(express()).app
import RedditContent from './utils/reddit.js'
import Twitter from './utils/twitter.js'
import Emotions from './utils/modelQuery.js'
import fs from 'fs'

// Credentials for APIs from config.json
const creds = JSON.parse(fs.readFileSync('config.json').toString())

// Initialize clients for each API
const redditClient = new RedditContent(creds.redditCreds)
const twitterClient = new Twitter(creds.twitterCreds)
const modelClient = new Emotions(creds.huggingfaceCreds)

const PORT = 5000
const LENGTH = 100

// WebSocket route for real-time communication between client and server
app.ws('/:query', (ws, req) => {
    // Extract query from params
    const query = req.params.query
    
    ws.on('message', async (msg) => {
        // Perform tasks in parallel using Promise.all()
        // Get posts and tweets with the given query and specified length
        console.log(query)
        const [redditPosts, twitterPosts] = await Promise.all([
            redditClient.getPosts(query, LENGTH),
            twitterClient.getTweets(query, LENGTH),
        ])

        // Analyze emotions in the posts and tweets
        const [redditEmotions, twitterEmotions] = await Promise.all([
            modelClient.getEmotionsQuery(redditPosts),
            modelClient.getEmotionsQuery(twitterPosts),
        ])

        console.log(
            JSON.stringify({ reddit: redditEmotions, twitter: twitterEmotions })
        )
        // Send the emotions analysis results back to the client
        ws.send(
            JSON.stringify({ reddit: redditEmotions, twitter: twitterEmotions })
        )
    })
})

app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})
