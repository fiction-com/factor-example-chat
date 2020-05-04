import { addCallback, addEndpoint } from "@factor/api"
import expressWs, { WithWebsocketMethod } from "express-ws"
import { Express, Request } from "express"

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({ app }: { app: Express & WithWebsocketMethod }) => {
    expressWs(app)

    app.ws("/__chat", (ws, request: Request) => {
      // request used for auth/bearer
      ws.on("message", message => {
        setTimeout(() => {
          const data = JSON.parse(message as string)

          const returnData = {
            text: `This is an echo of "${data.text}"`,
            email: "hello@fiction.com",
            name: "Factor Server"
          }

          ws.send(JSON.stringify(returnData))
        }, 500)
      })
    })
  }
})


