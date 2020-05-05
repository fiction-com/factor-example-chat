import { addEndpoint, requestEmbeddedPost, currentUserId } from "@factor/api"
import { savePost } from "@factor/post/server"

export const init = async (data, { bearer }) => {
  const chat = await savePost({ postType: "chat", data}, { bearer })
  return chat._id
}
export const addMessage = async ({chatId, message}: {chatId: string; message: string}, { bearer }) => {
  // Set up a post
  const postData = {
    content: "Embedded post content",
    author: [currentUserId()]
  }

  // Save as embedded
  await requestEmbeddedPost({
    action: "save",
    data: postData,
    parentId: chatId,
  })
}

addEndpoint({
  id: "chat",
  handler: { init, addMessage },
})
