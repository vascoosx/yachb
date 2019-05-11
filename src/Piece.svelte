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

    const drop = (e) => {
        x = image.getAttributeNS(null, 'x')
        y = image.getAttributeNS(null, 'y')
        last = image
        current = undefined
        dispatch('drop', e)
    }

    const stopDrag = (e) => {
        e.preventDefault()
        image.ondrag = null
    }

    let image
    export let pid
    export let url
    export let x
    export let y
</script>
<image id={pid} bind:this={image} xlink:href={url} height=40 width=40 
x={x} y={y} on:mousedown={pick} on:mouseup={drop} on:dragstart={stopDrag}/>
