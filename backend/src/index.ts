import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const port = 3333;
app.use('/api', routes)

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`)
})