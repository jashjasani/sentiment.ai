import { Configuration, OpenAIApi } from 'openai'

export default class Emotions {
    constructor(openAiToken) {
        this.AuthToken = openAiToken
        // this.emotionFreq = {
        //     admiration: 0,
        //     amusement: 0,
        //     anger: 0,
        //     annoyance: 0,
        //     approval: 0,
        //     caring: 0,
        //     confusion: 0,
        //     curiosity: 0,
        //     desire: 0,
        //     disappointment: 0,
        //     disapproval: 0,
        //     disgust: 0,
        //     embarrassment: 0,
        //     excitement: 0,
        //     fear: 0,
        //     gratitude: 0,
        //     grief: 0,
        //     joy: 0,
        //     love: 0,
        //     nervousness: 0,
        //     optimism: 0,
        //     pride: 0,
        //     realization: 0,
        //     relief: 0,
        //     remorse: 0,
        //     sadness: 0,
        //     surprise: 0,
        //     neutral: 0,
        // }
        this.emotionFreq = {
            disappointment: 0,
            excitement: 0,
            admiration: 0,
            joy: 0,
            love: 0,
            sadness: 0,
            anger: 0,
            disgust: 0,
            regret: 0,
            gratitude: 0,
            relief: 0,
            pride: 0,
            arrogance: 0,
            realization: 0,
            curiosity: 0,
        }
        this.configuration = new Configuration({
            apiKey: this.AuthToken,
        })
        this.openai = new OpenAIApi(this.configuration)
    }
    formatText(prompt) {
        var textt = ''
        prompt.forEach((element, index) => {
            textt =
                textt +
                `${index + 1}). ${element} 
            `
        })
        return textt
    }

    async runCompletion(prompt) {
        const formattedText = this.formatText(prompt)
        const completion = await this.openai.createCompletion({
            model: 'text-davinci-003',
            //     prompt: `Analyse the top 3 emotions only from  [admiration,amusement,anger,annoyance,approval,caring,confusion,curiosity,desire,disappointment,disapproval,disgust,embarrassment,
            // excitement,
            // fear,
            // gratitude,
            // grief,
            // joy,
            // love,
            // nervousness,
            // optimism,
            // pride,
            // realization,
            // relief,
            // remorse,
            // sadness,
            // surprise,
            // neutral] for the following:

            prompt: `Analyse the top 2 emotion only from  [disappointment,
            excitement,
            admiration,
            joy,
            love,
            sadness,
            anger,
            disgust,
            regret,
            gratitude,
            relief,
            pride,
            arrogance,
            realization,
            curiosity,] for the following:
        ${formattedText}
  `,
            temperature: 1,
            max_tokens: 1000,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
        })
        const dataText = await completion.data.choices[0].text
        var total = 0
        var report = {}
        // const emotionsArray = [
        //     "admiration",
        //     "amusement",
        //     "anger",
        //     "annoyance",
        //     "approval",
        //     "caring",
        //     "confusion",
        //     "curiosity",
        //     "desire",
        //     "disappointment",
        //     "disapproval",
        //     "disgust",
        //     "embarrassment",
        //     "excitement",
        //     "fear",
        //     "gratitude",
        //     "grief",
        //     "joy",
        //     "love",
        //     "nervousness",
        //     "optimism",
        //     "pride",
        //     "realization",
        //     "relief",
        //     "remorse",
        //     "sadness",
        //     "surprise",
        //     "neutral",
        // ]
        const emotionsArray = [
            'disappointment',
            'excitement',
            'admiration',
            'joy',
            'love',
            'sadness',
            'anger',
            'disgust',
            'regret',
            'gratitude',
            'relief',
            'pride',
            'arrogance',
            'realization',
            'curiosity',
        ]

        dataText.split('\n').forEach((line) => {
            line.replace(/[^a-zA-Z]/g, ',')
                .split(',')
                .reverse()
                .forEach((word) => {
                    word = word.toLowerCase()
                    if (emotionsArray.includes(word)) {
                        if (report.hasOwnProperty(word)) {
                            report[word] += 1
                        } else {
                            report[word] = 1
                        }
                        total += 1
                    } else {
                        return
                    }
                })
        })

        console.log(report)
        console.log(dataText)
        // dataText.split(' ').forEach((element) => {
        //     const newElement = element.replace(/[^a-zA-Z]/g, '').toLowerCase();
        //     if (newElement !== '') {
        //         console.log(newElement);
        //         if (this.emotionFreq.hasOwnProperty(newElement)) {
        //             report[newElement] += 1
        //             total += 1
        //             console.log(report);
        //         }

        //     }})

        Object.keys(report).forEach((element) => {
            report[element] = ((report[element] / total) * 100).toFixed(2)
        })

        console.log(total)
        return report
    }
}
