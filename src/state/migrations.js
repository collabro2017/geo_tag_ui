// Migrations for persisted store. Convert from previous version to current
// version
export default {
  0: state => {
    return {
      ...state,
      area: { ...state.area },
      tag: { ...state.tags },
      map: { ...state.map },
      nav: { ...state.nav },
      data: {
        areas: {},
        tags: {}
      }
    }
  },
  // Remove area.areas and tag.tags
  1: state => {
    return {
      ...state,
      area: {},
      tag: {},
      map: { ...state.map },
      nav: { ...state.nav },
      data: {
        areas: {},
        tags: {}
      }
    }
  },
  // Flatten area points
  2: state => {
    return {
      ...state,
      area: {},
      tag: {},
      map: { ...state.map, area: flattenedPoints(state.map.area) },
      nav: { ...state.nav },
      data: {
        areas: Object.entries(state.data.areas).reduce((acc, [id, area]) => {
          acc[id] = flattenedPoints(area)
          return acc
        }, {}),
        tags: {}
      }
    }
  }
}

const flattenedPoints = area => {
  if (area.points.pointsArray) {
    return { ...area, points: area.points.pointsArray }
  } else {
    return area
  }
}
