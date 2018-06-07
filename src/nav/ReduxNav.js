// @flow
import React from "react"
import { connect } from "react-redux"
import { addNavigationHelpers } from "react-navigation"
import AppNav from "./AppNav"
import Cloud from "../cloud"
// import type { Dispatch } from "redux"
import type { NavigationState } from "react-navigation"
import type { Dispatch, State } from "../types"

const mapStateToProps = (state: State, ownProps: Props): Props => {
  return {
    ...ownProps,
    nav: state.nav
  }
}

type Props = {
  dispatch: Dispatch,
  nav: NavigationState
}

class ReduxNav extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Cloud.authenticate())
  }

  render() {
    const { dispatch, nav } = this.props
    const navigation = addNavigationHelpers({ dispatch, state: nav })
    return <AppNav navigation={navigation} />
  }
}

export default connect(mapStateToProps)(ReduxNav)
