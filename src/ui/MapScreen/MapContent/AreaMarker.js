// @flow
import React from "react"
import { Marker } from "react-native-maps"
import { colors } from "../../../styles"
import type { Area } from "../../../types"

export default function AreaMarker({ area, onMarkerPress }: Props) {
  return (
    <Marker
      coordinate={area.centroid}
      title={area.name}
      onPress={onMarkerPress}
      pinColor={colors.logoBlue}
    />
  )
}

type Props = {
  area: Area,
  onMarkerPress: () => void
}
