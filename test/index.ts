import assert from 'node:assert'
import dotenv from 'dotenv'
import path from 'path'
import {createStore, createConnection} from '../src/index.js'

dotenv.config({path: path.join(import.meta.dirname, '.env')})

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'
const connection = createConnection(uri)

let passed = 0
let failed = 0

const test = async (name: string, fn: () => void | Promise<void>) => {
    try {
        await fn()
        passed++
        console.log(`  PASS: ${name}`)
    } catch (error) {
        failed++
        console.log(`  FAIL: ${name} - ${(error as Error).message}`)
    }
}

setImmediate(async () => {
    const schemas = path.join(import.meta.dirname, 'schemas')

    // --- createConnection ---
    console.log('\n[createConnection]')

    await test('should throw when URI is empty', () => {
        assert.throws(() => createConnection(''), {message: 'URI is required.'})
    })

    await test('should throw when URI is whitespace', () => {
        assert.throws(() => createConnection('   '), {message: 'URI is required.'})
    })

    // --- createStore + getModel ---
    console.log('\n[createStore + getModel]')

    const {getModel, getConnection} = createStore({connection, schemas})

    await test('should throw when model name is empty', () => {
        assert.throws(() => getModel(''), {message: 'Model name is required.'})
    })

    await test('should create document with correct fields', async () => {
        const Post = getModel('Post')
        const post = await Post.create({title: 'Hello world', rank: 1})

        assert.strictEqual(post.title, 'Hello world', 'title should be "Hello world"')
        assert.strictEqual(post.rank, 1, 'rank should be 1')
    })

    await test('should return cached model on second call', () => {
        const Post1 = getModel('Post')
        const Post2 = getModel('Post')

        assert.strictEqual(Post1, Post2, 'should return same model instance')
    })

    await test('should return typed model with generic', async () => {
        interface IPost {
            title: string
            rank: number
            created_at: Date
        }

        const Post = getModel<IPost>('Post')
        const post = await Post.create({title: 'Typed post', rank: 2})

        const title: string = post.title
        const rank: number = post.rank

        assert.strictEqual(title, 'Typed post', 'title should be string "Typed post"')
        assert.strictEqual(rank, 2, 'rank should be number 2')
    })

    await test('should use custom collection name', () => {
        const PostCustom = getModel('Post', 'custom_posts')
        assert.ok(PostCustom, 'model with custom collection should be created')

        const PostCustomAgain = getModel('Post', 'custom_posts')
        assert.strictEqual(PostCustom, PostCustomAgain, 'should cache by collection name')
    })

    // --- getConnection ---
    console.log('\n[getConnection]')

    await test('should return the connection instance', () => {
        const conn = getConnection()
        assert.strictEqual(conn, connection, 'should return same connection')
    })

    // --- cleanup & summary ---
    await connection.dropDatabase()
    await connection.close()

    console.log(`\nResult: ${passed} passed, ${failed} failed`)
    process.exit(failed > 0 ? 1 : 0)
})
