import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/routes'
import { ChatBot } from './chatbot/chatbot.controller'

const dotenv = require('dotenv');
dotenv.config();
const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const port = process.env.PORT;
app.use('/api', routes)

const ChatBotClass = new ChatBot(process.env.CHATBOT_TOKEN);

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`)
})