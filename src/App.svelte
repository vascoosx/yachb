<script>
	import { writable, derived } from 'svelte/store'

	let coords = writable({ x: 50, y: 50 });
	let size = writable(10);
	let place = derived(coords,
						$coords => Math.floor(($coords.y - 100) / 50) * 8 + Math.floor(($coords.x - 100) / 50))

	let out_of_board = derived(coords, $coords => ($coords.x < 100 || $coords.x > 500 || $coords.y < 100 || $coords.y > 500))
	let draw = writable({ s: -1, f: -1 })
	const movetype = derived([draw, out_of_board], ([$draw, $out_of_board])  => {
		if ($out_of_board){
			return 'illegal move'
		}
		if ($draw.f == $draw.s) {
			return 'no move'
		} else if ($draw.s % 8 == $draw.f % 8) {
			return 'vertical rook move'
		} else if (Math.floor($draw.s / 8) == Math.floor($draw.f / 8)) {
			return 'horizontal rook move'
		} else if (Math.floor(Math.abs($draw.s - $draw.f)) % 9 == 0 ){
			return 'bishop move'
		} else if (Math.floor(Math.abs($draw.s - $draw.f)) % 7 == 0 ){
			return 'bishop move'
		} else if (Math.abs($draw.s - $draw.f) == 15 || Math.abs($draw.s - $draw.f) == 17) {
			return 'knight move'
		} else if (Math.abs($draw.s - $draw.f) == 10 || Math.abs($draw.s - $draw.f) == 6){
			return 'knight move'
		} else{
			return 'mmmm'
		}
	})

	let columns = [0, 1, 2, 3, 4, 5, 6, 7]
	let rows = [0, 1, 2, 3, 4, 5, 6, 7]
</script>

<style>
	svg { width: 100%; height: 100%; }
</style>
<p>place is: {$place}, start is: {$draw.s}, finish is: {$draw.f}, move type is: {$movetype}</p>
<svg
	on:mousemove="{e => coords.set({ x: e.clientX - 5, y: e.clientY - 60 })}"
	on:mousedown="{() => {size.set(30); $draw.s = $place }}"
	on:mouseup="{() => {size.set(10); $draw.f = $place }}"
>
	
	{#each rows as r}
		{#each columns as c}
			<rect x={100 + r * 50} y={100 + c * 50} width=50 height=50 fill={((r+c)%2==1)?'#0077ff':'#b4d1f3'} />
		{/each}
	{/each}
	<circle cx={$coords.x} cy={$coords.y} r={$size} fill={$out_of_board ? '#ff3e00' : '#003cff'} />
</svg>