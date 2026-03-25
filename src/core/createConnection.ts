import mongoose, { ConnectOptions } from 'mongoose'

export const createConnection = (uri: string, options?: ConnectOptions) => {
    const vUri = uri ? uri.trim() : ''
    if (!vUri) {
        throw new Error('URI is required.')
    }

    const vOptions = { autoIndex: true, ...options }

    const connection = mongoose.createConnection(uri, vOptions)

    connection.on('connected', () => {
        console.log('MongoDB is connected.')
    })

    connection.on('connecting', () => {
        console.log('MongoDB is connecting.')
    })

    connection.on('reconnected', () => {
        console.log('MongoDB is reconnected.')
    })

    connection.on('disconnected', () => {
        console.log('MongoDB is disconnected.')
    })

    connection.on('close', () => {
        console.log('MongoDB is closed.')
    })

    connection.on('error', (error: Error) => {
        console.log('MongoDB is error.', error)
    })

    return connection
}
