import {
  areaFromNameAndCoordinates,
  coordinatesFromArea,
  isInside,
  regionFromArea
} from "../area"
import {
  chesterHillArea,
  chesterHillAreaData,
  chesterHillCoordinates
} from "../../fixtures/chesterHill"

describe("Chester hill", () => {
  it("converts area to coordinates", () => {
    const coordinates = coordinatesFromArea(chesterHillArea)
    expect(coordinates).toEqual(chesterHillCoordinates)
  })

  it("converts coordinates to area data", () => {
    const areaData = areaFromNameAndCoordinates(
      "chester hill",
      chesterHillCoordinates
    )
    expect(areaData).toEqual(chesterHillAreaData)
  })

  it("converts area to region", () => {
    let region = {
      latitude: 46.81204,
      latitudeDelta: 0.0022220000000000005,
      longitude: -92.0957,
      longitudeDelta: 0.001276
    }

    expect(regionFromArea(chesterHillArea)).toEqual(region)
  })

  it("detects a lat/long point inside area", () => {
    let coordinate = {
      latitude: 46.812,
      longitude: -92.096
    }

    expect(isInside(chesterHillArea, coordinate)).toBe(true)
  })

  it("detects a lat/long coordinate outside area", () => {
    let coordinate = {
      latitude: 46.8,
      longitude: -92.1
    }
    expect(isInside(chesterHillArea, coordinate)).toBe(false)
  })
})
