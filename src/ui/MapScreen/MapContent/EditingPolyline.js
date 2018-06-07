// @flow
import React from "react"
import MapView from "react-native-maps"
import { colors } from "../../../styles"
import type { Coordinate } from "../../../types"

const strokeWidth = 3

const EditingPolyline = (props: Props) => {
  return (
    <MapView.Polyline
      coordinates={props.coordinates}
      strokeColor={colors.logoBlue}
      strokeWidth={strokeWidth}
    />
  )
}

type Props = {
  coordinates: Coordinate[]
}

export default EditingPolyline
