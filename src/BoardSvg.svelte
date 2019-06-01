<script>
    import {getImg} from './Piece.svelte'
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    let svg
    let image
    const move = (e) => {
        if (image) {
            let ctm = svg.getScreenCTM()
            image.setAttributeNS(null, 'x', (e.clientX - 20 - ctm.e) / ctm.a)
            image.setAttributeNS(null, 'y', (e.clientY - 20 - ctm.f) / ctm.d)
        }
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
        width: 560px;
        height: 560px;
        border:2px solid;
    }
</style>
<svg
    bind:this={svg}
    on:mousemove={move}
    on:mousedown={checkImage}
    on:mouseup={resetPointerEvents}
>
    <slot></slot>
</svg>