import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/routes'
import { Chatbot, getUpdates } from './chatbot/chatbot.controller'

const dotenv = require('dotenv');
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const port = process.env.PORT;
app.use('/api', routes)

var chatbot: Chatbot = {
    token_id: process.env.CHATBOT_TOKEN || '',
    offset: 0
}

const fetchUpdateDelayInSeconds = 5;
setInterval(() => {
    getUpdates(chatbot).then((res) => {
        const offset = res.offset;
        chatbot.offset = offset;
    });
}, fetchUpdateDelayInSeconds * 1000);

export const getChatbot = () => chatbot;

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`)
})