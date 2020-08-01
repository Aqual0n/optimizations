export default {
    methods: {
        isElementInViewport (el) {
            const rect = el.getBoundingClientRect()
            return (
                rect.top >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
            )
        }
    }
}
