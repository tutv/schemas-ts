import { getModel } from './getModel.js'
import { getConnection } from './getConnection.js'
import { StoreOptions, Schemis, InternalStore } from '../types/index.js'

export const createStore = (opts: StoreOptions): Schemis => {
    const store: InternalStore = {
        models: {},
        ...opts,
    }

    return {
        getModel: getModel(store),
        getConnection: getConnection(store),
    }
}
