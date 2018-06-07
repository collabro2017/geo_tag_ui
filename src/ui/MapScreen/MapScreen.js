// @flow
import React, { Component } from "react"
import { connect } from "react-redux"
import { View } from "react-native"
import { mapSelectors, mapActions } from "../../state/map"
import { areaSelectors } from "../../state/area"
import Map from "./Map"
import InputBar from "../InputBar"
import SlideDownFromTopView from "../SlideDownFromTopView"
import StatusBar from "../StatusBar"
import { headerLeft, headerRight, headerTitle } from "../../nav"
import { inputBarHeight } from "../../styles"
import { isInside } from "../../utils/area"
import type {
  NavigationScreenConfigProps,
  NavigationScreenProp
} from "react-navigation"
import type {
  Area,
  AreaChanges,
  Dispatch,
  Region,
  MapMode,
  MapType,
  PressEvent,
  State,
  Tag
} from "../../types"

const mapStateToProps = (state: State, ownProps: Props) => {
  const areaChanges = mapSelectors.getAreaChanges(state)
  const areaChangesName = areaChanges != null ? areaChanges.name : ""
  return {
    ...ownProps,
    area: mapSelectors.getArea(state),
    areas: areaSelectors.getAreas(state),
    areaChanges,
    areaChangesName,
    lastRegion: mapSelectors.getLastRegion(state),
    mode: mapSelectors.getMode(state),
    mapType: "hybrid",
    tag: mapSelectors.getTag(state)
  }
}

type PressEventHandler = PressEvent => void
const mapDispatchToProps = (dispatch: Dispatch, ownProps: Props): Props => {
  return {
    ...ownProps,
    navigateToArea: (area: Area) => {
      ownProps.navigation.navigate("map", { mode: "area", area })
    },
    navigateToTag: (tag: Tag) => {
      ownProps.navigation.navigate("map", { mode: "tag", tag })
    },
    modifyAreaCoordinate: (index): PressEventHandler => {
      return ({ nativeEvent: { coordinate } }: PressEvent) => {
        dispatch(mapActions.modifyAreaChangesCoordinate(index, coordinate))
      }
    },
    onPress: (mapScreen: MapScreen): PressEventHandler => {
      return ({ nativeEvent: { coordinate } }: PressEvent) => {
        if (mapScreen.props.mode === "create") {
          dispatch(mapActions.addCoordinateToAreaChanges(coordinate))
        }
      }
    },
    onLongPress: (mapScreen: MapScreen): PressEventHandler => {
      return ({ nativeEvent: { coordinate } }: PressEvent) => {
        let area = mapScreen.props.area
        if (area != null && isInside(area, coordinate)) {
          ownProps.navigation.navigate("map", { mode: "edit" })
        } else {
          ownProps.navigation.navigate("map", { mode: "create" })
        }
      }
    },

    onAreaNameChanged: (name: string) => {
      dispatch(mapActions.updateAreaChangesName(name))
    },

    saveRegion: (region: Region) => {
      dispatch(mapActions.regionChanged(region))
    }
  }
}

const inputBarPlaceholder = (mode: MapMode): string => {
  if (mode === "edit") {
    return "Edit area"
  } else {
    return "New area"
  }
}

class MapScreen extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
    const { routeName, params } = navigation.state
    return {
      title: "Map",
      headerLeft: headerLeft(navigation),
      headerRight: headerRight(routeName, params),
      headerTitle: headerTitle(routeName, params)
    }
  }

  _onPress: PressEvent => void
  _onLongPress: PressEvent => void

  constructor(props: Props) {
    super(props)
    this._onPress = this.props.onPress(this)
    this._onLongPress = this.props.onLongPress(this)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        {(this.props.mode == "create" || this.props.mode == "edit") && (
          <SlideDownFromTopView height={inputBarHeight}>
            <InputBar
              onChangeText={this.props.onAreaNameChanged}
              placeholder={inputBarPlaceholder(this.props.mode)}
              value={this.props.areaChangesName}
            />
          </SlideDownFromTopView>
        )}
        <Map
          area={this.props.area}
          areas={this.props.areas}
          lastRegion={this.props.lastRegion}
          mapType={this.props.mapType}
          mode={this.props.mode}
          navigateToArea={this.props.navigateToArea}
          navigateToTag={this.props.navigateToTag}
          areaChanges={this.props.areaChanges}
          modifyAreaCoordinate={this.props.modifyAreaCoordinate}
          onLongPress={this._onLongPress}
          onPress={this._onPress}
          saveRegion={this.props.saveRegion}
          tag={this.props.tag}
        />
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
  areaChanges: ?AreaChanges,
  areaChangesName: string,
  navigateToArea: Area => void,
  navigateToTag: Tag => void,
  navigation: NavigationScreenProp<*>,
  modifyAreaCoordinate: number => PressEventHandler,
  onAreaNameChanged: string => void,
  onLongPress: MapScreen => PressEventHandler,
  onPress: MapScreen => PressEventHandler,
  saveRegion: Region => void,
  tag: ?Tag
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen)
