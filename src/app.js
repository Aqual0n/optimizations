import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import App from './App.vue'
import createStore from './store'
import createRouter from './router'
import titleMixin from './util/title'
import 'lazysizes';
import 'lazysizes/plugins/blur-up/ls.blur-up';

if (process.browser) {
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.loadMode = 1;

    const VueAwesomeSwiper = import('vue-awesome-swiper/dist/ssr')
    Vue.use(VueAwesomeSwiper)
}

Vue.mixin(titleMixin)

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
export default function createApp () {
    // create store and router instances
    const store = createStore()
    const router = createRouter()

    // sync the router with the vuex store.
    // this registers `store.state.route`
    sync(store, router)

    // create the app instance.
    // here we inject the router, store and ssr context to all child components,
    // making them available everywhere as `this.$router` and `this.$store`.
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    // expose the app, the router and the store.
    // note we are not mounting the app here, since bootstrapping will be
    // different depending on whether we are in a browser or on the server.
    return { app, router, store }
}
