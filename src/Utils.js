export const isWhite = (p) => {
    return p.charCodeAt(0) > 97 
}

export const isBlack = (p) => {
    return p.charCodeAt(0) < 90 
}

export const getPieceName = (p) => {
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

export const sameColor = (p1, p2) => {
    return (isWhite(p1) && isWhite(p2)) || (isBlack(p1) && isBlack(p2))
}

export const fileName = (piece) => {
    if (piece == undefined){
        return undefined
    }
    let color = isBlack(piece) ? 'b' : 'w'
    let piece_name = getPieceName(piece)
    return `${piece_name}_${color}.svg`
}