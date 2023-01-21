import RedditContent from "./utils/reddit.js";
import fs from 'fs'

//Credentials for reddit api from config.json
let redditCreds = JSON.parse(fs.readFileSync('config.json').toString()).redditCreds
//Initialising reddit content
let reddit = new RedditContent(redditCreds)

let text = await reddit.getPosts({query : "elon musk"})

