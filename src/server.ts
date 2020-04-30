import { addCallback } from "@factor/api"
import expressWs, { WithWebsocketMethod } from "express-ws"
import { Express, Request } from "express"

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({ app }: { app: Express & WithWebsocketMethod }) => {
    expressWs(app)

    app.ws("/__chat", (ws, request: Request) => {
      ws.on("message", message => {
        setTimeout(() => {
          ws.send(`This is an echo of ${message}`)
        }, 500)
      })
    })
  }
})
