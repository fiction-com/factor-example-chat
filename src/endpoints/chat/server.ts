import { addEndpoint, addCallback, currentUserId } from "@factor/api"
import { savePost } from "@factor/post/server"
import { embeddedPost } from "@factor/post/embedded"
import { ChatGetMessageData, ChatInitData, ChatMethods } from "./keys"
import { Express, Request } from "express";
import expressWs, { WithWebsocketMethod } from "express-ws";

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({ app }: { app: Express & WithWebsocketMethod }) => {
    const wsInstance = expressWs(app)

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
          const result = embeddedPost({
            action: "save",
            postType: 'chat',
            data: postData,
            parentId: _id,
          })

          const clients = wsInstance.getWss().clients
          console.log('clients', clients)

          // Send post back
          ws.send(JSON.stringify(result))
        }, 500)
      })
    })
  }
})

addEndpoint({
  id: "chat",
  handler: {
    [ChatMethods.init]: async (data: ChatInitData, {bearer}) => {
      const chat = await savePost({postType: "chat", data}, {bearer})
      return chat._id
    },
    [ChatMethods.addMessage]: async ({chatId, message}: ChatGetMessageData, meta) => {
      const result = await requestEmbeddedPost({
        action: "save",
        data: {
          content: message,
          author: [currentUserId()]
        },
        parentId: chatId,
      })

      return result
    }
  }
})
