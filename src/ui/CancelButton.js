// @flow
import React from "react"
import { TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../styles"
import type { StyleObj } from "react-native/Libraries/StyleSheet/StyleSheetTypes"

export default function CancelButton(props: Props) {
  const { onPress, style } = props
  return (
    <TouchableOpacity style={style}>
      <Icon color={colors.white} name="x" onPress={onPress} size={30} />
    </TouchableOpacity>
  )
}

type Props = {
  onPress: () => void,
  style: StyleObj
}
