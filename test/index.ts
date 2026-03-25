import assert from 'node:assert'
import dotenv from 'dotenv'
import path from 'path'
import {createStore, createConnection} from '../src/index.js'

dotenv.config({path: path.join(import.meta.dirname, '.env')})

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
const connection = createConnection(uri)

setImmediate(async () => {
    try {
        const schemas = path.join(import.meta.dirname, 'schemas')
        const {getModel} = createStore({connection, schemas})
        const Post = getModel('Post')

        const post = await Post.create({
            title: 'Hello world',
            rank: 1
        })

        assert.strictEqual(post.title, 'Hello world', 'title should be "Hello world"')
        assert.strictEqual(post.rank, 1, 'rank should be 1')

        console.log('All assertions passed')
    } catch (error) {
        console.log('ERROR', (error as Error).message)
    }
})
