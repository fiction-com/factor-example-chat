import { endpointRequest } from "@factor/endpoint"

export const getSomeData = () => endpointRequest({
  id: "chats",
  method: "initialize",
  params: {},
})
