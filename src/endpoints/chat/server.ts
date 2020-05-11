import { addCallback, addEndpoint } from "@factor/api"
import { savePost } from "@factor/post/server"
import { setAuthorizedUser } from "@factor/endpoint/server"
import { embeddedPost } from "@factor/post/embedded"
import { ChatGetMessageData, ChatInitData, ChatMethods } from "./keys"
import { Express, Request } from "express"
import expressWs, { WithWebsocketMethod } from "express-ws"
import WebSocket from 'ws'

type Id = string

// Track all open chats and close connection if client is down.
const clientChats: Map<WebSocket, Id> = new Map()
setInterval(() => {
  ;[...clientChats].forEach(([client, chatId]) => {
    if (client.readyState !== WebSocket.OPEN) {
      client.close()
      clientChats.delete(client)
    }
  })
}, 30000)

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({app}: { app: Express & WithWebsocketMethod }) => {
    expressWs(app)

    app.ws("/__chat", async (ws, request: Request) => {
      // Authorize user
      const requestChatId = request.query.id as string
      const token = request.query.token as string
      const bearer = await setAuthorizedUser(token)

      clientChats.set(ws, requestChatId)

      // request used for auth/bearer
      ws.on("message", async (message: string) => {
        const {_id, text} = JSON.parse(message) as { _id: string; text: string }

        // Set up a post
        const postData = {
          content: text,
          author: bearer?._id ? [bearer?._id]: []
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
