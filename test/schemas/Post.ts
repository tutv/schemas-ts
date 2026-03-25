import { Schema } from 'mongoose'

const PostSchema = new Schema({
    title: {
        type: String,
        trim: true
    },

    rank: {
        type: Number,
        index: true
    },

    created_at: {
        type: Date,
        default: Date.now
    }
})

PostSchema.index({
    title: 1,
    rank: 1
})

export default PostSchema
