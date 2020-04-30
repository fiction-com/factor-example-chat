/**
 * Override standard Factor components and icons
 */

import icon from "./icon.svg"
export default {
  app: {
    components: {
      content: (): Promise<any> => import("./content.vue"),
    },
    icon,
    faviconPath: `${__dirname}/favicon.png`,
  },
}
