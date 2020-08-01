export default {
    methods: {
        handlerOnEsc (handler, e) {
            const event = e || window.event
            let isEscape = false
            if ('key' in event) {
                isEscape = (event.key === 'Escape' || event.key === 'Esc')
            } else {
                isEscape = (event.keyCode === 27)
            }
            if (isEscape) {
                handler()
            }
        }
    }
}
