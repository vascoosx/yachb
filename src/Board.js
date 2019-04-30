import { writable } from 'svelte/store'

function isCastling(board, pos1, pos2) {
    let king = board.board[pos2]
    if (king.toLowerCase() !== 'k') return false

    if (king === 'k' && pos1 !== 60) return false

    if (king === 'K' && pos1 !== 4) return false

    if (king === 'k' && ![62, 58].includes(pos2)) return false

    if (king === 'K' && ![6, 1].includes(pos2)) return false

    return true
}

function castleFollowUp(board, pos1, pos2) {
    if (!isCastling(board, pos1, pos2)) return board

    let loc = pos2 % 8
    if (loc === 6) {
       move(pos2+1, pos2-1, board)
    } else if (loc === 2) {
       move(pos2-2, pos2+1, board)
    }
    return board
}

function enpassantFollowUP(board, pos1, pos2) {
    //TODO: implement
    return board
}

function recordMove(board, pos1, pos2) {
    let piece = board.board[pos2]
    if (piece === 'K') board.K_moved = true
    if (piece === 'k') board.k_moved = true
    if (piece === 'R' && board.KR_moved && pos1 == 7) board.KR_moved = true
    if (piece === 'R' && board.QR_moved && pos1 == 0) board.QR_moved = true
    if (piece === 'r' && board.kr_moved && pos1 == 56) board.kr_moved = true
    if (piece === 'r' && board.qr_moved && pos1 == 63) board.qr_moved = true
}

function move(p1, p2, board){
    board.board[p2] = board.board[p1]
    board.board[p1] = '-'
    recordMove(board, p1, p2)
    return board
}

function makeBoard() {
    const { subscribe, set, update } =
    writable(
    {
        board:
    ['R','N','B','Q','K','B','N','R',
    'P','P','P','P','P','P','P','P',
    '-','-','-','-','-','-','-','-',
    '-','-','-','-','-','-','-','-',
    '-','-','-','-','-','-','-','-',
    '-','-','-','-','-','-','-','-',
    'p','p','p','p','p','p','p','p',
    'r','n','b','q','k','b','n','r'],
        k_moved: false,
        K_moved: false,
        KR_moved: false,
        QR_moved: false,
        kr_moved: false,
        qr_moved: false 
    })
    return {
        subscribe,
        swap: (pos1, pos2) => {
            update( p => {
                move(pos1, pos2, p)
                castleFollowUp(p, pos1, pos2)
                enpassantFollowUP(p, pos1, pos2)
                return p
            })
        }
    }
}

export const pieces = makeBoard()