import { Configuration, OpenAIApi } from 'openai'

var emotionFreq = {
    admiration: 0,
    amusement: 0,
    anger: 0,
    annoyance: 0,
    approval: 0,
    caring: 0,
    confusion: 0,
    curiosity: 0,
    desire: 0,
    disappointment: 0,
    disapproval: 0,
    disgust: 0,
    embarrassment: 0,
    excitement: 0,
    fear: 0,
    gratitude: 0,
    grief: 0,
    joy: 0,
    love: 0,
    nervousness: 0,
    optimism: 0,
    pride: 0,
    realization: 0,
    relief: 0,
    remorse: 0,
    sadness: 0,
    surprise: 0,
    neutral: 0,
}

const emotionsArray  = ["admiration","amusement","anger","annoyance","approval","caring","confusion","curiosity","desire","disappointment","disapproval","disgust","embarrassment","excitement","fear","gratitude","grief","joy","love","nervousness","optimism","pride","realization","relief","remorse","sadness","surprise","neutral"]

const configuration = new Configuration({
    apiKey: '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',
})
const openai = new OpenAIApi(configuration)

function formatText(prompt) {
    var textt = ''
    prompt.forEach((element, index) => {
        textt =
            textt +
            `${index + 1}). ${element} 
        `
    })
    return textt
}

async function runCompletion(prompt) {
    const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Analyse the top 5 emotions only from  [admiration,amusement,anger,annoyance,approval,caring,confusion,curiosity,desire,disappointment,disapproval,disgust,embarrassment,
    excitement,
    fear,
    gratitude,
    grief,
    joy,
    love,
    nervousness,
    optimism,
    pride,
    realization,
    relief,
    remorse,
    sadness,
    surprise,
    neutral] for the following:
    ${prompt}

`,
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
    })
    const dataText = completion.data.choices[0].text
    var newArray = []
    dataText.split(' ').forEach((element) => {
        if (element.replace(/[^a-zA-Z]/g, '').toLowerCase() !== '') {
            newArray.push(element.replace(/[^a-zA-Z]/g, '').toLowerCase())
        }    
    })
    console.log(newArray);
    newArray.forEach((element) => {
            if (emotionFreq.hasOwnProperty(element)) {
                emotionFreq[element] += 1;
            }
    })
    console.log(emotionFreq)
}

runCompletion(
    formatText([
        'RT @thakkar_sameet: Narendra Damodardas Modi; the Man who changed Bharat destiny forever.\n' +
            '\n' +
            'Full Goosebumps 🥰🫡🇮🇳 https://t.co/EH6UKI4Nga',
        'RT @RanaAyyub: I can understand the government calling the BBC documentary on Modi as an alleged attack on him. Why should a news publicati…',
        'RT @UnSubtleDesi: I’m not sure why Modi supporters are so perturbed about the BBC documentary. The last time they tried to hound him based…',
        'RT @khanumarfa: Narendra Modi told the BBC that the one regret he has about 2002 is that he couldn’t ‘handle the media’. \n' +
            'He’s rectifying t…',
        'RT @aju000: @anilkantony Wow! Son of senior INC leader AK Antony and head of media cell in @INCKerala speaking against the Modi documentary…',
        'RT @Sanginamby: BJP has made being critical of Modi or his Govt like a culpable offense. Either through his filthy troll army or the state…',
        'RT @khanumarfa: Narendra Modi told the BBC that the one regret he has about 2002 is that he couldn’t ‘handle the media’. \n' +
            'He’s rectifying t…',
        '@MaryMillben @narendramodi Jai Hind 🙏 Jai Modi 🙏',
        "RT @pendown: At DYFI's screening of Modi documentary by BBC in Kaloor. https://t.co/XYZr5AAHgz",
        'RT @aimim_national: Jiss qanuun ke tahat (Modi ji) aapne BBC documentary ko ban kiya usi tarah Godse ki picture (Movie) par bhi ban lagao.…',
    ])
)
