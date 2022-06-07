onEvent('recipes', event => {
	const item_sets = [
		[ 'minecraft:dirt', 'minecraft:coarse_dirt' ],

		// copper oxidization variants
		[ 'minecraft:copper_block', 'minecraft:exposed_copper', 'minecraft:weathered_copper', 'oxidized_copper' ],

		// base metal blocks
		[ 'thermal:nickel_block', 'immersiveengineering:storage_nickel' ],
		[ 'thermal:raw_nickel_block', 'immersiveengineering:raw_block_nickel' ],
		[ 'thermal:lead_block', 'immersiveengineering:storage_lead' ],
		[ 'thermal:raw_lead_block', 'immersiveengineering:raw_block_lead' ],
		[ 'thermal:silver_block', 'immersiveengineering:storage_silver' ],
		[ 'thermal:raw_silver_block', 'immersiveengineering:raw_block_silver' ],

		// alloy blocks
		[ 'thermal:steel_block', 'immersiveengineering:storage_steel' ],
		[ 'thermal:electrum_block', 'immersiveengineering:storage_electrum' ],
		[ 'thermal:constantan_block', 'immersiveengineering:storage_constantan' ],
	]

	for (let iset of item_sets) {
		for (let current of iset) {
			for (let other of iset.filter(i => i !== current)) {
				event.custom({
					type: 'glue:transmutator',
					ingredient: { item: current },
					result: other,
					count: 1
				})
			}
		}
	}
})