// @flow
import React from "react"
import { View } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import styles, { colors } from "../styles"

type Props = {
  navigation: Object
}

const onPress = navigation => {
  return () => {
    navigation.navigate("DrawerToggle")
  }
}

const DrawerButton = (props: Props) => {
  return (
    <View style={styles.headerButtonLeft}>
      <Icon
        name="menu"
        size={30}
        color={colors.white}
        onPress={onPress(props.navigation)}
      />
    </View>
  )
}

export default DrawerButton
