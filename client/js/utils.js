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

export function getRandomVector(scale) {
  if (scale === undefined) scale = 1

  let x = Math.random() - 1
  let y = Math.random() - 1
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
