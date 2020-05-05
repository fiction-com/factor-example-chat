import { addCallback, currentUserId, requestEmbeddedPost } from "@factor/api"
import expressWs, { WithWebsocketMethod } from "express-ws"
import { Express, Request } from "express"

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({ app }: { app: Express & WithWebsocketMethod }) => {
    expressWs(app)

    app.ws("/__chat", (ws, request: Request) => {
      // request used for auth/bearer
      ws.on("message", (message: string) => {
        setTimeout(() => {
          const {_id, text} = JSON.parse(message) as {_id: string; text: string}

          // Set up a post
          const postData = {
            content: text,
            author: [currentUserId()]
          }

          // Save as embedded
          requestEmbeddedPost({
            action: "save",
            postType: 'chat',
            data: postData,
            parentId: _id,
          }).then((result) => {
            ws.send(JSON.stringify(result))
          }).catch(e => console.error('e', e))

        }, 500)
      })
    })
  }
})

import './endpoints/endpoints'


