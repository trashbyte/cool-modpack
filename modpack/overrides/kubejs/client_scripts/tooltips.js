// priority: 0

if (!global.log)
  global.log = []

onEvent('item.tooltip', tooltip => {
  // ...
  tooltip.addAdvanced(/thermal:[a-z_]+_coin/, (item, advanced, text) => {
    let nbt = item.getNbt()
    if (nbt && nbt.Counterfeit)
      text.add(1, Text.of("Counterfeit").gray())
  })
})
