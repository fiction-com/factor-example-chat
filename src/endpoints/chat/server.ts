import { addCallback, addEndpoint, currentUserId } from "@factor/api"
import { savePost } from "@factor/post/server"
import { embeddedPost } from "@factor/post/embedded"
import { ChatGetMessageData, ChatInitData, ChatMethods } from "./keys"
import { Express, Request } from "express"
import expressWs, { WithWebsocketMethod } from "express-ws"
import WebSocket from 'ws'

addCallback({
  hook: "before-middleware",
  key: "addWs",
  callback: ({app}: { app: Express & WithWebsocketMethod }) => {
    const wsInstance = expressWs(app)
    // TODO The fact that we're only storing clients and not clearing them on disconnect is a memory leak.
    const clientChats: Map<WebSocket, string> = new Map()

    app.ws("/__chat", (ws, request: Request) => {
      const requestChatId = request.query.id as string
      clientChats.set(ws, requestChatId)

      // request used for auth/bearer
      ws.on("message", async (message: string) => {
        const {_id, text} = JSON.parse(message) as { _id: string; text: string }

        // Set up a post
        const postData = {
          content: text,
          author: currentUserId() ? [currentUserId()]: []
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
          console.log('chatId', chatId)
          // Wrong chat
          if (requestChatId !== chatId) {
            return
          }
          // Connection down
          if (client.readyState !== WebSocket.OPEN) {
            return
          }
          // try {
            client.send(JSON.stringify(result))
          // } catch (e) {
          //   console.error('error', e)
          // }
        })
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
    // @deprecated
    [ChatMethods.addMessage]: async ({chatId, message}: ChatGetMessageData, meta) => {
      const result = await requestEmbeddedPost({
        action: "save",
        data: {
          content: message,
          author: [currentUserId()]
        },
        parentId: chatId
      })

      return result
    }
  }
})
