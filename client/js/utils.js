export function isColliding(e1, e2) {
  return e1.center.x + e1.size.x / 2 >= e2.center.x - e2.size.x / 2 &&
         e1.center.x - e1.size.x / 2 <= e2.center.x + e2.size.x / 2 &&
         e1.center.y + e1.size.y / 2 >= e2.center.y - e2.size.y / 2 &&
         e1.center.y - e1.size.y / 2 <= e2.center.y + e2.size.y / 2
}

export function getDistance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}
