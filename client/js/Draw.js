
export function drawRect(screen, body) {
  if (body.drawColor && body.drawColor != 'black') screen.fillStyle = body.drawColor
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y)
}
export function drawSprite(screen, body, image, scale) {

  var sprite = new Image()
  sprite.src = image

  var width = sprite.naturalWidth / scale
  var height = sprite.naturalHeight / scale

  screen.drawImage(sprite, body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, width, height )
}
