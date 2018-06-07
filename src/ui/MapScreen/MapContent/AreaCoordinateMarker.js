// @flow
import React from "react"
import { View } from "react-native"
import { Marker } from "react-native-maps"
import styles from "../../../styles"
import type { Coordinate } from "../../../types"

export default function AreaCoordinateMarker(props: Props) {
  return (
    <Marker draggable anchor={{ x: 0.5, y: 0.5 }} {...props}>
      <View style={styles.mapAreaCoordinateMarker} />
    </Marker>
  )
}

type Props = {
  coordinate: Coordinate
}
