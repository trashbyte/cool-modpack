
var log = []

/////////////////////

onEvent('player.chat', function (event) {
	// Check if message equals creeper, ignoring case

	if (event.message.startsWith('!clear')) {
		event.player.tell('Log cleared')
		log = []
		event.cancel()
	}

	if (event.message.startsWith('!status')) {
		if (log.length == 0) {
			event.player.tell('Log empty')
			event.cancel()
			return
		}

		event.player.tell('Log Start >')
		log.forEach(s => event.player.tell(s))
		event.player.tell('<')
		event.cancel()
	}
})

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

  modifyIE(event)
  modifyTE(event)
  unify(event)

  pressingRecipes(event)

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

// neuter Immersive Engineering
// by removing a bunch of recipes and stuff
function modifyIE(event) {
  // goodbye manual we will replace you later
  event.remove({ output: IE("manual") })

  // at some point we gotta figure out how to use the NBT multiblock permission
  // stuff to restrict what multiblocks can be built by hammers
  event.replaceOutput({}, IE("hammer"), Item.of(IE("hammer"), {
    multiblockPermission: [IE("multiblocks/coke_oven")]
  }))

  // remove all arc furnace
  event.remove({ type: IE("arc_furnace") })
  // so it turns out the recycling recipes can be turned off by a recipe json
  // so ive tried adding that, data/immersiveengineering/recipes/arc_recycling_list.json
  // hopefully it works!!!!

  // remove metal press recipes
  event.remove({ type: IE("metal_press") })
}

// modify Thermal Series
function modifyTE(event) {
  // goodbye multiservo press you will gain a higher purpose later
  event.remove({ type: TE("press") })
}

// canonical metal items
// these are used in a couple spots
let metals = {
  iron: {
    dusts: TE('iron_dust'),
    plates: CR('iron_sheet'),
    rods: CR_A('iron_rod')
  },
  copper: {
    dusts: TE('copper_dust'),
    plates: CR('copper_sheet')
  },
  gold: {
    dusts: TE('gold_dust'),
    plates: CR('golden_sheet')
  },
  silver: {
    raw_materials: TE('raw_silver'),
    ingots: TE('silver_ingot'),
    nuggets: TE('silver_nugget'),
    dusts: TE('silver_dust'),
    plates: TE('silver_plate')
  },
  lead: {
    raw_materials: TE('raw_lead'),
    ingots: TE('lead_ingot'),
    nuggets: TE('lead_nugget'),
    dusts: TE('lead_dust'),
    plates: TE('lead_plate')
  },
  nickel: {
    raw_materials: TE('raw_nickel'),
    ingots: TE('nickel_ingot'),
    nuggets: TE('nickel_nugget'),
    dusts: TE('nickel_dust'),
    plates: TE('nickel_plate')
  },

  electrum: {
    ingots: TE('electrum_ingot'),
    nuggets: TE('electrum_nugget'),
    dusts: TE('electrum_dust'),
    plates: TE('electrum_plate')
  },
  steel: {
    ingots: TE('steel_ingot'),
    nuggets: TE('steel_nugget'),
    dusts: TE('steel_dust'),
    plate: TE('steel_plate')
  },
  constantan: {
    ingots: TE('constantan_ingot'),
    nuggets: TE('constantan_nugget'),
    dusts: TE('constantan_dust'),
    plates: TE('constantan_plate')
  },

  aluminum: {},
  invar: {},
  signalum: {},
  lumium: {},
  enderium: {}
}

// deduplicate and unify metals
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

  event.remove({type: "minecraft:crafting_shaped", output: F('#rods/all_metal')})

  for (let metalName in metals) {
    dedupMetal(metalName, metals[metalName])
  }
}

// make create press recipes for things formerly done by IE and TE presses
// also IE hammering i guess
function pressingRecipes(event) {
  // okay so

  // remove default metal pressing recipes, for cleanliness
  event.remove({ id: /create:pressing\/(?!sugar_cane)/ })
  event.remove({ id: /immersiveengineering:crafting\/plate_[a-z]+_hammering/ })

  let platePairs = [];

  for (let metalName in metals) {
    let metal = metals[metalName];
    let plate = metal.plates ? metal.plates : Item.of(F(`#plates/${metalName}`));
    let ingot = F(`#ingots/${metalName}`);

    // - plates can be create pressed and IE hammered
    log.push(`${metalName}: ${plate} <= ${ingot}`)
    event.recipes.createPressing(
      [plate], ingot
    ).id("kubejs:press_plate_"+metalName)
    event.shapeless(
      plate, [ingot, IE("hammer")]
    ).damageIngredient(IE("hammer")).id(`kubejs:plate_${metalName}_hammering`)
  }
    // - wires and rods can already be rolled
    // so then what's left is
    // - gears
    // - coins

		// use event.forEachRecipe to get the gear and coin recipes
}
