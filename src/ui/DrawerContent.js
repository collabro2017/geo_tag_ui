import React from "react"
import { ScrollView } from "react-native"
import { DrawerItems, SafeAreaView } from "react-navigation"
import styles from "../styles"

const DrawerContent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerItems {...props} />
    </SafeAreaView>
  </ScrollView>
)

export default DrawerContent
