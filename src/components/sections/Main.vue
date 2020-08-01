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
                        path: '/public/images/sun1',
                        fallback: 'png',
                        blur: '/public/images/blur/sun1.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun2',
                        fallback: 'jpg',
                        blur: '/public/images/blur/sun2.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun3',
                        fallback: 'png',
                        blur: '/public/images/blur/sun3.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun4',
                        fallback: 'png',
                        blur: '/public/images/blur/sun4.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun5',
                        fallback: 'png',
                        blur: '/public/images/blur/sun5.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun6',
                        fallback: 'png',
                        blur: '/public/images/blur/sun6.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun7',
                        fallback: 'png',
                        blur: '/public/images/blur/sun7.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun8',
                        fallback: 'png',
                        blur: '/public/images/blur/sun8.jpg',
                        alt: 'Солнце'
                    },
                    {
                        path: '/public/images/sun9',
                        fallback: 'png',
                        blur: '/public/images/blur/sun9.jpg',
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
