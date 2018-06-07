// @flow
import React from "react"
import { View } from "react-native"
import Polygon from "./Polygon"
import AreaCoordinateMarker from "./AreaCoordinateMarker"
import type { AreaChanges, Coordinate, PressEvent } from "../../../types"

const coordinateKey = (
  { latitude, longitude }: Coordinate,
  index: number
): string =>
  index.toString() +
  "(" +
  latitude.toString() +
  "," +
  longitude.toString() +
  ")"

const coordinatesKey = (coordinates: Coordinate[]): string =>
  "[" + coordinates.map(coordinateKey).join(",") + "]"

export default class AreaChangesMapContent extends React.Component<
  Props,
  OwnState
> {
  constructor(props: Props) {
    super(props)
    const polygonCoordinates =
      props.areaChanges != null ? props.areaChanges.coordinates : []
    this.state = { polygonCoordinates }
  }

  modifyPolygonCoordinate(index: number, coordinate: Coordinate) {
    const polygonCoordinates = [
      ...this.state.polygonCoordinates.slice(0, index),
      coordinate,
      ...this.state.polygonCoordinates.slice(index + 1)
    ]
    console.log(polygonCoordinates)
    this.setState({
      polygonCoordinates
    })
  }
  render() {
    const { modifyAreaCoordinate, areaChanges } = this.props
    const { polygonCoordinates } = this.state
    const coordinates = areaChanges != null ? areaChanges.coordinates : []
    // Google Maps crashes if a polygon has no coordinates
    if (coordinates.length > 0) {
      return (
        <View>
          <Polygon
            coordinates={polygonCoordinates}
            identifier={coordinatesKey(polygonCoordinates)}
          />
          {coordinates.map((coordinate, index) => (
            <AreaCoordinateMarker
              coordinate={coordinate}
              key={coordinateKey(coordinate, index)}
              onDragEnd={modifyAreaCoordinate(index)}
              onDrag={({ nativeEvent: { coordinate: coordinate } }) => {
                console.log({ index, coordinate })
                this.modifyPolygonCoordinate(index, coordinate)
              }}
            />
          ))}
        </View>
      )
    } else {
      return <View />
    }
  }
}

type Props = {
  areaChanges: ?AreaChanges,
  modifyAreaCoordinate: number => PressEvent => void
}

type OwnState = {
  polygonCoordinates: Coordinate[]
}
