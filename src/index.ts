import { addContentRoutes } from "@factor/api"

/**
 * Primary view components
 * Vue natively has support for the dynamic imports format below
 * treat these as working components
 */

const chatView = (): Promise<any> => import("./el/v-chat.vue")

/**
 * Add application routes
 */
addContentRoutes({
  key: "appRoutes",
  routes: [{ path: "/", component: chatView }]
})
