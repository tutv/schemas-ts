import 'dotenv/config'
import path from 'path'
import {fileURLToPath} from 'url'
import {createStore, createConnection} from '../src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const uri = process.env.MONGODB_URI || 'mongodb://192.168.1.24:27017/test'
const connection = createConnection(uri)

setImmediate(async () => {
    try {
        const schemas = path.join(__dirname, 'schemas')
        const {getModel} = createStore({connection, schemas})
        const Post = getModel('Post')

        const post =  await Post.create({
            title: 'Hello world',
            rank: 1
        })

        console.log('DOC', post.toJSON())
    } catch (error) {
        console.log('ERROR', (error as Error).message)
    }
})
