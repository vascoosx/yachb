import {isBlack, getPieceName} from './Utils.js'

class Board{
    constructor() {
        this.pieces = [
            'R','N','B','Q','K','B','N','R',
            'P','P','P','P','P','P','P','P',
            '-','-','-','-','-','-','-','-',
            '-','-','-','-','-','-','-','-',
            '-','-','-','-','-','-','-','-',
            '-','-','-','-','-','-','-','-',
            'p','p','p','p','p','p','p','p',
            'r','n','b','q','k','b','n','r'],
        this.k_moved = false,
        this.K_moved = false,
        this.KR_moved = false,
        this.QR_moved = false,
        this.kr_moved = false,
        this.qr_moved = false,
        this.columns = [0, 1, 2, 3, 4, 5, 6, 7]
        this.rows = [0, 1, 2, 3, 4, 5, 6, 7] 
        this.enpassant_square_set_next = undefined

    }

    isCastling(pos1, pos2) {
        let king = this.pieces[pos2]
        if (king.toLowerCase() !== 'k') return false

        if (king === 'k' && pos1 !== 60) return false

        if (king === 'K' && pos1 !== 4) return false

        if (king === 'k' && ![62, 58].includes(pos2)) return false

        if (king === 'K' && ![6, 2].includes(pos2)) return false

        return true
    }

    castleFollowUp(pos1, pos2) {
        if (!this.isCastling(pos1, pos2)) return

        let loc = pos2 % 8
        if (loc === 6) {
            this.move(pos2+1, pos2-1)
        } else if (loc === 2) {
            this.move(pos2-2, pos2+1)
        }
    }

    enpassantFollowUp(pos1, pos2) {
        if (this.enpassant_square_set_next !== undefined) {
            this.enpassant_square = this.enpassant_square_set_next
            this.enpassant_square_set_next = undefined
            return
        }
        let piece = this.pieces[pos2]
        let pawn = getPieceName(piece)
        if (pawn !== 'pawn') return
        
        let target_pawn_pos = isBlack(piece) ? pos2 - 8 : pos2 + 8

        if (pos2 === this.enpassant_square) {
            this.pieces[target_pawn_pos] = '-'
        }
        this.enpassant_square = undefined
    }

    recordMove(pos1, pos2) {
        let piece = this.pieces[pos2]
        if (piece === 'K') this.K_moved = true
        if (piece === 'k') this.k_moved = true
        if (piece === 'R' && pos1 == 7) this.KR_moved = true
        if (piece === 'R' && pos1 == 0) this.QR_moved = true
        if (piece === 'r' && pos1 == 63) this.kr_moved = true
        if (piece === 'r' && pos1 == 56) this.qr_moved = true
        if (piece.toLowerCase() === 'p' && Math.abs(pos1 - pos2) === 16) {
            this.enpassant_square_set_next = isBlack(piece) ? pos2 - 8 : pos2 + 8
        }     
    }

    move(p1, p2){
        this.pieces[p2] = this.pieces[p1]
        this.pieces[p1] = '-'
        this.recordMove(p1, p2)
    }

    swap(pos1, pos2) {
        this.move(pos1, pos2)
        this.castleFollowUp(pos1, pos2)
        this.enpassantFollowUp(pos1, pos2)
    }
}

export { Board }