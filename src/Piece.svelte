<script context='module'>
    let current
    let last
    let last_x
    let last_y
    export const getImg = () => current
    export const goBack = () => {
        if (last) {
            last.setAttributeNS(null, 'x', last_x)
            last.setAttributeNS(null, 'y', last_y)
        }
    }
    export const lastXy = () => {
        return {x: parseFloat(last_x), y: parseFloat(last_y)}
    }
    export const dropPiece = () => {
        last = current
        current = undefined
    }
</script>

<script>
    import {createEventDispatcher} from 'svelte'

    const dispatch = createEventDispatcher()

    const pick = (e) => {
        current = image
        last_x = image.getAttributeNS(null, 'x')
        last_y = image.getAttributeNS(null, 'y')
        dispatch('pick', e)
    }

    const stopDrag = (e) => {
        e.target.setAttributeNS(null, 'pointer-events', 'none')
        e.preventDefault()
        image.ondrag = null
    }

    let image
    export let pid
    export let url
    export let x
    export let y
    export let height
    export let width
</script>
<image id={pid} bind:this={image} xlink:href={url} height={height} width={width} 
x={x} y={y} on:mousedown={pick} on:dragstart={stopDrag}/>