// @flow
import type { Area, AreaData, Coordinate, Point, Region } from "../types"

type IndexesAndScale = {
  index: number,
  reference: number,
  scale: number
}

type PositionAndScale = {
  position: number,
  reference: number,
  scale: number
}

type PointsAndScale = {
  point: Point,
  zeroPoint: Point,
  scale: number
}

const maxMinPosRatio = 100000.0
const minLatLonIndex = 5
// const maxLatLonIndex = 255
const defaultScale = 16

// Convert index to lat/long int position
const indexToPosition = (params: IndexesAndScale): number => {
  const { index, reference, scale } = params
  return ((index * scale) >> 4) + reference
}

// Convert lat/long int position to index
const positionToIndex = (params: PositionAndScale): number => {
  const { position, reference, scale } = params
  return ((position - reference) << 4) / scale
}

// Convert indexed point to mappable coordinate
const coordinateFromPoint = (params: PointsAndScale): Coordinate => {
  const { point, zeroPoint, scale } = params
  const x = indexToPosition({
    index: point.x,
    reference: zeroPoint.x,
    scale: scale
  })
  const y = indexToPosition({
    index: point.y,
    reference: zeroPoint.y,
    scale: scale
  })

  return {
    latitude: y / maxMinPosRatio,
    longitude: x / maxMinPosRatio
  }
}

const coordinatesFromArea = (area: ?Area): Coordinate[] => {
  if (area == null) {
    return []
  }

  const { minPos, scale, points } = area
  return points.map(point => {
    return coordinateFromPoint({ point, scale, zeroPoint: minPos })
  })
}

type MinMax = {
  min: number,
  max: number
}

const calculateDelta = (extent: MinMax): number => {
  const paddingFactor = 1.1
  const delta = Math.abs(extent.max - extent.min) / maxMinPosRatio
  return delta * paddingFactor
}
const latitudeDelta = (area: Area): number => {
  return calculateDelta({ max: area.maxPos.y, min: area.minPos.y })
}

const longitudeDelta = (area: Area): number => {
  return calculateDelta({ max: area.maxPos.x, min: area.minPos.x })
}

const regionFromArea = (area: Area): Region => {
  return {
    latitude: area.centroid.latitude,
    longitude: area.centroid.longitude,
    latitudeDelta: latitudeDelta(area),
    longitudeDelta: longitudeDelta(area)
  }
}

// 32767 is a canned number which happens to correspond to the storage allocated per boundary in firmware
const maxStorageSize = 32767

type MinMaxCoordinates = {
  min: Coordinate,
  max: Coordinate
}

// Find min and max coordinates as integers, given coordinates as decimals
const minMaxCoordinates = (coordinates: Coordinate[]): MinMaxCoordinates => {
  const { min, max } = coordinates.reduce(
    ({ min, max }, coord): MinMaxCoordinates => ({
      min: {
        latitude: Math.min(min.latitude, coord.latitude),
        longitude: Math.min(min.longitude, coord.longitude)
      },
      max: {
        latitude: Math.max(max.latitude, coord.latitude),
        longitude: Math.max(max.longitude, coord.longitude)
      }
    }),
    {
      min: {
        latitude: Number.MAX_SAFE_INTEGER,
        longitude: Number.MAX_SAFE_INTEGER
      },
      max: {
        latitude: Number.MIN_SAFE_INTEGER,
        longitude: Number.MIN_SAFE_INTEGER
      }
    }
  )

  return {
    min: integerFromDecimal(min),
    max: integerFromDecimal(max)
  }
}

const isInside = (area: Area, coordinate: Coordinate): boolean => {
  let { latitude, longitude } = integerFromDecimal(coordinate)
  return (
    latitude > area.minPos.y &&
    latitude < area.maxPos.y &&
    longitude > area.minPos.x &&
    longitude < area.maxPos.x
  )
}

const integerFromDecimal = (decimal: Coordinate): Coordinate => {
  return {
    latitude: decimal.latitude * maxMinPosRatio,
    longitude: decimal.longitude * maxMinPosRatio
  }
}

type IdParams = { min: Point, points: Point[], scale: number }
const generateIdentifier = ({ min, points, scale }: IdParams): number => {
  return [min, { x: 0, y: scale }, ...points].reduce((hash, { x, y }) => {
    const encodedPoint = (x << 16) | y
    return (encodedPoint + (hash << 6) + (hash << 16) - hash) >>> 0
  }, 0)
}

const areaFromNameAndCoordinates = (
  name: string,
  coordinates: Coordinate[]
): ?AreaData => {
  if (coordinates.length < 3) {
    return null
  }

  const mapFactor = maxStorageSize >> 4

  const { min, max }: MinMaxCoordinates = minMaxCoordinates(coordinates)

  // Check to see if we are below the minimum limits
  const geoWidth = Math.abs(max.longitude - min.longitude)
  const geoHeight = Math.abs(max.latitude - min.latitude)
  if (geoWidth <= minLatLonIndex || geoHeight <= minLatLonIndex) {
    // todo: corrupted position data
  }

  // Check to see if we are above the max integer limits
  const willOverflow =
    Math.max(geoWidth + 1, geoHeight) > Math.sqrt(Number.MAX_SAFE_INTEGER)
  if (willOverflow) {
    // todo: error for area too large
  }

  // Calculate the number of bytes that could be used for the boundary @ 2bpp
  const prescale = (((geoWidth + 1) * geoHeight + geoWidth) >> 2) + 1

  // Check to see if we are over the maximum limit
  if (prescale < geoWidth + geoHeight || prescale > mapFactor * 0xffff) {
    // todo: error for area too large
  }

  // make sure we capture the outliers
  // make sure it's not less than 1:1
  const scale = Math.max(defaultScale, Math.floor(prescale / mapFactor) + 1)

  // set the max indexes
  const maxIdx = {
    x: positionToIndex({
      position: max.longitude,
      reference: min.longitude,
      scale
    }),
    y: positionToIndex({
      position: max.latitude,
      reference: min.latitude,
      scale
    })
  }

  if (maxIdx.x > 0x0000ffff || maxIdx.y > 0x0000ffff) {
    // todo: error for data processing error
  } else if (maxIdx.x < minLatLonIndex || maxIdx.y < minLatLonIndex) {
    // todo: error for bad geometry
  }

  const centroid = {
    latitude:
      (min.latitude + Math.abs(max.latitude - min.latitude) / 2) /
      maxMinPosRatio,
    longitude:
      (min.longitude + Math.abs(max.longitude - min.longitude) / 2) /
      maxMinPosRatio
  }

  const minPos = {
    x: min.longitude,
    y: min.latitude
  }
  const maxPos = {
    x: max.longitude,
    y: max.latitude
  }

  const points = coordinates
    .map(integerFromDecimal)
    .map((c: Coordinate): Point => ({
      x: positionToIndex({
        position: c.longitude,
        reference: min.longitude,
        scale
      }),
      y: positionToIndex({
        position: c.latitude,
        reference: min.latitude,
        scale
      })
    }))

  const identifier = generateIdentifier({ min: minPos, points, scale })

  return {
    centroid,
    identifier,
    minPos,
    maxIdx,
    maxPos,
    name,
    points,
    ptCnt: points.length,
    scale
  }
}

export {
  areaFromNameAndCoordinates,
  coordinatesFromArea,
  isInside,
  regionFromArea
}
