import { Color } from "react-native"
import { Tag } from "../types"
import { colors } from "../styles"

const tagStatusColor = (tag: Tag): Color => {
  switch (tag.region) {
    case 0:
      return colors.statusRed
    case 1:
      return colors.statusBlue
    case 2:
      return colors.statusYellow
    case 3:
      return colors.statusGreen
    default:
      return colors.logoGray
  }
}

const tagAreaName = ({ area }: Tag): string => {
  if (area != null) {
    return area.name
  } else {
    return "Inactive"
  }
}

export { tagAreaName, tagStatusColor }
