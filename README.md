# schemas-ts

A lightweight TypeScript library for managing Mongoose connections and schema loading.

## Installation

```bash
npm install schemas-ts
# or
yarn add schemas-ts
```

**Peer dependency:** `mongoose ^9`

**Requires:** Node.js >= 20.11.0

## Usage

### 1. Define schemas

Create a directory with your Mongoose schemas. Each file exports a `Schema` as default:

```
schemas/
  Post.ts
  User.ts
  Comment.ts
```

```ts
// schemas/Post.ts
import { Schema } from 'mongoose'

const PostSchema = new Schema({
    title: { type: String, trim: true },
    rank: { type: Number, index: true },
    created_at: { type: Date, default: Date.now },
})

export default PostSchema
```

### 2. Create connection and store

```ts
import path from 'path'
import { createConnection, createStore } from 'schemas-ts'

const connection = createConnection('mongodb://localhost:27017/mydb')

const { getModel, getConnection } = createStore({
    connection,
    schemas: path.join(import.meta.dirname, 'schemas'),
})
```

### 3. Use models

```ts
const Post = getModel('Post')

// Create
await Post.create({ title: 'Hello world', rank: 1 })

// Query
const posts = await Post.find({ rank: { $gte: 1 } })

// With custom collection name
const ArchivedPost = getModel('Post', 'archived_posts')
```

### 4. Typed models with generics

```ts
interface IPost {
    title: string
    rank: number
    created_at: Date
}

const Post = getModel<IPost>('Post')

const post = await Post.create({ title: 'Hello', rank: 1 })
post.title  // string
post.rank   // number
```

## API

### `createConnection(uri, options?)`

Creates a Mongoose connection with built-in event logging.

| Param | Type | Description |
|-------|------|-------------|
| `uri` | `string` | MongoDB connection URI |
| `options` | `ConnectOptions` | Mongoose connect options (default: `{ autoIndex: true }`) |

**Returns:** `Connection`

### `createStore(options)`

Creates a store that manages model loading and caching.

| Param | Type | Description |
|-------|------|-------------|
| `options.connection` | `Connection` | Mongoose connection instance |
| `options.schemas` | `string` | Absolute path to schemas directory |

**Returns:** `Schemis`

| Method | Signature | Description |
|--------|-----------|-------------|
| `getModel` | `<T = any>(modelName: string, collectionName?: string) => Model<T>` | Load and cache a typed model by schema filename |
| `getConnection` | `() => Connection` | Get the underlying connection |

## License

ISC
