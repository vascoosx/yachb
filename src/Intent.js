
class Intent {
    constructor() {
        this.clear = false,
        this.start =  undefined,
        this.end = undefined,
        this.gesture = {t: undefined, l: undefined, d: undefined, s: undefined, c: undefined}
    }

    getGesture(){
        let m = this
        let dir = m.end > m.start ? 1 : -1
        if (m.end === m.start) {
            m.gesture = { t: 'no move' }
        } else if (m.start % 8 == m.end % 8) {
            m.gesture = { t: 'vertical rook', l: Math.floor(Math.abs(m.start - m.end) / 8), d: dir, s: 8, c: 'rook' }
        } else if (Math.floor(m.start / 8) == Math.floor(m.end / 8)) {
            m.gesture = { t: 'horizontal rook', l: Math.abs(m.start - m.end), d: dir, s: 1, c: 'rook' }
        } else if (Math.abs(Math.floor(m.start / 8) - Math.floor(m.end / 8)) === Math.abs(m.start % 8 - m.end % 8)){
            let step = Math.abs(m.start - m.end)
            m.gesture = { t: 'bishop move', l: Math.floor(Math.abs(m.start - m.end) / step), d: dir, s: step, c: 'bishop' }
        } else if (Math.abs(m.start - m.end) == 15 || Math.abs(m.start - m.end) == 17) {
            m.gesture = { t: 'knight move'}
        } else if (Math.abs(m.start - m.end) == 10 || Math.abs(m.start - m.end) == 6){
            m.gesture = { t: 'knight move'}
        } else{
            m.gesture = { t: 'illegal move' } 
        }
    }

    updateStart(n) {
        this.start = n
    }

    updateEnd(n) {
        this.end = n
    }
}

export { Intent }