// @flow
import React from "react"
import { connect } from "react-redux"
import { FlatList, View } from "react-native"
import { tagSelectors } from "../../state/tag"
import { headerLeft, headerRight, headerTitle } from "../../nav"
import TagListItem from "./TagListItem"
import ItemSeparator from "../ListItemSeparator"
import StatusBar from "../StatusBar"
import type {
  NavigationScreenProp,
  NavigationScreenConfigProps
} from "react-navigation"
import type { State, Tag } from "../../types"

type Props = {
  data: Tag[],
  navigation: NavigationScreenProp<*>,
  onPressItem: Tag => void
}

const mapStateToProps = (state: State, ownProps: Props): Props => {
  return {
    ...ownProps,
    // Tags sorted by region. Lowest region is "out"
    data: tagSelectors.getTags(state).sort((a, b) => b.region - a.region),
    onPressItem: (tag: Tag) => {
      ownProps.navigation.navigate("map", { tag, mode: "tag" })
    }
  }
}

const keyExtractor = (item: Tag) => item.id

class TagScreen extends React.Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenConfigProps) => {
    const { routeName, params } = navigation.state
    return {
      title: "Map",
      headerLeft: headerLeft(navigation),
      headerRight: headerRight(routeName, params),
      headerTitle: headerTitle(routeName, params)
    }
  }

  constructor(props: Props) {
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
            return <TagListItem tag={item} onPress={this.props.onPressItem} />
          }}
        />
      </View>
    )
  }
}

export default connect(mapStateToProps)(TagScreen)
