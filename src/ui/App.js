// @flow
import React from "react"
import ReduxNav from "../nav/ReduxNav"
import { PersistGate } from "redux-persist/es/integration/react"
import { Provider } from "react-redux"
import Icon from "react-native-vector-icons/Feather"
import { configureStore } from "../state"

// Load font dynamically for iOS. See
//   https://github.com/oblador/react-native-vector-icons#option-with-cocoapods
Icon.loadFont()

const { store, persistor } = configureStore()

const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ReduxNav />
      </PersistGate>
    </Provider>
  )
}

export default Root
