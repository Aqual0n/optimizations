import Vue from 'vue'
import Router from 'vue-router'

import Index from '../components/pages/Index.vue'

import Privacy from '../components/pages/Privacy.vue'

import NotFound from '../components/pages/NotFound.vue'

Vue.use(Router)

export default function createRouter () {
    return new Router({
        mode: 'history',
        fallback: false,
        scrollBehavior: () => ({ y: 0 }),
        routes: [
            {
                path: '',
                name: 'main',
                component: Index,
                meta: {
                    language: 'ru',
                    type: 'main',
                    animation: 'slice'
                }
            },

            {
                path: '/privacy',
                name: 'privacy',
                component: Privacy,
                meta: {
                    language: 'ru',
                    type: 'privacy'
                }
            },
            {
                path: '*',
                name: '404En',
                component: NotFound,
                meta: {
                    title: '404',
                    language: 'ru',
                    type: '404'
                }
            }
        ]
    })
}
