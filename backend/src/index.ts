import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongodb'
import cors from 'cors'
import routes from './routes/routes'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
const mongoString = process.env.MONGOSTRING as string;
const port = process.env.PORT as string;
const dbname = process.env.DB_NAME as string;
const { MongoClient } = mongoose
let db
mongoose.connect(mongoString,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, client) => {
        if(!err){
            console.log("Mongo conectado")
            //db = client.db('dbname')
        }
        else console.log('Erro ao conectar mongo: ',err.errmsg)
    })
app.use('/', routes)

app.listen(port, () => {
    console.log(`Servidor ouvindo na porta ${port}`)
})