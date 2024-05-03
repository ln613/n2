export const updateSex = sex =>
  sex.slice(0, 1).toUpperCase()

export const updatePlayerSex = player =>
  player.sex = updateSex(player.sex)

export const updatePlayersSex = players =>
  players.forEach(updatePlayerSex)
