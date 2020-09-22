<template lang="pug">
    include ../../tools/mixins.pug
    +b.image
        picture
            //:srcset="`${path}.webp`"
            source(
                :data-srcset="`${path}.webp`"
                type="image/webp"
            )
            //:srcset="fallbackSrc"
            source(
                :data-srcset="fallbackSrc"
                :type="`image/${fallbackExt}`"
            )
            //:src="fallbackSrc"
            img.lazyload(
                data-sizes="auto"
                :key="'image'"
                :data-src="fallbackSrc"
                :data-lowsrc="blur"
                :alt="alt"
            )
</template>

<script>
export default {
    props: {
        path: {
            type: String,
            required: true
        },
        fallbackExt: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        blur: {
            type: String,
            required: false
        }
    },
    computed: {
        fallbackSrc () {
            return `${this.path}.${this.fallbackExt}`
        }
    }
}
</script>
