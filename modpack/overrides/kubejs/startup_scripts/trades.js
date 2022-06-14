global.buy = [];
global.sell = [];
global.exchange = [];

if (!global.log)
  global.log = []

/////////////////////

// constructs item names from parameters
let MOD = (domain) => (id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let MOD_ = (domain, id, x) => MOD(domain)(id, x)

// helper functions for items/blocks from specific mods
let MC = MOD("minecraft")
let F  = MOD("forge")
let KJ = MOD("kubejs")

let CR = MOD("create")
let CR_A = MOD("createaddition")
let TE = MOD("thermal")
let IE = MOD("immersiveengineering")

let money = (denom) => (n) => `${n}x ${denom}`

let C = money(TE("copper_coin"))
let S = money(TE("silver_coin"))
let G = money(TE("gold_coin"))
let b = money(KJ("bill_64g"))
let B = money(KJ("bill_4096g"))

let sanitize = (name) => name.toLowerCase().replace("'","").split(' ').join('_')
let card_id = (prefix) => (name) => KJ(prefix + sanitize(name))
let sell_id = card_id("card_sell_")
let buy_id = card_id("card_buy_")
let trade_id = card_id("card_trade_")

/////////////////////

onEvent('item.registry', event => {
	// cash rules everything around me cream get money dolla dolla billz yall
  event.create('bill_64g').displayName('64G Bill')
  event.create('bill_4096g').displayName('4096G Bill')

  let salesPermit = (name, transactions) => {
    event.create(sell_id(name)).displayName("Sales Permit - "+name)
    let safeName = sanitize(name)

    global.sell.push({
      name: name,
      safeName: safeName,
      card_id: sell_id(safeName),
      transactions: transactions
    })
  }

  salesPermit("Farming", [
    { in: MC("wheat"), out: C(1) },
    { in: MC("#wool"), out: C(4) },
    { in: MC("sweet_berries"), out: C(8) },
    // { in: MC("wheat", 64), out: S(1) },
    // { in: MC("#wool", 16), out: S(1) },
  ])

  // event.create('card_buy').displayName('Order Form')
  // event.create('card_exchange').displayName('Exchange Form')
})

onEvent('block.registry', event => {
	// Register new blocks here
	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
})
