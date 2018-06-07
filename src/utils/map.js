// @flow
import { Dimensions } from "react-native"

type Size = {
  width: number,
  height: number
}

const calculateLongitudeDelta = (latitudeDelta: number): number => {
  const size: Size = Dimensions.get("window")
  return latitudeDelta * size.width / size.height
}

export { calculateLongitudeDelta }
