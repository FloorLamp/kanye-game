export function isColliding(e1, e2) {
  let e1HalfWidth = e1.size.x !== undefined ? e1.size.x / 2 : e1.size.r
  let e1HalfHeight = e1.size.y !== undefined ? e1.size.y / 2 : e1.size.r
  let e2HalfWidth = e2.size.x !== undefined ? e2.size.x / 2 : e2.size.r
  let e2HalfHeight = e2.size.y !== undefined ? e2.size.y / 2 : e2.size.r

  return e1.center.x + e1HalfWidth >= e2.center.x - e2HalfWidth &&
         e1.center.x - e1HalfWidth <= e2.center.x + e2HalfWidth &&
         e1.center.y + e1HalfHeight >= e2.center.y - e2HalfHeight &&
         e1.center.y - e1HalfHeight <= e2.center.y + e2HalfHeight
}

export function getDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

export function getScaledVector(source, dest, scale) {
  if (scale === undefined) scale = 1

  let x = dest.x - source.x
  let y = dest.y - source.y
  let hypotenuse = getDistance(source, dest)

  if (hypotenuse === 0)
    return {
      x: 0,
      y: 0,
    }

  return {
    x: x / hypotenuse * scale,
    y: y / hypotenuse * scale,
  }
}

export function getDestinationOfVector(source, vector, distance) {
  return {
    x: source.x + vector.x * distance,
    y: source.y + vector.y * distance,
  }
}

export function getRandomVector(scale) {
  if (scale === undefined) scale = 1

  let x = Math.random() - .5
  let y = Math.random() - .5
  let hypotenuse = getDistance({x: 0, y: 0}, {x, y})

  if (hypotenuse === 0)
    return {
      x: 0,
      y: 0,
    }

  return {
    x: x / hypotenuse * scale,
    y: y / hypotenuse * scale,
  }
}

// returns point that intersects the vector from the center of the rect (defined by w, h), and its normal (which intersects the edge of the rect)
export function getBoundsPoint(w, h, v) {
  let cx = 0
  let cy = 0
  if (v.y < 0) cy = h
  if (v.x < 0) cx = w

  let p = (cx * v.y - (w / 2 * v.y) - cy * v.x + h / 2 * v.x) / (v.x * v.x + v.y * v.y)
  let x = cx - p * v.y
  let y = cy + p * v.x
  return {x, y}
}

// returns true if number is inside bounds
export function isInside(x, start, end) {
  return (x >= start && x <= end) || (x <= start && x >= end)
}
