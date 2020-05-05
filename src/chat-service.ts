import { onEvent } from "@factor/api"

export const registerChat = (onMessage: (data: MessageEvent) => void): void => {
  onEvent("received-message", onMessage)
}
