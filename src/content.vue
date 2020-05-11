<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <div class="home">
          <router-link to="/" exact>
            <factor-logo/>
          </router-link>
        </div>
        <div class="nav" >
          <a class="link" v-if="!currentUser" @click="showSignIn()">
            Sign In
          </a>
          <a class="link" v-else @click="logout()">
            Log Out
          </a>
        </div>
        <div class="alt">
          <a
            class="github"
            href="https://github.com/fiction-com/factor-example-chat"
            target="_blank"
            rel="noopener"
          >
            <factor-icon icon="fab fa-github" />
          </a>
          <a
            class="github"
            href="https://factor.dev"
            target="_blank"
            rel="noopener"
          >Built with Factor</a>
        </div>
      </nav>
    </header>
    <transition name="fade" mode="out-in">
      <router-view class="view" />
    </transition>
  </div>
</template>

<script >
import Vue from "vue"
import { factorIcon } from "@factor/ui"
import { logout, showSignIn, currentUser } from "@factor/api"
import factorLogo from './el/factor-logo.vue'

export default Vue.extend({
  components: { factorIcon, factorLogo },
  metaInfo() {
    return {
      titleTemplate: "%s | Factor Example",
      image: require("./favicon.png")
    }
  },
  methods: {
    showSignIn() {
      showSignIn()
    },
    logout() {
      logout()
    }
  },
  computed: {
    currentUser () {
      return currentUser()
    }
  }
})
</script>

<style lang="less">
// Set site wide CSS variables
// Many of these are standard and used by plugins/themes also
html.factor-app {
  @import "~@factor/ui/css/standard-form.less";
  --color-text: #34495e;
  --color-primary: #14d96e;
  --font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-family: var(--font-family-primary);
  --font-weight-normal: 500;
  --font-weight-bold: 700;
  --color-bg: #ffffff;
  --color-border: #eee;
  font-size: 16px; // 1rem
  font-weight: var(--font-weight-normal);
  background-color: var(--color-bg);
  margin: 0;
  padding-top: 55px;
  color: var(--color-text);
  overflow-y: scroll;

  a {
    color: var(--color-text);
    text-decoration: none;
  }

  .header {
    background-color: var(--color-primary);
    position: fixed;
    z-index: 999;

    top: 0;
    left: 0;
    right: 0;
    font-weight: var(--font-weight-semibold, 600);
    .inner {
      max-width: 800px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0px auto;
      padding: 12px 5px;
    }

    a {
      svg.logo {
        width: 1.5rem;
        height: 1.5rem;
        transform: translate(-0.1rem, -0.1rem);
      }
      color: #fff;
      line-height: 1.5em;
      transition: color 0.15s ease;
      display: inline-block;
      vertical-align: middle;

      margin-right: 1.8em;
      border-radius: 5px;
      padding: 0.2rem 0.5rem;
      &:hover,
      &.router-link-active {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
      }

      &:nth-child(6) {
        margin-right: 0;
      }
    }

    .link {
      cursor: pointer;
    }

    .github {
      color: #fff;
      margin: 0;
      float: right;
    }
  }

  .logo {
    display: inline-block;
    vertical-align: middle;
  }

  .view {
    max-width: 800px;
    margin: 0 auto;
    position: relative;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  @media (max-width: 860px) {
    .header .inner {
      padding: 15px 30px;
    }
  }

  @media (max-width: 600px) {
    .header {
      .inner {
        padding: 8px;
      }

      a {
        margin-right: 0.25rem;
        padding: 0.1rem 0.5rem;
      }

      .github {
        display: none;
      }
    }
    .news-view {
      padding-top: 0;
    }
    .news-list-nav {
      top: 0;
      position: relative;
    }
  }
}
</style>
