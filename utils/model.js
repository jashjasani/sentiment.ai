export default class Model {
    constructor(authToken) {
        this.authToken = authToken
        this.query = async function query(data) {
            const response = await fetch(
                'https://api-inference.huggingface.co/models/joeddav/xlm-roberta-large-xnli',
                {
                    headers: { Authorization: this.authToken },
                    method: 'POST',
                    body: JSON.stringify(data),
                }
            )
            const result = await response.json()
            return result
        }
    }
}


