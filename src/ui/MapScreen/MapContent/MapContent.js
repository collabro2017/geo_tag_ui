// @flow
import React from "react"
import AreaChangesMapContent from "./AreaChangesMapContent"
import ViewMapContent from "./ViewMapContent"
import type {
  Area,
  AreaChanges,
  MapMode,
  PressEvent,
  Tag
} from "../../../types"

export default function MapContent(props: Props) {
  const {
    area,
    areas,
    mode,
    areaChanges,
    onAreaMarkerPress,
    modifyAreaCoordinate,
    onTagMarkerPress,
    tag
  } = props
  switch (mode) {
    case "create":
    case "edit":
      return (
        <AreaChangesMapContent
          areaChanges={areaChanges}
          modifyAreaCoordinate={modifyAreaCoordinate}
        />
      )
    default:
      return (
        <ViewMapContent
          area={area}
          areas={areas}
          tag={tag}
          onAreaMarkerPress={onAreaMarkerPress}
          onTagMarkerPress={onTagMarkerPress}
        />
      )
  }
}

type Props = {
  area: ?Area,
  areas: Area[],
  mode: MapMode,
  areaChanges: ?AreaChanges,
  modifyAreaCoordinate: number => PressEvent => void,
  onAreaMarkerPress: Area => () => void,
  onTagMarkerPress: Tag => () => void,
  tag: ?Tag
}
