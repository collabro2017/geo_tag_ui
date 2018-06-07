// @flow
import React from "react"
import { connect } from "react-redux"
import { FlatList, View } from "react-native"
import { areaSelectors } from "../../state/area"
import { headerLeft, headerRight, headerTitle } from "../../nav"
import AreaListItem from "./AreaListItem"
import ItemSeparator from "../ListItemSeparator"
import StatusBar from "../StatusBar"
import type {
  NavigationScreenConfigProps,
  NavigationScreenProp
} from "react-navigation"
import type { Dispatch } from "redux-thunk"
import type { Area, State } from "../../types"

type Props = {
  data: Area[],
  navigation: NavigationScreenProp<*>,
  onPressItem: (area: Area) => typeof undefined
}

const mapStateToProps = (state: State, ownProps: Props): Props => {
  return {
    ...ownProps,
    data: areaSelectors.getAreas(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: Props): Props => {
  return {
    ...ownProps,
    onPressItem: (area: Area) => {
      ownProps.navigation.navigate("map", { area, mode: "area" })
    }
  }
}

const keyExtractor = (item: Area) => item.id

class AreaScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
    const { routeName, params } = navigation.state
    return {
      title: "Areas",
      headerLeft: headerLeft(navigation),
      headerRight: headerRight(routeName, params),
      headerTitle: headerTitle(routeName, params)
    }
  }
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        <FlatList
          data={this.props.data}
          ItemSeparatorComponent={ItemSeparator}
          keyExtractor={keyExtractor}
          renderItem={({ item }) => {
            return <AreaListItem area={item} onPress={this.props.onPressItem} />
          }}
        />
      </View>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AreaScreen)
