import { addContentRoutes, addPostType } from "@factor/api"

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
  ]
})

addPostType({
  postType: "chat",
  nameIndex: "Chats",
  nameSingle: "Chat",
  namePlural: "Chats",
  permissions: {
    create: { accessLevel: 0 },
    retrieve: {
      accessLevel: 500,
    },
    embedded: {
      create: { accessLevel: 0 },
      retrieve: { accessLevel: 0 },
    },
  },
})
