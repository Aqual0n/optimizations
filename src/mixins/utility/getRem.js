export default {
  data () {
    return {
      rem: null
    }
  },
  mounted () {
    this.setRemSize()
  },
  methods: {
    setRemSize () {
      this.rem = 12
      if (window.innerWidth >= 400) this.rem = 13.2
      if (window.innerWidth >= 650) this.rem = 12
      if (window.innerWidth >= 1200) this.rem = window.innerWidth / 100
      if (window.innerWidth >= 1440) this.rem = 14.4
    },
    getRemsByPx (px) {
      return px / 12
    },
    getPxByRems (rems) {
      return rems * this.rem
    }
  }
}
