// @flow
import { dataSelectors } from "./data"
import type { Reducer } from "redux"
import type { Area, AreaAction, AreaState, State } from "../types"

// SELECTORS
const selectors = {
  getAreas: (state: State): Area[] =>
    dataSelectors
      .getAreas(state)
      // Don't display areas with blank names
      .filter(area => area.name && area.name.trim().length > 0)
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}

const initialState: AreaState = {}

// REDUCERS

const reducer: Reducer<AreaState, AreaAction> = (
  state: AreaState = initialState,
  action: AreaAction
): AreaState => {
  switch (action.type) {
    case "AREA_SELECTED":
      return { ...state, selectedId: action.payload }
    default:
      return state
  }
}

// INTERFACE
export default reducer
export { selectors as areaSelectors }
export { initialState as initialAreaState }
