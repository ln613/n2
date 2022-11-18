const updateSex = sex =>
  sex.slice(0, 1).toUpperCase()

const updatePlayerSex = player =>
  player.sex = updateSex(player.sex)

const updatePlayersSex = players =>
  players.forEach(updatePlayerSex)

module.exports = {
  updateSex,
  updatePlayerSex,
  updatePlayersSex
}
