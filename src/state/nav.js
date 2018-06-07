// @flow
import AppNav from "../nav/AppNav"
import { NavigationActions } from "react-navigation"
import type {
  NavigationAction,
  NavigationState,
  NavigationRouter
} from "react-navigation"
import type { Reducer } from "redux"

// REDUCERS

// Init the main router. See
//   https://github.com/react-navigation/react-navigation/issues/1919
const router: NavigationRouter<NavigationState, *> = AppNav.router
const initAction: NavigationAction = NavigationActions.init()
const initialNavState: NavigationState = router.getStateForAction(
  initAction
) || { index: 0, routes: [] }

const reducer: Reducer<NavigationState, NavigationAction> = (
  maybeState: NavigationState,
  action: NavigationAction
): NavigationState => {
  const state = maybeState || initialNavState

  // Only handle navigation actions
  if (action.type === "Navigation/NAVIGATE") {
    const nextState = router.getStateForAction(action, state)
    return nextState || state
  } else {
    return state
  }
}

// INTERFACE
export default reducer
export { initialNavState }
