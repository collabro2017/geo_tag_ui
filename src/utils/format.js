// @flow
const humanDateTime = (date: Date): string => {
  // TODO: Fix
  // Dates are strings when freshly rehydrated
  if (typeof date === "object") {
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  } else {
    return date
  }
}

export { humanDateTime }
