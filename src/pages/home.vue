<template>
  <div class="home-page">
    <factor-btn btn="primary" @click="showChat = !showChat">
      Show Chat
    </factor-btn>
    <factor-btn btn="primary" @click="showSignIn()">
      Show Sign In
    </factor-btn>
    <factor-btn btn="primary" @click="logout()">
      Log Out
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
import { getSomeData } from "../api"
import { logout, showSignIn } from "@factor/api"

export default Vue.extend({
  name: 'home',
  components: {factorBtn, factorModal, vChat},
  mounted() {
    getSomeData()
  },
  data() {
    return {
      showChat: false
    }
  },
  metaInfo: {
    title: "Home"
  },
  methods: {
    showSignIn() {
      showSignIn()
    },
    logout() {
      logout()
    }
  }
})
</script>

<style lang="less">
.home-page {

}
</style>
