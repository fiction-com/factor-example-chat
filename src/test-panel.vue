<template>
  <div class="test-panel">
    <factor-btn btn="primary" @click="showSignIn()">
      Show Sign In
    </factor-btn>
    <factor-btn btn="primary" @click="logout()">
      Log Out
    </factor-btn>
    <factor-btn btn="primary" @click="getSomeData()">
      Get Some Data
    </factor-btn>
    <factor-btn btn="primary" @click="showFilters()">
      Log $filters to console.
    </factor-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// Component intention is just to test some factor interfaces.
import { initChat } from "./api"
import { logout, showSignIn } from "@factor/api"
import { factorBtn } from "@factor/ui"

export default Vue.extend({
  name: 'test-panel',
  components: {
    factorBtn
  },
  methods: {
    showFilters () {
      if (typeof console !== "undefined") {
        console.log('Vue.$filters', Vue.$filters)
      }
    },
    getSomeData() {
      initChat()
    },
    showSignIn() {
      showSignIn()
    },
    logout() {
      logout()
    }
  }
})
</script>
