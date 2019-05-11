<script>
    import {getImg} from './Piece.svelte'

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
    on:mouseup={checkImage}
>
    <slot></slot>
</svg>