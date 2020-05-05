<template>
  <div class="home-page">
    <factor-btn btn="primary" @click="showChat = !showChat">
      Show Chat
    </factor-btn>
    <factor-modal :vis.sync="showChat">
      <v-chat v-if="showChat"/>
    </factor-modal>
    <test-panel/>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { factorBtn, factorModal } from "@factor/ui"
import vChat from './../el/v-chat.vue'
import testPanel from '../test-panel.vue'

export default Vue.extend({
  name: 'home',
  components: {factorBtn, factorModal, vChat, testPanel},
  data() {
    return {
      showChat: false
    }
  },
  metaInfo: {
    title: "Home"
  }
})
</script>

<style lang="less">
.home-page {

}
</style>
