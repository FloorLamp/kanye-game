
export function drawRect(screen, body) {
  if (body.drawColor && body.drawColor != 'black') screen.fillStyle = body.drawColor
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y)
  screen.fillStyle = 'black'
}

export function drawCircle(screen, body) {
  screen.beginPath()
  screen.arc(body.center.x, body.center.y, body.size.r, 0, 2 * Math.PI)
  screen.fill()
}

export function drawSprite(screen, center, image, scale) {
  if (!scale) scale = 1
  let sprite = new Image()
  sprite.src = image

  let width = sprite.naturalWidth / scale
  let height = sprite.naturalHeight / scale

  screen.drawImage(sprite, center.x - width / 2, center.y - height / 2, width, height)
}
