import { addCallback, addEndpoint } from "@factor/api"
import { savePost } from "@factor/post/server"
import { setAuthorizedUser } from "@factor/endpoint/server"
import { embeddedPost } from "@factor/post/embedded"
import { ChatGetMessageData, ChatInitData, ChatMethods } from "./keys"
import { Express, Request } from "express"
import expressWs, { WithWebsocketMethod } from "express-ws"
import WebSocket from 'ws'

type Id = string

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({app}: { app: Express & WithWebsocketMethod }) => {
    const wsInstance = expressWs(app)
    const clientChats: Map<WebSocket, Id> = new Map()

    app.ws("/__chat", async (ws, request: Request) => {
      const bearer = await setAuthorizedUser(request.headers.authorization)
      console.log('bearer', bearer)

      const requestChatId = request.query.id as string
      clientChats.set(ws, requestChatId)

      // request used for auth/bearer
      ws.on("message", async (message: string) => {
        const {_id, text, authorId} = JSON.parse(message) as { _id: string; text: string }

        // TODO Passing user id is not ideal for security.

        // Set up a post
        const postData = {
          content: text,
          author: authorId ? [authorId]: []
        }

        // Save as embedded
        const result = await embeddedPost({
          action: "save",
          postType: 'chat',
          data: postData,
          parentId: _id
        }, {})

        // Emit to relevant clients
        ;[...clientChats].forEach(([client, chatId]) => {
          // Wrong chat
          if (requestChatId !== chatId) {
            return
          }
          // Connection down
          if (client.readyState !== WebSocket.OPEN) {
            return
          }
          client.send(JSON.stringify(result))
        })
      })


      ws.on('close', () => {
        clientChats.delete(ws)
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
  }
})
