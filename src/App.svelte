<script>
    import Piece, {goBack, dropPiece} from './Piece.svelte'
    import BoardSvg from './BoardSvg.svelte'
    import {Board} from './Board.js'
    import {Intent} from './Intent.js'
    import {Judge} from './Judge.js'
    import {fileName} from './Utils.js'

    let judge = new Judge()
    let intent = new Intent()
    let board = new Board()
    let board_data = board.pieces
    let ready_to_update_board = false

    const picked = (e) => {
        intent.updateStart(parseInt(e.explicitOriginalTarget.id))
    }

    const dropped = (e) => {
        intent.updateEnd(parseInt(e.explicitOriginalTarget.id))
        intent.getGesture()
        dropPiece()
        ready_to_update_board = true
    }

    $: if (ready_to_update_board) {
        ready_to_update_board = false

        judge.pieces = board.pieces

        judge.castle.K_moved = board.K_moved
        judge.castle.k_moved = board.k_moved
        judge.castle.KR_moved = board.KR_moved
        judge.castle.QR_moved = board.QR_moved
        ready_to_update_board = false

        judge.pieces = board.pieces

        judge.castle.K_moved = board.K_moved
        judge.castle.k_moved = board.k_moved
        judge.castle.KR_moved = board.KR_moved
        judge.castle.QR_moved = board.QR_moved
        judge.castle.kr_moved = board.kr_moved
        judge.castle.qr_moved = board.qr_moved

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

    $: if (judge.ok === true){
        judge.ok = false
        board.swap(intent.start, intent.end)
        board_data = board.pieces
    } else {
        goBack()
    }
</script>

<h1>Let's play</h1>
<BoardSvg on:drop={dropped}>
{#each board.rows as r}
    {#each board.columns as c}
    <rect id={c + r * 8} y={80 + r * 50} x={80 + c * 50} width=50 height=50 fill={((r + c ) % 2 == 1)?'#0077ff':'#b4d1f3'} />
    {/each}
{/each}
{#each board_data as piece, i}
    {#if piece !== '-'}
    <Piece pid={i} url={fileName(piece)} height="40" width="40" x={85 + (i % 8) * 50} y={85 + Math.floor(i / 8) * 50} on:pick={picked}/>
    {/if}
{/each}
</BoardSvg>