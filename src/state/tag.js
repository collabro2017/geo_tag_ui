// @flow
import { dataSelectors } from "./data"
import type { Reducer } from "redux"
import type { State, Tag, TagAction, TagState } from "../types"

// SELECTORS
const selectors = {
  getTags: (state: State): Tag[] =>
    dataSelectors.getTags(state).map(tag => {
      let area = dataSelectors.getArea(state, tag.boundaryId)
      return { ...tag, area }
    })
}

const initialState: TagState = {}

// REDUCERS

const reducer: Reducer<TagState, TagAction> = (
  state: TagState = initialState,
  action: TagAction
): TagState => {
  switch (action.type) {
    default:
      return state
  }
}

// INTERFACE
export default reducer
export { selectors as tagSelectors }
export { initialState as initialTagState }
