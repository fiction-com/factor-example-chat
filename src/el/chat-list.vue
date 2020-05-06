<template>
  <div class="chat-list">
    <div
      v-for="chat in chats"
      :key="chat._id"
      @click="$emit('openChat', chat._id)"
    >
      {{chat._id}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { requestPostIndex } from '@factor/api'

export default Vue.extend({
  name: 'chat-list',
  data() {
    return {
      chats: []
    }
  },
  async mounted(this: any) {
    const {posts: chats, meta} = await requestPostIndex({
      limit: 20, // posts per page
      page: 1, // page number
      postType: "chat", // post type
      sort: {createdAt: "descending"} // query sort
    })
    this.chats = chats
  },
})
</script>

<style lang="less">
.chat-list {

}
</style>
