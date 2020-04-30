import { emitEvent, isNode } from "@factor/api"

const ensureNotNode = (): void | never => {
  if (isNode) throw new Error("Client sockets only work in browser.")
}

const socketUrl = (relativePath: string): string => {
  const loc = window.location
  const wsProtocol = loc.protocol === "https:" ? "wss:" : "ws:"

  return `${wsProtocol}//${loc.host}${relativePath}`
}

/**
 * Make stateful so we don't initialize multiple times
 */
let __socket: WebSocket

/**
 * Initialize socket or get already initialized socket
 */
const getSocket = async (): Promise<WebSocket> => {
  ensureNotNode()
  if (__socket && __socket.readyState == 1) {
    return __socket
  } else {
    __socket = new WebSocket(socketUrl("/__chat"))

    return await new Promise(resolve => {
      __socket.addEventListener("open", () => {
        __socket.addEventListener("message", function(event: MessageEvent) {
          emitEvent("received-message", event)
        })
        resolve(__socket)
      })
    })
  }
}

/**
 * Send a message to the socket
 * @param text - message
 */
export const sendMessage = async (text: string): Promise<void> => {
  const sock = await getSocket()

  sock.send(text)
}
