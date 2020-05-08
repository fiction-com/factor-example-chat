<template>
  <div class="chat-list">
    <h2>Chat List</h2>
    <factor-spinner v-if="loading" color-mode="primary" />
    <div
      class="item"
      v-for="chat in chats"
      :key="chat._id"
      @click="openChat(chat._id)"
    >
      <div class="id">
        {{getId(chat)}}
      </div>
      <div class="divider"/>
      <div class="date">
        {{getCreatedAt(chat)}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { requestPostIndex, currentUser, emitEvent } from '@factor/api'
import formatRelative from 'date-fns/formatRelative'
import { factorSpinner } from "@factor/ui"

export default Vue.extend({
  name: 'chat-list',
  metaInfo: {
    title: "Chat List"
  },
  components: {
    factorSpinner,
  },
  watch: {
    currentUser: {
      handler (currentUser) {
        if (!currentUser) {
          this.$router.push({name: 'home'})
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      loading: false,
      chats: []
    }
  },
  async mounted (this: any) {
    this.loading = true
    const {posts: chats, meta} = await requestPostIndex({
      limit: 20, // posts per page
      page: 1, // page number
      postType: "chat", // post type
      sort: {createdAt: "descending"} // query sort
    })
    this.loading = false
    this.chats = chats
  },
  methods: {
    openChat(chatId: string) {
      emitEvent("open-chat", chatId)
    },
    getId (chat) {
      // Grab last 6 symbols from id to keep it readable.
      return '# ' + chat._id.slice(-6)
    },
    getCreatedAt(chat) {
      return formatRelative(new Date(chat.createdAt), new Date())
    }
  },
  computed: {
  currentUser() {
    return currentUser()
  }
}
})
</script>

<style lang="less" scoped>

.chat-list {
  --color-bg: #ffffff;
  --color-border: #eee;
  --color-hover: #eee;

  .item {
    display: flex;
    padding: 0.8rem 1rem;
    border-bottom: 1px solid var(--color-border);
    cursor: pointer;

    &:hover {
      background-color: var(--color-hover);
    }
  }

  .divider {
    flex: 1 0;
  }
}
</style>
