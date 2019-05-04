import { getPieceName, isBlack, isWhite, sameColor } from './Utils.js'

class Judge {
    constructor() {
        this.ok = false
        this.castle = {
            k_moved: false,
            kr_moved: false,
            qr_moved: false,
            K_moved: false,
            KR_moved: false,
            QR_moved: false,
            castlable: true
        }
        this.is_initial_pawn = false
        this.pieces = []
        this.move = {
            length: undefined,
            direction: undefined,
            step: undefined,
            kind: undefined,
            type: undefined,
            backward: false
        }
        this.enpassant = {
            square: undefined,
            correct_destination: false
        }
        this.piece = {
            start: undefined,
            end: undefined,
            start_id: undefined,
            end_id: undefined
        }
    }

    checkMove() {
        let n = this
        if (n.piece.end !== '-' && sameColor(n.piece.start, n.piece.end)) {
            n.ok = false
            return
        }
    
        let checker = {
            pawn: () => this.checkPawn(),
            rook: () => this.checkRook(),
            knight: () => this.checkKnight(),
            bishop: () => this.checkBishop(),
            queen: () => this.checkQueen(),
            king: () => this.checkKing()
        }
        let piece = getPieceName(n.piece.start)
        if (piece === 'king') {
            this.updateCastlingStatus()  
        }
    
        if (piece === 'pawn') {
            this.updateBackwardMove()
            this.checkPawnIsInitial()
            this.checkEnpassant()
        }
    
        n.ok = checker[piece]()
    }

    checkPawn() {
        let n = this
        if (n.move.backward) return false
        if (n.piece.end !== '-' && n.move.length === 1 && n.move.kind === 'bishop') return true
        if (n.piece.end !== '-') return false
        if (n.move.length === 2) return n.is_initial_pawn && n.move.type === 'vertical rook' && this.pathClear()
        if (n.move.length !== 1) return false
        if (n.enpassant.correct_destination){
            return n.move.kind === 'bishop'
        } else {
            return n.move.type === 'vertical rook'
        }
    }

    checkRook() {
        let n = this
        if (n.move.kind !== 'rook') return false
        return this.pathClear()
    }

    checkKnight() {
        let n = this
        return n.move.type === 'knight move'
    }

    checkBishop() {
        let n = this
        if (n.move.kind !== 'bishop') return false
        return this.pathClear()
    }

    checkQueen() {
        let n = this
        if (n.move.type === 'knight move') return false
        return this.pathClear()
    }

    checkKing() {
        let n = this
        if (n.move.type === 'knight move') return false
        if (n.move.length > 2) return false
        if (n.move.length === 2 && !n.castle.castlable) return false
        if (n.move.length === 2 && n.castle.castlable && n.move.type !== 'horizontal rook') return false
        return this.pathClear()
    }

    updateBackwardMove() {
        let n = this
        let black = isBlack(n.piece.start)
        let white = isWhite(n.piece.start)
        let direction = n.move.direction
        if ((black && direction > 0) || (white && direction < 0)) {
            n.move.backward = false
        } else {
            n.move.backward = true
        }
    }

    checkPawnIsInitial() {
        let n = this
        let pos = n.piece.start_id
        if (n.piece.start === 'P') {
            n.is_initial_pawn = pos >= 8 && pos <= 15
        } else if (n.piece.start === 'p') {
            n.is_initial_pawn = pos >= 48 && pos <= 55
        } 
    }

    checkEnpassant() {
        this.enpassant.correct_destination = (this.piece.end_id === this.enpassant.square) && (this.piece.end === '-')
    }

    pathClear() {
        let n = this
        for (let i=1; i < n.move.length; i+=1){
            if (n.pieces[n.piece.start_id + (i * n.move.step * n.move.direction)] !== '-'){
                return false
            }
        }
        return true
    }

    updateCastlingStatus() {
        let n = this
        let black = isBlack(n.piece.start)
        let white = isWhite(n.piece.start)
        if (white && n.move.direction > 0) {
            n.castle.castlable = !n.castle.k_moved && !n.castle.kr_moved
        } else if (white && n.move.direction < 0) {
            n.castle.castlable = !n.castle.k_moved && !n.castle.qr_moved
        } else if (black && n.move.direction > 0) {
            n.castle.castlable = !n.castle.K_moved && !n.castle.KR_moved
        } else if (black && n.move.direction < 0) {
            n.castle.castlable = !n.castle.K_moved && !n.castle.QR_moved
        }
    }
}

export { Judge }