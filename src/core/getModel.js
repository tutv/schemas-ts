const path = require('path')

const _schemas = {}
const _getSchema = (dirPath, name) => {
    if (_schemas[name]) return _schemas[name]

    const pathModel = path.join(dirPath, name)
    _schemas[name] = require(pathModel)

    return _schemas[name]
}

const _getModel = (models, connection, name, schema, collectionName) => {
    const key = collectionName || name

    if (models[key]) return models[key]

    models[key] = connection.model(name, schema, collectionName ? collectionName : null)

    return models[key]
}

module.exports = store => (modelName = '', collectionName = '') => {
    const name = (modelName || '').trim()

    if (!name) {
        throw new Error('Model name is required.')
    }

    try {
        const {connection, schemas, models} = store
        const schema = _getSchema(schemas, name)

        return _getModel(models, connection, name, schema, collectionName)
    } catch (error) {
        console.log("GET_MODEL_ERROR", error)

        return process.exit(1)
    }
}

