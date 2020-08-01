export default {
    data () {
        const tablet = 650
        const maxMobile = tablet - 1
        const desktop = 1200
        const maxTablet = desktop - 1
        const containerCollapse = 1840
        const maxRems = 1440
        return {
            breakpoints: {
                tablet,
                maxMobile,
                desktop,
                maxTablet,
                containerCollapse,
                maxRems
            }
        }
    },
    created () {
        if (typeof document !== 'undefined' && window.innerWidth >= this.breakpoints.desktop) {
            window.addEventListener('resize', this.setHtmlFontSize)
        }
    },
    destroyed () {
        if (typeof document !== 'undefined' && window.innerWidth >= this.breakpoints.desktop) {
            window.removeEventListener('resize', this.setHtmlFontSize)
        }
    },
    mounted () {
        if (window.innerWidth >= this.breakpoints.desktop) {
            this.setHtmlFontSize()
        }
    },
    methods: {
        setHtmlFontSize () {
            if (window.innerWidth >= this.breakpoints.desktop) {
                let fontSize = window.innerWidth / 100
                if (window.innerWidth >= this.breakpoints.maxRems) {
                    fontSize = this.breakpoints.maxRems / 100
                }
                document.documentElement.style.fontSize = `${fontSize}px`
            } else {
                document.documentElement.style.fontSize = null
            }
        }
    }
}
