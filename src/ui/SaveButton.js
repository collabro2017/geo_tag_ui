// @flow
import React from "react"
import { TouchableOpacity } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { colors } from "../styles"
import type { StyleObj } from "react-native/Libraries/StyleSheet/StyleSheetTypes"

const color = (disabled: boolean): string => {
  return disabled ? colors.lightGray : colors.white
}

export default function SaveButton({ disabled, onPress, style }: Props) {
  return (
    <TouchableOpacity style={style} disabled={disabled}>
      <Icon color={color(disabled)} name="check" onPress={onPress} size={30} />
    </TouchableOpacity>
  )
}

type Props = {
  disabled: boolean,
  onPress: () => void,
  style: StyleObj
}
