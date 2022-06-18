function makeTradeRecipe(options) {
  let { permitType, product, buyPrice, sellPrice } = options;
  if (!permitType || !product || (!buyPrice && !sellPrice)) {
    return `Missing required field! Options obejct must contain 'permitType', 'product', and one or both of 'buyPrice' and 'sellPrice'.\nGiven object contains: { ${Object.keys(options).join(', ')} }.`
  }
  const permitTypes = ['Farming', 'Fishing', 'Mining']
  if (!permitTypes.includes(permitType)) {
    return `Invalid permit type: ${permitType}. Must be one of: ${permitTypes.join(', ')}`
  }
  let result = {
    type: "glue:trade",
    permit: permitType,
    product: Item.of(product),
    buyPrice: (typeof buyPrice == 'number' && buyPrice >= 0) ? buyPrice : -1,
    sellPrice: (typeof sellPrice == 'number' && sellPrice >= 0) ? sellPrice : -1,
  }
  return result
}

const C = n => n
const S = n => n*64
const G = n => n*64*64
const GSC = (g, s, c) => G(g) + S(s) + C(c)

const tradeData = {
  'Farming': [
    { item: 'minecraft:wheat', buy: C(2), sell: C(1) },
  ],
  'Fishing': [
    { item: 'minecraft:salmon', buy: C(24) },
  ],
  "Mining": [
    { item: '2x #minecraft:wool', sell: S(1) },
    { item: '3x minecraft:emerald', buy: G(1)+S(16), sell: G(1) },
    { item: 'minecraft:diamond', buy: GSC(2,3,4), sell: GSC(1,1,1) },
  ]
}

onEvent('recipes', event => {
  for (let k of Object.keys(tradeData)) {
    let permitType = k
    for (let offer of tradeData[k]) {
      let result = makeTradeRecipe({ permitType: permitType, product: offer.item, buyPrice: offer.buy, sellPrice: offer.sell })
      if (typeof result == 'string') {
        // for some reason this is silently ignored if thrown in makeTradeRecipe
        throw result
      }
      else {
        event.custom(result)
      }
    }
  }
})