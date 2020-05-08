import { emitEvent, isNode } from "@factor/api"

const ensureNotNode = (): void | never => {
  if (isNode) throw new Error("Client sockets only work in browser.")
}

const socketUrl = (relativePath: string): string => {
  const loc = window.location
  const wsProtocol = loc.protocol === "https:" ? "wss:" : "ws:"

  return `${wsProtocol}//${loc.host}${relativePath}`
}

export class ChatWebsocketService {
  socket?: WebSocket

  /**
   * Spin up websocket connection.
   * @param chatId
   */
  async initialize (chatId: string): Promise<WebSocket> {
    ensureNotNode()
    if (this.socket && this.socket.readyState == 1) {
      return this.socket
    } else {
      this.socket = new WebSocket(socketUrl(`/__chat?id=${chatId}`))

      return await new Promise(resolve => {
        this.socket.addEventListener("open", () => {
          this.socket.addEventListener("message", function(event: MessageEvent) {
            emitEvent("received-message", JSON.parse(event.data))
          })
          resolve(this.socket)
        })
      })
    }
  }

  async close () {
    this.socket.close()
    this.socket = undefined
  }

  /**
   * Send a message to the socket
   * @param data
   */
  async sendMessage (data: {
    _id: string;
    text: string;
  }): Promise<void> {
    if (!this.socket) {
      throw new Error('Initialize socket first.')
    }
    this.socket.send(JSON.stringify(data))
  }
}

