import { Connection, Model } from 'mongoose'

export interface StoreOptions {
    connection: Connection
    schemas: string
}

export interface Schemis {
    getModel: (modelName: string, collectionName?: string) => Model<any>
    getConnection: () => Connection
}

export interface InternalStore extends StoreOptions {
    models: Record<string, Model<any>>
}
