export const initialize = async (params, meta) => {
  return params.text + " world"
}
addEndpoint({
  id: "chats",
  handler: { initialize },
})
