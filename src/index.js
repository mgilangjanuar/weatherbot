import express from 'express'
import chatbot from './chatbot'


const app = express()

app.post('/', chatbot.middleware, chatbot.webhook)

app.listen(process.env.PORT | 3000, () => console.log(`webhook listen at: ${process.env.PORT | 3000}`))