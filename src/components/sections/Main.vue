<template lang="pug">
    include ../../tools/mixins.pug
    +b.MAIN.main
        +e.container.container
            p Main
            +e.IMAGE-COMPONENT.image(
                v-for="(image, index) in images"
                :path="image.path"
                :fallbackExt="image.fallback"
                :blur="image.blur"
                :alt="image.alt"
                :key="index"
            )

</template>

<script>
    import Image from "../blanks/Image.vue";
    export default {
        data () {
            return {
                images: [
                    {
                        path: '/public/images/sections/main/sun1',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun1.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun2',
                        fallback: 'jpg',
                        blur: '/public/images/sections/main/blur/sun2.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun3',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun3.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun4',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun4.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun5',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun5.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun6',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun6.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun7',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun7.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun8',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun8.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sections/main/sun9',
                        fallback: 'png',
                        blur: '/public/images/sections/main/blur/sun9.jpg',
                        alt: 'Солнце'
                    },
                ]
            }
        },
        components: {
            'image-component': Image
        }
    }
</script>
