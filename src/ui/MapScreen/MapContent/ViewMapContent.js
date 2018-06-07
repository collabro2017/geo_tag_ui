// @flow
import React from "react"
import { View } from "react-native"
import AreaMarker from "./AreaMarker"
import Polygon from "./Polygon"
import TagMarker from "./TagMarker"
import { coordinatesFromArea } from "../../../utils/area"
import type { Area, Coordinate, Tag } from "../../../types"

const identifier = (area: ?Area): string =>
  area != null ? area.identifier.toString() : "-1"

export default function ViewMapContent(props: Props) {
  const { area, areas, tag, onAreaMarkerPress, onTagMarkerPress } = props
  const coordinates: Coordinate[] = coordinatesFromArea(area)
  return (
    <View>
      {areas.map(area => (
        <AreaMarker
          area={area}
          key={area.id}
          onMarkerPress={onAreaMarkerPress(area)}
        />
      ))}
      {coordinates.length > 0 && (
        <Polygon coordinates={coordinates} identifier={identifier(area)} />
      )}
      {tag != null && <TagMarker tag={tag} onPress={onTagMarkerPress(tag)} />}
    </View>
  )
}

type Props = {
  area: ?Area,
  areas: Area[],
  onAreaMarkerPress: Area => () => void,
  onTagMarkerPress: Tag => () => void,
  tag: ?Tag
}
