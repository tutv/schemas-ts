import { Connection } from 'mongoose'
import { InternalStore } from '../types/index.js'

export const getConnection = (store: InternalStore) => (): Connection => {
    try {
        const { connection } = store
        return connection
    } catch (e) {
        console.error(e)
        throw e
    }
}
