import { disablePageScroll, enablePageScroll } from 'scroll-lock'
import handlerOnEsc from './handlerOnEsc'

export default {
    mixins: [
        handlerOnEsc
    ],

    props: {
        active: {
            type: Boolean
        }
    },

    methods: {
        onKeyDown (e) {
            this.handlerOnEsc(this.closePopup, e)
        },
        closePopup () {
            this.$emit('close')
        }
    },

    watch: {
        active (newValue) {
            if (newValue) {
                document.addEventListener('keydown', this.onKeyDown)
                disablePageScroll(this.$refs.popup)
            } else {
                document.removeEventListener('keydown', this.onKeyDown)
                enablePageScroll()
            }
        }
    }
}
