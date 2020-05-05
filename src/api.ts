import { endpointRequest } from "@factor/endpoint"

export const initChat = () => endpointRequest({
  id: "chat",
  method: "init",
  params: {},
})
export const sendMessageToChat = ({chatId, message}: {chatId: string; message: string}) => endpointRequest({
  id: "chat",
  method: "sendMessage",
  params: {chatId, message},
})
