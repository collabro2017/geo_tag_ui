// @flow
import React from "react"
import { Marker } from "react-native-maps"
import { tagAreaName, tagStatusColor } from "../../tagDisplay"
import type { Tag } from "../../../types"

export default function TagMarker({ tag, onPress }: Props) {
  return (
    <Marker
      // key={tag.id + " " + JSON.stringify(tag.position)}
      coordinate={tag.position}
      title={tag.name}
      description={tagAreaName(tag)}
      pinColor={tagStatusColor(tag)}
      onPress={onPress}
    />
  )
}

type Props = {
  tag: Tag,
  onPress: () => void
}
