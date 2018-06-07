// @flow
import React from "react"
import { connect } from "react-redux"
import { mapSelectors, mapActions } from "../state/map"
import SaveButton from "./SaveButton"
import type { StyleObj } from "react-native/Libraries/StyleSheet/StyleSheetTypes"
import type { AreaChanges, Dispatch, State } from "../types"

const mapStateToProps = (state: State, ownProps: Props): Props => {
  return {
    ...ownProps,
    areaChanges: mapSelectors.getAreaChanges(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: Props): Props => {
  return {
    ...ownProps,
    onPress: () => {
      dispatch(mapActions.saveAreaChanges())
    }
  }
}

const areaHasEnoughPoints = (area: AreaChanges): boolean =>
  area.coordinates.length >= 3

const areaChangesValid = (areaChanges: AreaChanges): boolean =>
  areaHasEnoughPoints(areaChanges) && areaChanges.name.length > 0

const SaveAreaChangesButton = ({ onPress, style, areaChanges }: Props) => {
  return (
    <SaveButton
      disabled={areaChanges == null || !areaChangesValid(areaChanges)}
      onPress={onPress}
      style={style}
    />
  )
}

type Props = {
  areaChanges: ?AreaChanges,
  onPress: () => void,
  style: StyleObj
}

export default connect(mapStateToProps, mapDispatchToProps)(
  SaveAreaChangesButton
)
