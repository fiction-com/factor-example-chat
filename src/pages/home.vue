<template>
  <div class="home-page">
    <factor-btn btn="primary" @click="showChat = !showChat">
      Show Chat
    </factor-btn>
    <factor-modal :vis.sync="showChat">
      <v-chat/>
    </factor-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorModal } from "@factor/ui"
import vChat from './../el/v-chat.vue'

export default Vue.extend({
  name: 'home',
  components: {factorBtn, factorModal, vChat},
  data() {
    return {
      showChat: false,
    }
  },
  metaInfo: {
    title: "Home"
  },
})
</script>

<style lang="less">
.home-page {

}
</style>
