// @flow
import { StyleSheet } from "react-native"

const lightGray = "#aaaaaa"
const logoBlue = "#00A9E0"
const logoGray = "#505050"
const statusBlue = "#0074D9"
const statusGreen = "#2ECC40"
const statusRed = "#FF4136"
const statusYellow = "#FFDC00"
const white = "#ffffff"
const nearlyWhite = "#f8f8f8"

// Precomputed alpha values in hex
const alpha50 = "80"

const colorWithAlpha = (color: string, alpha: string): string =>
  `${color}${alpha}`

export const colors = {
  lightGray,
  logoBlue,
  logoGray,
  statusBlue,
  statusGreen,
  statusGreenAlpha50: colorWithAlpha(statusGreen, alpha50),
  statusRed,
  statusYellow,
  white,
  nearlyWhite
}

// Type scale after http://tachyons.io/docs/typography/scale/
const baseFontSize = 16
const typeScale = [3, 2.25, 1.5, 1.25, 1, 0.875, 0.75]

const fontSize = {
  one: baseFontSize * typeScale[0],
  two: baseFontSize * typeScale[1],
  three: baseFontSize * typeScale[2],
  four: baseFontSize * typeScale[3],
  five: baseFontSize * typeScale[4],
  six: baseFontSize * typeScale[5],
  seven: baseFontSize * typeScale[6]
}

// Spacing scale after
const baseSpacingUnit = baseFontSize
const spacing = {
  zero: 0,
  one: baseSpacingUnit * 0.25,
  two: baseSpacingUnit * 0.5,
  three: baseSpacingUnit * 1,
  four: baseSpacingUnit * 2,
  five: baseSpacingUnit * 4,
  six: baseSpacingUnit * 8,
  seven: baseSpacingUnit * 16
}

// View-specific values
const modificationMarkerSize = 20

const inputBarPadding = spacing.three
const inputBarLabelFontSize = fontSize.six
const inputBarTextFieldPadding = spacing.two
const inputBarTextFieldBottomPadding = spacing.zero
const inputBarTextFieldBorderBottomWidth = 1
const inputBarTextFieldFontSize = fontSize.three
const inputBarHeight =
  inputBarTextFieldFontSize +
  2 * inputBarPadding +
  inputBarTextFieldBorderBottomWidth +
  inputBarTextFieldBottomPadding +
  spacing.one // fudge factor

export { inputBarHeight }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  listItem: {
    padding: spacing.three
  },
  listItemText: {
    fontSize: fontSize.four
  },
  listItemSubtext: {
    fontSize: fontSize.five
  },
  listItemSeparator: {
    backgroundColor: colors.lightGray,
    height: 1,
    width: "100%"
  },
  welcome: {
    fontSize: fontSize.four,
    textAlign: "center",
    margin: spacing.three
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: spacing.two
  },
  map: {
    flex: 1
  },
  mapAreaCoordinateMarker: {
    backgroundColor: colors.white,
    borderColor: colors.logoBlue,
    borderWidth: 2,
    borderRadius: modificationMarkerSize * 0.5,
    height: modificationMarkerSize,
    width: modificationMarkerSize
  },
  tagListItem: {
    padding: spacing.three,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  tagListItemIcon: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: spacing.three
  },
  tagListItemTitle: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start"
  },
  tagListItemTitleLastSeen: {
    fontSize: fontSize.six,
    color: colors.logoGray
  },
  tagListItemTitleText: {
    fontSize: fontSize.four
  },
  tagListItemSubtitleText: {
    fontSize: fontSize.five,
    color: colors.logoGray,
    marginBottom: spacing.one
  },
  inputBar: {
    alignItems: "flex-start",
    backgroundColor: colors.nearlyWhite,
    flex: 0,
    flexDirection: "column-reverse",
    padding: inputBarPadding
  },
  inputBarLabel: {
    color: colors.lightGray,
    fontSize: inputBarLabelFontSize
  },
  inputBarTextField: {
    borderBottomWidth: inputBarTextFieldBorderBottomWidth,
    borderBottomColor: colors.lightGray,
    color: colors.logoGray,
    flex: 0,
    fontSize: inputBarTextFieldFontSize,
    marginRight: inputBarTextFieldPadding,
    width: "100%"
  },
  headerButtonLeft: {
    paddingLeft: spacing.two
  },
  headerButtonRight: {
    paddingRight: spacing.two
  },
  navigationHeader: {
    backgroundColor: colors.logoGray
  },
  drawerHeader: {
    backgroundColor: "#333333",
    height: 100
  }
})

export default styles
