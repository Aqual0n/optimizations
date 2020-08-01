export default {
    methods: {
        getScroll () {
            let x; let y; const d = document
            const r = d.documentElement
            const b = d.body
            if (window.pageYOffset !== undefined) {
                x = window.pageXOffset
                y = window.pageYOffset
            } else {
                x = r.scrollLeft || b.scrollLeft || 0
                y = r.scrollTop || b.scrollTop || 0
            }
            return { x, y }
        }
    }
}
