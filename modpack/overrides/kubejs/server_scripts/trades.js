// priority: 0

if(!global.log)
	global.log = []

// shamelessly copying this idea from create ab

let trade = (card_id, ingredient, output) => {
  return {
    type: 'thermal:press',
    ingredients: [
      Ingredient.of(ingredient).toJson(),
      Ingredient.of(card_id).toJson()
    ],
    result: [
      Item.of(output).toResultJson()
    ],
    energy: 1
  }
}

onEvent('item.tags', event => {
  event.get("thermal:crafting/dies").add(/kubejs:card_*/)
})

onEvent('recipes', event => {
  global.sell.forEach(permit => {
    let card_id = permit.card_id
    permit.transactions.forEach(transaction => {
      global.log.push(`${card_id}: ${transaction.in} -> ${transaction.out}`)
      let out_genuine = Item.of(transaction.out, {Genuine: 1})
      event.custom(trade(card_id, transaction.in, out_genuine))
    })
  })
})
