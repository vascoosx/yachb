<script>
	import { writable, derived } from 'svelte/store'
	import { pieces } from './Board.js'

	let coords = writable({ x: 50, y: 50 })
	let size = 20
	let place = derived(coords,
						$coords => Math.floor(($coords.y - 100) / 50) * 8 + Math.floor(($coords.x - 100) / 50))

	let out_of_board = derived(coords, $coords => ($coords.x < 100 || $coords.x > 500 || $coords.y < 100 || $coords.y > 500))
	let draw = writable({ s: -1, f: -1 })
	let m_is_down = writable(false)

	function castlingPossible(sp, fp) {
		if (sp === 4 && fp === 6) {
			return !$pieces.K_moved && !$pieces.KR_moved
		} else if (sp === 4 && fp === 2) {
			return !$pieces.K_moved && !$pieces.QR_moved	
		} else if (sp === 60 && fp === 62) {
			return !$pieces.k_moved && !$pieces.kr_moved
		} else if (sp === 60 && fp === 58) {
			return !$pieces.k_moved && !$pieces.qr_moved
		} else {
			return false
		}
	}
	const move = derived([draw, out_of_board], ([$draw, $out_of_board])  => {
		if ($out_of_board){
			return { t: 'out of board' }
		}
		let dir = $draw.f > $draw.s ? 1 : -1
		if ($draw.f == $draw.s) {
			return { t: 'no move'}
		} else if ($draw.s % 8 == $draw.f % 8) {
			return { t: 'vertical rook', l: Math.floor(Math.abs($draw.s - $draw.f) / 8), d: dir, s: 8, c: 'rook' }
		} else if (Math.floor($draw.s / 8) == Math.floor($draw.f / 8)) {
			return { t: 'horizontal rook', l: Math.abs($draw.s - $draw.f), d: dir, s: 1, c: 'rook' }
		} else if (Math.abs(Math.floor($draw.s / 8) - Math.floor($draw.f / 8)) === Math.abs($draw.s % 8 - $draw.f % 8)){
			let step = Math.abs($draw.s - $draw.f)
			return { t: 'bishop move', l: Math.floor(Math.abs($draw.s - $draw.f) / step), d: dir, s: step, c: 'bishop' }
		} else if (Math.abs($draw.s - $draw.f) == 15 || Math.abs($draw.s - $draw.f) == 17) {
			return { t: 'knight move'}
		} else if (Math.abs($draw.s - $draw.f) == 10 || Math.abs($draw.s - $draw.f) == 6){
			return { t: 'knight move'}
		} else{
			return { t: 'illegal move' }
		}
	})

	let columns = [0, 1, 2, 3, 4, 5, 6, 7]
	let rows = [0, 1, 2, 3, 4, 5, 6, 7]


	function isWhite(p){
		return p.charCodeAt(0) > 97 
	}

	function isBlack(p){
		return p.charCodeAt(0) < 90 
	}

	function sameColor(p1, p2){
		return (isWhite(p1) && isWhite(p2)) || (isBlack(p1) && isBlack(p2))
	}

	function PathClear(board, direction, step, length, start_position){
		for (let i=1; i < length; i+=1){
			if (board[start_position + (i * step * direction)] !== '-'){
				return false
			}
		}
		return true
	}

	function isInitialPawn(pawn, pos){
		if (pawn === 'P'){
			return pos >= 8 && pos <= 15
		} else if (pawn === 'p') {
			return pos >= 48 && pos <= 55
		} else{
			return false
		}
	}

	function backwardMove(piece, direction){
		if ((isBlack(piece) && direction > 0) || (isWhite(piece) && direction < 0)) {
			return false
		} else{
			return true
		}
	}

	function enpassable(piece){
		return false
	}

	function isUpdatable() {
		if ($move.t === 'no move' || $move.t === 'illegal move' || $move.t === 'out of board') return false

		let sp = $pieces.board[$draw.s]
		if (sp === '-') return false

		let fp = $pieces.board[$draw.f]
		if (sp === undefined || fp === undefined) return false

		if (fp !== '-' && sameColor(sp, fp)) return false

		if (sp === 'P' || sp === 'p'){
			if (backwardMove(sp, $move.d)) return false
			if (fp !== '-' && $move.c !== 'bishop') return false
			if (fp === '-' && $move.c === 'bishop' && !enpassable(sp)) return false
			if (fp === '-' && $move.t !== 'vertical rook') return false
			if ($move.l === 2 && !isInitialPawn(sp, $draw.s)) return false
			if ($move.l > 2) return false
		}

		if (sp === 'R' || sp === 'r') {
			if ($move.c !== 'rook') return false
		}

		if (sp === 'B' || sp === 'b') {
			if ($move.c !== 'bishop') return false

		}

		if (sp === 'Q' || sp === 'q') {
			if ($move.t === 'knight move') return false
		}

		if (sp === 'K' || sp === 'k') {
			if ($move.t === 'knight move') return false
			if ($move.l > 2) return false
			if ($move.l === 2 && !castlingPossible($draw.s, $draw.f)) return false
			if ($move.l === 2 && castlingPossible($draw.s, $draw.f) && $move.t !== 'horizontal rook') return false
		}
		if (sp === 'N' || sp === 'n'){
			return $move.t === 'knight move'
		} else {
			return PathClear($pieces.board, $move.d, $move.s, $move.l, $draw.s)
		}
	}

	function updatePieces() {
		if (isUpdatable()){
		  pieces.swap($draw.s, $draw.f)
		} 
	}
	
	function getPieceName(p) {
		let table = {
			p: 'pawn',
			r: 'rook',
			b: 'bishop',
			n: 'knight',
			q: 'queen',
			k: 'king'
		}
		return table[p.toLowerCase()]
	}
	function fileName(piece) {
		if (piece == undefined){
			return undefined
		}
		let color = isBlack(piece) ? 'b' : 'w'
		let piece_name = getPieceName(piece)
		return `${piece_name}_${color}.svg`
	}
	let picked_piece
	let picked_loc
	let picked_file_name
	let picked_place

	$: picked_piece = ($m_is_down && !$out_of_board) ? $pieces.board[$draw.s] : undefined
	$: picked_loc = $draw.s
	$: picked_file_name = fileName($pieces.board[$draw.s])
	$: picked_place = ($m_is_down && !$out_of_board) ? $place : undefined

</script>

<style>
	svg { width: 100%; height: 100%; }
</style>

<div style="position: absolute;" >
  <p>place is: {$place}, start is: {$draw.s}, finish is: {$draw.f}, move type is: {$move.t}, piece is {picked_piece}</p>
</div>


<svg
	on:mousemove="{e => coords.set({ x: e.clientX, y: e.clientY })}"
	on:mousedown="{() => { $draw.s = $place; $m_is_down = true }}"
	on:mouseup="{() => { $draw.f = $place; updatePieces(); $m_is_down = false }}"
>  
	{#each rows as r}
		{#each columns as c}
		<rect x={80 + r * 50} y={80 + c * 50} width=50 height=50 fill={((r +c ) % 2 == 1)?'#0077ff':'#b4d1f3'} />
		{/each}
	{/each}

	{#each $pieces.board as piece, i}
		{#if piece !== '-' && (i !== picked_loc || picked_piece === undefined)}
		<image xlink:href={fileName(piece)} height="40" width="40" x={85 + (i % 8) * 50} y={85 + Math.floor(i / 8) * 50} />
		{/if}
	{/each}
	{#if picked_piece !== undefined && picked_piece !== '-'}
	<image xlink:href={picked_file_name} height="40" width="40" x={$coords.x - 20} y={$coords.y - 20} />	
	{/if}
	<circle cx={$coords.x} cy={$coords.y} r={size} fill={$out_of_board ? '#ff3e00' : '#003cff'} fill-opacity="0.3"/>
</svg>
