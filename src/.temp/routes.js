export default [
  {
    path: "/codepen/:page(\\d+)?/",
    component: () => import(/* webpackChunkName: "page--src--pages--codepen-vue" */ "/Users/ryanzola/Desktop/Projects/Gridsome/my-gridsome-wordpress/src/pages/Codepen.vue")
  },
  {
    path: "/about/",
    component: () => import(/* webpackChunkName: "page--src--pages--about-vue" */ "/Users/ryanzola/Desktop/Projects/Gridsome/my-gridsome-wordpress/src/pages/About.vue")
  },
  {
    name: "404",
    path: "/404/",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/ryanzola/Desktop/Projects/Gridsome/my-gridsome-wordpress/node_modules/gridsome/app/pages/404.vue")
  },
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/ryanzola/Desktop/Projects/Gridsome/my-gridsome-wordpress/src/pages/Index.vue")
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/ryanzola/Desktop/Projects/Gridsome/my-gridsome-wordpress/node_modules/gridsome/app/pages/404.vue")
  }
]

