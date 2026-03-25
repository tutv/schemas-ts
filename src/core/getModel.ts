import path from 'path'
import { createRequire } from 'node:module'
import { Connection, Model, Schema } from 'mongoose'
import { InternalStore } from '../types/index.js'

const require = createRequire(import.meta.url)

const _schemas: Record<string, Schema> = {}

const _getSchema = (dirPath: string, name: string): Schema => {
    if (_schemas[name]) return _schemas[name]

    const pathModel = path.join(dirPath, name)
    _schemas[name] = require(pathModel)

    return _schemas[name]
}

const _getModel = (
    models: Record<string, Model<any>>,
    connection: Connection,
    name: string,
    schema: Schema,
    collectionName: string
): Model<any> => {
    const key = collectionName || name

    if (models[key]) return models[key]

    models[key] = connection.model(name, schema, collectionName || undefined)

    return models[key]
}

export const getModel = (store: InternalStore) => (modelName = '', collectionName = ''): Model<any> => {
    const name = (modelName || '').trim()

    if (!name) {
        throw new Error('Model name is required.')
    }

    try {
        const { connection, schemas, models } = store
        const schema = _getSchema(schemas, name)

        return _getModel(models, connection, name, schema, collectionName)
    } catch (error) {
        console.log('GET_MODEL_ERROR', error)

        return process.exit(1)
    }
}
