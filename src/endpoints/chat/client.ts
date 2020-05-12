import { endpointRequest } from "@factor/endpoint"
import { CHAT_RESOURCE, ChatMethods } from "./keys"

export const initChat = () => endpointRequest({
  id: CHAT_RESOURCE,
  method: ChatMethods.init,
  params: {},
})
