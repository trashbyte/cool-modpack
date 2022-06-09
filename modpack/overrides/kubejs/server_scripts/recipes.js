
// constructs item names from parameters
let MOD = (domain) => (id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let MOD_ = (domain, id, x) => MOD(domain)(id, x)

// helper functions for items/blocks from specific mods
let MC = MOD("minecraft")
let F  = MOD("forge")
let KJ = MOD("kubejs")

let CR = MOD("create")
let TE = MOD("thermal")
let IE = MOD("immersiveengineering")

function infiniDeploying(output, input, tool) {
	return {
		"type": "create:deploying",
		"ingredients": [
			Ingredient.of(input).toJson(),
			Ingredient.of(tool).toJson()
		],
		"results": [
			Item.of(output).toResultJson()
		],
		"keepHeldItem": true
	}
}

// we don't like immersive engineering,
// and the multiservo press is gonna turn into a trade station,
// so we have to get creative with press recipes that involve dies/molds
function createDiePress(params) {
  let t = Item.of(params.transitional).toJson()
  let d = Item.of(params.die).toJson()
  return {
    "type": "create:sequenced_assembly",
    "ingredient": Item.of(params.input).toJson(),
    "transitionalItem": t,
    "sequence": [
      {
        "type": "create:deploying",
        "ingredients": [t, d],
        "results": [t],
        "keepHeldItem": true
      },
      {
        "type": "create:pressing",
        "ingredients": [t],
        "results": [t]
      }
    ],
    "results": params.outputs.map(i => Item.of(i).toJson()),
    "loops": 1
  }
}

onEvent('recipes', event => {
	// Change recipes here

  unify(event)

  // example create die press recipe
  event.custom(createDiePress({
    outputs: ["minecraft:carrot"],
    input: Item.of("minecraft:apple"),
    transitional: "minecraft:wheat_seeds",
    die: "minecraft:cobblestone"
  }))
})

onEvent('item.tags', event => {
	// Get the #forge:cobblestone tag collection and add Diamond Ore to it
	// event.get('forge:cobblestone').add('minecraft:diamond_ore')

	// Get the #forge:cobblestone tag collection and remove Mossy Cobblestone from it
	// event.get('forge:cobblestone').remove('minecraft:mossy_cobblestone')
})

//////////////// recipe functions


// deduplicate and unify
function unify(event) {
  // helper function that replaces output and input
  let deduplicate = (fromThis, toThis) => {
    event.replaceOutput({}, fromThis, toThis);
    event.replaceInput({},  fromThis, toThis);
  }

  let dedupMetal = (metal, replacements) => {
    for (let tag in replacements) {
      deduplicate(F('#' + tag + '/' + metal), replacements[tag]);
    }
  }

  deduplicate(IE("slag"), TE("slag"))

  event.remove({id: "minecraft:crafting_shaped", output: F('#rods/iron')})

  dedupMetal("iron", {
    dusts: TE('iron_dust'),
    plates: CR('iron_sheet'),
    rods: IE('stick_iron')
  })
  dedupMetal("copper", {
    dusts: TE('copper_dust'),
    plates: CR('golden_sheet')
  })
  dedupMetal("gold", {
    dusts: TE('gold_dust'),
    plates: CR('golden_sheet')
  })
  dedupMetal("silver", {
    raw_materials: TE('raw_silver'),
    ingots: TE('silver_ingot'),
    nuggets: TE('silver_nugget'),
    dusts: TE('silver_dust'),
    plates: TE('silver_plate')
  })
  dedupMetal("lead", {
    raw_materials: TE('raw_lead'),
    ingots: TE('lead_ingot'),
    nuggets: TE('lead_nugget'),
    dusts: TE('lead_dust'),
    plates: TE('lead_plate')
  })
  dedupMetal("nickel", {
    raw_materials: TE('raw_nickel'),
    ingots: TE('nickel_ingot'),
    nuggets: TE('nickel_nugget'),
    dusts: TE('nickel_dust'),
    plates: TE('nickel_plate')
  })
  dedupMetal("electrum", {
    ingots: TE('electrum_ingot'),
    nuggets: TE('electrum_nugget'),
    dusts: TE('electrum_dust'),
    plates: TE('electrum_plate')
  })
  dedupMetal("steel", {
    ingots: TE('steel_ingot'),
    nuggets: TE('steel_nugget'),
    dusts: TE('steel_dust'),
    plate: TE('steel_plate')
  })
  dedupMetal("constantan", {
    ingots: TE('constantan_ingot'),
    nuggets: TE('constantan_nugget'),
    dusts: TE('constantan_dust'),
    plate: TE('constantan_plate')
  })
}
