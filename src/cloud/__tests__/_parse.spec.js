import { areaFromParse, parseAreaFromNameAndCoordinates } from "../parse"
import Parse from "parse"
import {
  chesterHillAreaData,
  chesterHillCoordinates
} from "../../fixtures/chesterHill"

describe("creating a Parse area", () => {
  test("without an id succeeds", () => {
    const parseArea = parseAreaFromNameAndCoordinates(
      null,
      "chester hill",
      chesterHillCoordinates
    )
    const areaData = areaFromParse(parseArea)
    expect(areaData).toEqual(chesterHillAreaData)
  })

  test("encodes centroid as a GeoPoint", () => {
    const parseArea = parseAreaFromNameAndCoordinates(
      null,
      "chester hill",
      chesterHillCoordinates
    )
    expect(parseArea.get("centroid")).toEqual(
      new Parse.GeoPoint({
        latitude: 46.81204,
        longitude: -92.0957
      })
    )
  })

  test("when coordinates.length < 3 returns null", () => {
    const parseArea = parseAreaFromNameAndCoordinates(null, "chester hill", [
      { x: 24, y: 202 },
      { x: 89, y: 197 }
    ])
    expect(parseArea).toBeNull()
  })

  test("with an id succeeds", () => {
    const id = "1234abcd"
    const parseArea = parseAreaFromNameAndCoordinates(
      id,
      "chester hill",
      chesterHillCoordinates
    )
    const areaData = areaFromParse(parseArea)
    expect(areaData).toEqual({ id, ...chesterHillAreaData })
  })
})
