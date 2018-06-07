// @flow
import React from "react"
import { StatusBar } from "react-native"
import { colors } from "../styles"

export default function Status() {
  return (
    <StatusBar backgroundColor={colors.logoGray} barStyle="light-content" />
  )
}
