export default {
    data () {
        return {
            deviceSize: {
                mobile: false,
                tablet: false,
                desktop: false,
                tablet768: false
            }
        }
    },

    mounted () {
        this.getDeviceSize()

        window.addEventListener('resize', this.getDeviceSize)
    },
    destroyed () {
        window.removeEventListener('resize', this.getDeviceSize)
    },
    methods: {
        getDeviceSize () {
            this.deviceSize.mobile = window.innerWidth < 650
            this.deviceSize.tablet = window.innerWidth >= 650 && window.innerWidth < 1200
            this.deviceSize.tablet768 = window.innerWidth >= 768 && window.innerWidth < 1200
            this.deviceSize.desktop = window.innerWidth >= 1200
        }
    }
}
