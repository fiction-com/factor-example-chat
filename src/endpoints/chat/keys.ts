export const CHAT_RESOURCE = "chat"

export const ChatMethods = {
  init: 'init',
}

export type ChatInitData = {}
export type ChatGetMessageData = {chatId: string; message: string}
