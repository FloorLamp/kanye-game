
export function drawRect(screen, body) {
  screen.fillRect(body.center.x - body.size.x / 2, body.center.y - body.size.y / 2,
                  body.size.x, body.size.y)
}
export function drawSprite(screen, body, image) {

  var sprite = new Image()
  sprite.src = image

  var width = sprite.naturalWidth /3
  var height = sprite.naturalHeight /3

  screen.drawImage(sprite, body.center.x - body.size.x / 2, body.center.y - body.size.y / 2, width, height )

}
