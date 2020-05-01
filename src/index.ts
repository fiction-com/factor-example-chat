import { addContentRoutes } from "@factor/api"

/**
 * Primary view components
 * Vue natively has support for the dynamic imports format below
 * treat these as working components
 */

/**
 * Add application routes
 */
addContentRoutes({
  key: "appRoutes",
  routes: [
    {path: "/", component: () => import("./pages/home.vue")},
    // {path: "/", component: import("./el/v-chat.vue")},
    // {path: "/home", name: 'home' component: chatView}
  ]
})
