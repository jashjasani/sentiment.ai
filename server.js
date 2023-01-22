import express from 'express'
const app = express()
import axios from 'axios'
import RedditContent from './utils/reddit.js'
import Twitter from './utils/twitter.js'
import Emotions from './utils/modelQuery.js'
import fs from 'fs'

//Credentials for reddit api from config.json
let creds = JSON.parse(fs.readFileSync('config.json').toString())

//Initialising reddit content
const reddit = new RedditContent(creds.redditCreds)
const twitter = new Twitter(creds.twitterCreds)
const huggingFace = new Emotions(creds.huggingfaceCreds)

const PORT = 5000

app.get('/', (req, res) => {
    res.statusCode(404).send(
        "You ae wroung Place, or you havn't passed the query string!!!"
    )
})

const length = 10

app.get('/:query', async (req, res) => {
    const getQuery = req.params.query
    // const redditPostsEmotions = await reddit.getPosts(getQuery, length)

    const redditPostsEmotions = await huggingFace.getEmotionsQuery(
        await reddit.getPosts(getQuery, length)
    )
    // const twitterTweetsEmotions = await twitter.getTweets(getQuery, length)

    const twitterTweetsEmotions = await huggingFace.getEmotionsQuery(
        await twitter.getTweets(getQuery, length)
    )
    res.send({ reddit: redditPostsEmotions, twitter: twitterTweetsEmotions })
})

app.listen(PORT, () => {
    console.log('Server Listening to port ' + PORT)
})
