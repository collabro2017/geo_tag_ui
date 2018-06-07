// @flow
import { applyMiddleware, combineReducers, compose, createStore } from "redux"
import { createMigrate, persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/es/storage"
import thunk from "redux-thunk"
import logger from "redux-logger"
import { composeWithDevTools } from "redux-devtools-extension"
import data, { initialDataState } from "./data"
import area, { initialAreaState, areaSelectors } from "./area"
import tag, { initialTagState, tagSelectors } from "./tag"
import map, { initialMapState } from "./map"
import nav, { initialNavState } from "./nav"
import migrations from "./migrations"

import type { Reducer, Store, StoreCreator } from "redux"
import type { State } from "../types"

const rootReducer: Reducer = combineReducers({
  data,
  map,
  nav,
  area,
  tag
})

// TODO: Prefer to load last region from storage instead or current location, if available,
// instead of using a default region
const defaultState: State = {
  data: initialDataState,
  map: initialMapState,
  nav: initialNavState,
  area: initialAreaState,
  tag: initialTagState
}

const persistConfig = {
  key: "root",
  storage,
  // migrate: createMigrate(migrations, { debug: true }),
  migrate: createMigrate(migrations),
  version: 2
}

const reducer = persistReducer(persistConfig, rootReducer)

// TODO: Use normal compose in production builds
const composeEnhancers = composeWithDevTools || compose
const enhancer = composeEnhancers(applyMiddleware(thunk, logger))

function createTagStore(initialState = {}): StoreCreator {
  const state = { ...defaultState, ...initialState }
  return createStore(reducer, state, enhancer)
}

type StoreWithPersistor = {
  store: Store,
  persistor: Object
}

function configureStore(): StoreWithPersistor {
  const store = createTagStore()
  const persistor: Object = persistStore(store)
  return { store, persistor }
}

export { configureStore, areaSelectors, tagSelectors }
