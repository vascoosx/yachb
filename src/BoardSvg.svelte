<script>
    import {getImg, lastXy} from './Piece.svelte'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    let svg
    let image
    let ox = 0
    let oy = 0

    const move = (e) => {
        if (image) {
            let ctm = svg.getScreenCTM()
            image.setAttributeNS(null, 'x', `${((e.clientX - ctm.e) / ctm.a)/0.5 + ox}%`)
            image.setAttributeNS(null, 'y', `${((e.clientY - ctm.f) / ctm.d)/0.5 + oy}%`)
        }
    }

    const setupTrans = (e) => {
        checkImage()
        let lc = lastXy()
        let ctm = svg.getScreenCTM()
        let sx = ((e.clientX - ctm.e) / ctm.a)/0.5
        let sy = ((e.clientY - ctm.f) / ctm.d)/0.5
        ox = lc.x - sx
        oy = lc.y - sy
    }

    const checkImage = () => {
        image = getImg()
    }

    const resetPointerEvents = (e) => {
        checkImage()
        if (image) {
            image.setAttributeNS(null, 'pointer-events', 'all')
            image = undefined
            dispatch('drop', e)
        }
    }
</script>
<style>
    svg {
        border:2px solid;
    }
</style>
<svg
    viewbox="0 0 50 50"
    bind:this={svg}
    on:mousemove={move}
    on:mousedown={setupTrans}
    on:mouseup={resetPointerEvents}
>
    <slot></slot>
</svg>