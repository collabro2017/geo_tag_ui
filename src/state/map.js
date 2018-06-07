// @flow
import cloud from "../cloud"
import { createErrorAction } from "../utils/error"
import { calculateLongitudeDelta } from "../utils/map"
import { coordinatesFromArea } from "../utils/area"
import type {
  Area,
  AreaChanges,
  Coordinate,
  Dispatch,
  GetState,
  MapAction,
  MapMode,
  MapState,
  Region,
  State,
  Tag,
  ThunkAction
} from "../types"

// ACTIONS
const actions = {
  addCoordinateToAreaChanges: (coordinate: Coordinate): MapAction => ({
    type: "AREA_CHANGES_ADD_COORDINATE",
    payload: coordinate
  }),

  modifyAreaChangesCoordinate: (
    index: number,
    coordinate: Coordinate
  ): MapAction => ({
    type: "AREA_CHANGES_MODIFY_COORDINATE",
    payload: { index, coordinate }
  }),

  regionChanged: (region: Region): MapAction => ({
    type: "MAP_REGION_CHANGED",
    payload: { region }
  }),

  createBoundary: (): MapAction => ({
    type: "AREA_CREATE",
    payload: {}
  }),

  navigateToArea: (area: Area): MapAction => ({
    type: "Navigation/NAVIGATE",
    routeName: "map",
    params: { mode: "area", area }
  }),

  // TODO: Actually save the changes (replace Promise with an action)
  saveAreaChanges: (): ThunkAction => {
    return (dispatch: Dispatch, getState: GetState) => {
      const areaChanges = selectors.getAreaChanges(getState())
      if (areaChanges == null) {
        const error = createErrorAction(
          "AREA_SAVE_FAILURE",
          "no area changes found"
        )
        dispatch(error)
        return
      }

      const { id, name, coordinates } = areaChanges
      return cloud.saveArea(id, name, coordinates).then(
        (area: Area) => {
          dispatch({ type: "AREA_SAVE_SUCCESS", payload: area })
          dispatch(actions.navigateToArea(area))
        },
        error => {
          const err = createErrorAction("AREA_SAVE_FAILURE", error)
          dispatch(err)
        }
      )
    }
  },

  updateAreaChangesName: (name: string): MapAction => ({
    type: "AREA_CHANGES_UPDATE_NAME",
    payload: name
  })
}

// SELECTORS
const selectors = {
  getArea: (state: State): ?Area => state.map.area,
  getLastMode: (state: State): MapMode => state.map.lastMode,
  getLastRegion: (state: State): Region => state.map.lastRegion,
  getMode: (state: State): MapMode => state.map.mode,
  getAreaChanges: (state: State): ?AreaChanges => state.map.areaChanges,
  getTag: (state: State): ?Tag => state.map.tag
}

// REDUCERS
const defaultLatitudeDelta = 0.00922
const defaultRegion: Region = {
  latitude: 44.906005,
  longitude: -93.198442,
  latitudeDelta: defaultLatitudeDelta,
  longitudeDelta: calculateLongitudeDelta(defaultLatitudeDelta)
}

const initialMapState: MapState = {
  area: null,
  lastMode: "view",
  lastRegion: defaultRegion,
  mode: "view",
  areaChanges: null,
  region: null,
  tag: null
}

const nextLastMode = (state: MapState, nextMode: MapMode): MapMode => {
  return nextMode !== state.mode ? state.mode : state.lastMode
}

const areaChanges = (area: ?Area): AreaChanges => {
  if (area != null) {
    return {
      coordinates: coordinatesFromArea(area),
      id: area.id,
      name: area.name
    }
  } else {
    return {
      coordinates: [],
      id: null,
      name: ""
    }
  }
}

const setCoordinateAtIndex = (
  coordinates: Coordinate[],
  coordinate: Coordinate,
  index: number
): Coordinate[] => {
  return [
    ...coordinates.slice(0, index),
    coordinate,
    ...coordinates.slice(index + 1)
  ]
}

const reducer = (
  state: MapState = initialMapState,
  action: MapAction
): MapState => {
  switch (action.type) {
    case "MAP_REGION_CHANGED":
      return {
        ...state,
        lastRegion: action.payload.region
      }
    case "AREA_CREATE":
      return {
        ...state,
        lastMode: state.mode,
        mode: "create"
      }
    case "AREA_CHANGES_CANCEL":
      return {
        ...state,
        mode: state.lastMode,
        areaChanges: null
      }
    case "AREA_CHANGES_ADD_COORDINATE":
      return {
        ...state,
        areaChanges: {
          ...state.areaChanges,
          coordinates: [
            ...(state.areaChanges != null ? state.areaChanges.coordinates : []),
            action.payload
          ]
        }
      }
    case "AREA_CHANGES_MODIFY_COORDINATE":
      return {
        ...state,
        areaChanges: {
          ...state.areaChanges,
          coordinates: [
            ...setCoordinateAtIndex(
              state.areaChanges ? state.areaChanges.coordinates || [] : [],
              action.payload.coordinate,
              action.payload.index
            )
          ]
        }
      }
    case "AREA_CHANGES_UPDATE_NAME":
      return {
        ...state,
        areaChanges: {
          ...state.areaChanges,
          name: action.payload
        }
      }
    case "Navigation/NAVIGATE":
      switch (action.routeName) {
        case "map":
          if (action.params != null && action.params.mode === "create") {
            // Create mode
            const lastMode = nextLastMode(state, "create")
            const changes = areaChanges(null)
            return { ...state, lastMode, mode: "create", areaChanges: changes }
          } else if (action.params != null && action.params.mode === "edit") {
            // Create mode
            const lastMode = nextLastMode(state, "edit")
            const changes = areaChanges(state.area)
            return { ...state, lastMode, mode: "edit", areaChanges: changes }
          } else if (action.params != null && action.params.mode == "area") {
            // Area was selected to show on the map
            const area = action.params.area
            const lastMode: MapMode = nextLastMode(state, "area")
            return { ...state, area, lastMode, mode: "area", areaChanges: null }
          } else if (action.params != null && action.params.mode == "tag") {
            // Tag was selected to show on the map
            const tag = action.params.tag
            const lastMode: MapMode = nextLastMode(state, "tag")
            const area = tag.area
            return {
              ...state,
              area,
              tag,
              lastMode,
              mode: "tag",
              areaChanges: null
            }
          } else if (action.params != null) {
            // Nothing selected, just viewing the map
            const mode = action.params.mode || state.mode
            const lastMode: MapMode = nextLastMode(state, mode)
            return { ...state, lastMode, mode, areaChanges: null }
          } else {
            return state
          }
        default:
          return state
      }
    default:
      return state
  }
}

// INTERFACE
export { selectors as mapSelectors }
export { actions as mapActions }
export { initialMapState, defaultLatitudeDelta }
export default reducer
