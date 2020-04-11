import DefaultLayout from '~/layouts/Default.vue'
import Home from '~/layouts/Home.vue';

export default function (Vue) {
  Vue.component('Layout', DefaultLayout)
  Vue.component('Home', Home);
}
