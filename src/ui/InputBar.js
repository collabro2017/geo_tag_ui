import React from "react"
import { TextInput, View } from "react-native"
import styles from "../styles"

export default function InputBar(props: Props) {
  return (
    <View style={styles.inputBar}>
      <TextInput style={styles.inputBarTextField} {...props} />
    </View>
  )
}

InputBar.defaultProps = {
  title: "Name",
  onChangeText: () => {}
}

type Props = {
  onChangeText: string => void,
  placeholder: string,
  value: string
}
