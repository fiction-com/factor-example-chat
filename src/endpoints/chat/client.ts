import { endpointRequest } from "@factor/endpoint"
import { CHAT_RESOURCE, ChatGetMessageData, ChatMethods } from "./keys"

export const initChat = () => endpointRequest({
  id: CHAT_RESOURCE,
  method: ChatMethods.init,
  params: {},
})
export const sendMessageToChat = ({chatId, message}: ChatGetMessageData) => endpointRequest({
  id: CHAT_RESOURCE,
  method: ChatMethods.addMessage,
  params: {chatId, message},
})
