//@flow
import type { Reducer } from "redux"
import type {
  Area,
  DataAction,
  DataState,
  Dispatch,
  State,
  Tag
} from "../types"

// ACTIONS
const actions = {
  saveAreas: (areas: Area[]) => {
    return (dispatch: Dispatch) => {
      // TODO: Handle new and updated areas differently
      dispatch({ type: "AREAS_FETCH_SUCCESS", payload: areas })
    }
  },

  saveTags: (tags: Tag[]) => {
    return (dispatch: Dispatch) => {
      // TODO: Handle new and updated tags differently
      dispatch({ type: "TAGS_FETCH_SUCCESS", payload: tags })
    }
  }
}

const initialState = {
  areas: {},
  tags: {}
}

// SELECTORS
const selectors = {
  getArea: (state: State, id: string): ?Area => state.data.areas[id],
  getAreas: (state: State): Area[] => all(state.data.areas),
  getTags: (state: State): Tag[] => all(state.data.tags)
}

const all = function<T>(map: { [key: string]: T }): T[] {
  return Object.keys(map).map(key => map[key])
}

const reducer: Reducer<DataState, DataAction> = (
  state: DataState = initialState,
  action: DataAction
): DataState => {
  switch (action.type) {
    case "AREAS_FETCH_SUCCESS":
      return addAreasToStore(state, action.payload)
    case "TAGS_FETCH_SUCCESS":
      return addTagsToStore(state, action.payload)
    case "AREA_SAVE_SUCCESS":
      return addAreasToStore(state, [action.payload])
    default:
      return state
  }
}

type Identifiable = { id: string }
// Reduce the objects in `array` into an object where they are keyed by id
const intoMap = function<T: Identifiable>(array: T[]): { [key: string]: T } {
  return array.reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {})
}

const addAreasToStore = (state: DataState, incoming: Area[]): DataState => {
  return { ...state, areas: { ...state.areas, ...intoMap(incoming) } }
}

const addTagsToStore = (state: DataState, incoming: Tag[]): DataState => {
  return { ...state, tags: { ...state.tags, ...intoMap(incoming) } }
}

// INTERFACE
export default reducer
export { actions as dataActions }
export { selectors as dataSelectors }
export { initialState as initialDataState }
