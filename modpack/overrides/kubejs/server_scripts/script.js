// priority: 0

settings.logAddedRecipes = true
settings.logRemovedRecipes = true
settings.logSkippedRecipes = false
settings.logErroringRecipes = true

function giveStartingItems(player) {
  [
    'minecraft:redstone',
    'minecraft:red_bed'
  ].forEach(item => {
    console.info(item);
    player.give(item);
  })
}

console.info('Hello, World! (You will see this line every time server resources reload)')



// Listen to player login event
onEvent('player.logged_in', event => {
  // Check if player doesn't have "starting_items" stage yet
  if (!event.player.stages.has('starting_items')) {
    // Add the stage
    event.player.stages.add('starting_items')
    // Give some items to player
    giveStartingItems(event.player);
  }
})
