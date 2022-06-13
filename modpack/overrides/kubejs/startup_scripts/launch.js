// priority: 0

console.info('Hello, World! (You will only see this line once in console, during startup)')

let MOD = (domain) => (id, x) => (x ? `${x}x ` : "") + (id.startsWith('#') ? '#' : "") + domain + ":" + id.replace('#', '')
let MC = MOD("minecraft")
let IE = MOD("immersiveengineering")

onEvent('item.registry', event => {
	// Register new items here
	// event.create('example_item').displayName('Example Item')
})

onEvent('block.registry', event => {
	// Register new blocks here
	// event.create('example_block').material('wood').hardness(1.0).displayName('Example Block')
})
