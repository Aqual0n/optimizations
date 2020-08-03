<template lang="pug">
    include ../../tools/mixins.pug
    div
        header-component
        div(style="font-size:80px;text-align: center") New project
        main-component
        footer-component

</template>

<script>
import MyHeader from '../sections/TheHeader.vue'
import Main from '../sections/Main.vue'
import MyFooter from '../sections/TheFooter.vue'

export default {
    components: {
        'header-component': MyHeader,
        'main-component': Main,
        'footer-component': MyFooter
    },
    data () {
        return {}
    }
}
</script>
