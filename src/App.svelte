<script>
	import { writable, derived } from 'svelte/store'
	import { onMount } from 'svelte'
	import { fileName } from './Utils.js'
	import { Board } from './Board.js'
	import { Intent } from './Intent.js'
	import { Judge } from './Judge.js'

	let adj_y = 0

	let judge = new Judge()
	let intent = new Intent()
	let board = new Board()
	let board_data = board.pieces
	let ready_to_update_board = false
	let picked_file_name
	let picked_piece

	let coords = writable({ x: 50, y: 50 })
	let place = derived(coords, $coords => Math.floor(($coords.y - 100) / 50) * 8 + Math.floor(($coords.x - 100) / 50))
	let out_of_board = derived(coords, $coords => ($coords.x < 100 || $coords.x > 500 || $coords.y < 100 || $coords.y > 500))

	const handleMouseMove = (e) => {
	    coords.set({ x: e.clientX, y: e.clientY - adj_y })
	}

	const handleMouseDown = () => {
	    if ($out_of_board){
	        return
	    }
	    intent.updateStart($place) 
	    picked_file_name = fileName(board.pieces[intent.start])
	    picked_piece = board.pieces[intent.start]
	}

	const handleMouseUp = () => {
	    if ($out_of_board || picked_piece === '-'){
	        return
	    }
	    intent.updateEnd($place)
	    intent.getGesture()
	    ready_to_update_board = true
	}

	onMount(() => {
	    adj_y = document.getElementById('chess-table').getBoundingClientRect()['y']
	    window.addEventListener('resize', readjustY)
	})

	const readjustY = () => {
	    adj_y = document.getElementById('chess-table').getBoundingClientRect()['y']
	}
	
	$: if (ready_to_update_board) {
	    ready_to_update_board = false

	    judge.pieces = board.pieces

	    judge.castle.K_moved = board.K_moved
	    judge.castle.k_moved = board.k_moved
	    judge.castle.KR_moved = board.KR_moved
	    judge.castle.QR_moved = board.QR_moved
	    judge.castle.kr_moved = board.kr_moved
	    judge.castle.qr_moved = board.qr_moved

	    judge.piece.start = board.pieces[intent.start]
	    judge.piece.end = board.pieces[intent.end]
	    judge.piece.start_id = intent.start
	    judge.piece.end_id = intent.end

	    judge.move.length = intent.gesture.l
	    judge.move.direction = intent.gesture.d
	    judge.move.step = intent.gesture.s
	    judge.move.kind = intent.gesture.c
	    judge.move.type = intent.gesture.t

	    judge.enpassant.square = board.enpassant_square

	    judge.checkMove()
	}

	$: if (judge.ok){
	    judge.ok = false
	    board.swap(intent.start, intent.end)
	    board_data = board.pieces
	    picked_piece = undefined
	} else {
	    picked_piece = undefined
	}

	let debug = true
	let circle_size = 20
	let start_place
	let finish_place
	let move_type
	$: {
	    start_place = judge.piece.start_id
	    finish_place = judge.piece.end_id
	    move_type = judge.move.type
	}
</script>

<style>
	svg { width: 100%; height: 100%; }
</style>

{#if debug}
<div style="width: 500px"  >
  <p>place is: {$place}, start is: {start_place}, finish is: {finish_place}, move type is: {move_type}, piece is {picked_piece}</p>
  <p> adj_y is :{adj_y}</p>
</div>

{/if}
<div style="height: 600px; width: 1000px;">
	<div style="height: 600px; width: 600px; float: left">
	<svg
		on:mousemove="{handleMouseMove}"
		on:mousedown="{handleMouseDown}"
		on:mouseup="{handleMouseUp}"
		id="chess-table"
	>  
		{#each board.rows as r}
			{#each board.columns as c}
			<rect x={80 + r * 50} y={80 + c * 50} width=50 height=50 fill={((r +c ) % 2 == 1)?'#0077ff':'#b4d1f3'} />
			{/each}
		{/each}

		{#each board_data as piece, i}
			{#if piece !== '-' && (i !== intent.start || picked_piece === undefined)}
			<image xlink:href={fileName(piece)} height="40" width="40" x={85 + (i % 8) * 50} y={85 + Math.floor(i / 8) * 50} />
			{/if}
		{/each}

		{#if picked_piece !== undefined && picked_piece !== '-'}
		<image xlink:href={picked_file_name} height="40" width="40" x={$coords.x - 20} y={$coords.y - 20} />	
		{/if}
		{#if debug}
		<circle cx={$coords.x} cy={$coords.y} r={circle_size} fill={$out_of_board ? '#ff3e00' : '#003cff'} fill-opacity="0.3"/>
		{/if}
	</svg>
	</div>
	<div style="float: left">
		<input type="checkbox" bind:checked={debug} /> debug <br>
	</div>
</div>