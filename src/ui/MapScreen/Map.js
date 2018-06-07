// @flow
import React, { Component } from "react"
import { InteractionManager, View } from "react-native"
import MapView from "react-native-maps"
import { isEqual } from "lodash"
import MapContent from "./MapContent"
import { regionFromArea } from "../../utils/area"
import { defaultLatitudeDelta } from "../../state/map"
import { calculateLongitudeDelta } from "../../utils/map"
import styles from "../../styles"

import type {
  Area,
  AreaChanges,
  MapMode,
  MapType,
  PressEvent,
  Region,
  Tag
} from "../../types"

type MapViewType = {
  animateToRegion: (region: Region) => void
}

// Use the tag's area if it's available. Else a default region centered on the tag.
const regionFromTag = (tag: Tag): Region => {
  const { latitude, longitude } = tag.position
  if (tag.area != null) {
    let areaRegion = regionFromArea(tag.area)
    return { ...areaRegion, latitude, longitude }
  } else {
    return {
      latitude,
      longitude,
      latitudeDelta: defaultLatitudeDelta,
      longitudeDelta: calculateLongitudeDelta(defaultLatitudeDelta)
    }
  }
}

const pickRegion = (props: Props): Region => {
  const { area, lastRegion, mode, tag } = props
  switch (mode) {
    case "area":
      if (area != null) {
        return regionFromArea(area)
      }
    // fallthrough
    case "tag":
      if (tag != null) {
        return regionFromTag(tag)
      }
    // fallthrough
    default:
      return lastRegion
  }
}

type AreaMarkerPressHandler = Area => () => void
const onAreaMarkerPress = (
  map: Map,
  navigateToArea: Area => void
): AreaMarkerPressHandler => {
  return (area: Area) => {
    return () => {
      map.setState({ area })
      navigateToArea(area)
      // Ensure the animation doesn't get swallowed by re-render
      InteractionManager.runAfterInteractions(() => {
        const region = regionFromArea(area)
        const mapView = map._map
        if (mapView != null) {
          mapView.animateToRegion(region)
        }
      })
    }
  }
}

type TagMarkerPressHandler = Tag => () => void
const onTagMarkerPress = (
  map: Map,
  navigateToTag: Tag => void
): TagMarkerPressHandler => {
  return (tag: Tag) => {
    return () => {
      map.setState({ tag })
      navigateToTag(tag)
      // Ensure the animation doesn't get swallowed by re-render
      InteractionManager.runAfterInteractions(() => {
        const region = regionFromTag(tag)
        const mapView = map._map
        if (mapView != null) {
          mapView.animateToRegion(region)
        }
      })
    }
  }
}

type RegionHandler = Region => void
const onRegionChangeComplete = (map: Map): RegionHandler => {
  return (region: Region) => {
    map.setState({ region })
  }
}

class Map extends Component<Props, MapComponentState> {
  _map: ?MapViewType
  _onRegionChangeComplete: RegionHandler
  _onAreaMarkerPress: AreaMarkerPressHandler
  _onTagMarkerPress: TagMarkerPressHandler

  constructor(props: Props) {
    super(props)
    const region = pickRegion(props)
    const { area, tag } = props
    this.state = { area, region, tag }
    this._onAreaMarkerPress = onAreaMarkerPress(this, props.navigateToArea)
    this._onTagMarkerPress = onTagMarkerPress(this, props.navigateToTag)
    this._onRegionChangeComplete = onRegionChangeComplete(this)
  }

  componentDidMount() {
    this.props.saveRegion(this.state.region)
  }

  componentWillUnmount() {
    this.props.saveRegion(this.state.region)
  }

  shouldComponentUpdate(
    nextProps: Props,
    nextState: MapComponentState
  ): boolean {
    // Ignore the region held in state, since state updates in response to changes
    // in the map.
    const shouldUpdate =
      !isEqual(this.props, nextProps) ||
      !isEqual(this.state.area, nextState.area)
    // console.log({ mapShouldUpdate: shouldUpdate })
    return shouldUpdate
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          initialRegion={this.state.region}
          mapType={this.props.mapType}
          onLongPress={
            this.props.mode !== "create" && this.props.mode !== "edit"
              ? this.props.onLongPress
              : undefined
          }
          onPress={this.props.onPress}
          onRegionChangeComplete={this._onRegionChangeComplete}
          ref={(ref: ?MapViewType) => (this._map = ref)}
          region={this.state.region}
          style={styles.map}
        >
          <MapContent
            area={this.state.area}
            areas={this.props.areas}
            mode={this.props.mode}
            areaChanges={this.props.areaChanges}
            tag={this.props.tag}
            modifyAreaCoordinate={this.props.modifyAreaCoordinate}
            onAreaMarkerPress={this._onAreaMarkerPress}
            onTagMarkerPress={this._onTagMarkerPress}
          />
        </MapView>
      </View>
    )
  }
}

type Props = {
  area: ?Area,
  areas: Area[],
  lastRegion: Region,
  mapType: MapType,
  mode: MapMode,
  navigateToArea: Area => void,
  navigateToTag: Tag => void,
  areaChanges: ?AreaChanges,
  modifyAreaCoordinate: number => PressEvent => void,
  onLongPress: PressEvent => void,
  onPress: PressEvent => void,
  saveRegion: RegionHandler,
  tag: ?Tag
}

type MapComponentState = {
  area: ?Area,
  region: Region,
  tag: ?Tag
}

export default Map
