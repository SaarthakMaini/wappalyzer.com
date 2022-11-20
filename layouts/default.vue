<template>
  <v-app>
    <v-main>
      <Header
        :main-nav="headerNav"
        :user-nav="userNav"
        @openDrawer="$refs.drawer.open()"
      />

      <nuxt />

      <Footer :main-nav="mainNav" />
    </v-main>

    <Drawer ref="drawer" :main-nav="headerNav" :user-nav="userNav" />
  </v-app>
</template>

<script>
/* globals $crisp */

import { mapState, mapActions } from 'vuex'

import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Drawer from '~/components/Drawer.vue'
import mainNav from '~/assets/json/nav/main.json'
import userNav from '~/assets/json/nav/user.json'

export default {
  components: {
    Header,
    Footer,
    Drawer,
  },
  data() {
    return {
      mainNav,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    userNav() {
      return this.isSignedIn
        ? userNav.filter((item) =>
            this.isMember
              ? item.roles.includes(this.user.role || 'buyer')
              : true
          )
        : userNav.filter((item) =>
            !item.auth && this.isMember
              ? item.roles.includes(this.user.role || 'buyer')
              : true
          )
    },
    member() {
      return this.isMember || this.isAdmin
        ? this.user.impersonator.email
        : this.user.email
    },
    headerNav() {
      return this.mainNav.filter(({ header }) => header !== false)
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        const impersonating = this.$cookies.get('impersonate')

        if (impersonating) {
          this.signInAs(impersonating)
        } else {
          await Promise.all([this.getOrganisations(), this.getCredits()])
        }

        this.$gtm.push({ event: 'signIn', userId: this.member.sub })

        /*
        if (this.$refiner) {
          this.$refiner('identifyUser', {
            id: this.member.sub,
            email: this.member.email,
            name: this.member.name,
          })
        }
        */

        this.$cookies.set('userId', this.member.sub, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      } else {
        this.resetCredits()
      }
    },
    isLoading() {
      if (!this.isSignedIn) {
        this.resetCredits()
      }
    },
    $route() {
      this.checkChat()

      // this.checkSurvey()
    },
  },
  mounted() {
    setTimeout(() => {
      const theme =
        this.$cookies.get('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light')

      this.$vuetify.theme.dark = theme === 'dark'
    }, 1)

    this.initChat()

    // this.initSurvey()

    if (this.isSignedIn) {
      this.$gtm.push({ event: 'signIn', userId: this.member.sub })

      /*
      if (this.$refiner) {
        this.$refiner('identifyUser', {
          id: this.member.sub,
          email: this.member.email,
          name: this.member.name,
        })
      }
      */
    }

    this.updateUserAttrs()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
      getOrganisations: 'organisations/get',
      getCredits: 'credits/get',
      resetCredits: 'credits/reset',
    }),
    initChat() {
      if (typeof $crisp !== 'undefined') {
        return
      }

      const offset = new Date().getTimezoneOffset()

      if (offset >= 330 && offset <= 360) {
        return
      }

      window.$crisp = []
      window.CRISP_WEBSITE_ID = 'f2002ef6-c76c-4d05-9eb3-f67d7cb1cb68'

      const script = document.createElement('script')

      script.src = 'https://client.crisp.chat/l.js'
      script.async = 1

      document.getElementsByTagName('head')[0].appendChild(script)

      $crisp.push(['safe', true])

      this.checkChat()
    },
    async checkChat() {
      if (typeof $crisp === 'undefined') {
        return
      }

      if (!$crisp.is) {
        await new Promise((resolve) =>
          $crisp.push(['on', 'session:loaded', () => resolve()])
        )
      }

      if (this.isSignedIn) {
        $crisp.push(['set', 'user:email', [this.member.email]])
        $crisp.push(['set', 'user:nickname', [this.member.name]])
        $crisp.push(['set', 'user:company', [this.member.billingName]])
      }

      if (
        this.$route.path === '/' ||
        [
          '/account/',
          '/alerts/',
          '/api/',
          '/apikey',
          '/contact/',
          '/credits/',
          '/docs/',
          '/faq/',
          '/integrations',
          '/lists/',
          '/lookup/#bulk',
          '/lookup/lists',
          '/organisation/',
          '/orders/',
          '/paymentmethods/',
          '/plan/',
          '/pricing/',
          '/verify/#bulk',
          '/verify/lists',
        ].some((path) =>
          `${this.$route.path}${this.$route.path.endsWith('/') ? '' : '/'}${
            this.$route.hash
          }`.startsWith(path)
        )
      ) {
        //if ($crisp.is('chat:hidden')) {
        $crisp.push(['do', 'chat:show'])
        //}
      } else if ($crisp.is('chat:visible') && !$crisp.is('chat:opened')) {
        $crisp.do('chat:hide')
      }
    },
    async checkSurvey() {
      if (!this.$refiner) {
        return
      }

      if (
        ['/lists/'].some((path) =>
          `${this.$route.path}${this.$route.hash}`.startsWith(path)
        )
      ) {
        setTimeout(() => {
          this.$refiner('showForm', '86a0f240-b6cc-11ec-aee4-dfa3c2d311cf')
        }, 20000)
      } else {
        this.$refiner('closeForm', '86a0f240-b6cc-11ec-aee4-dfa3c2d311cf')
      }
    },
    initSurvey() {
      if (this.$refiner) {
        this.$refiner('setProject', '8694e9b0-b6cc-11ec-9fd8-bfb5f88dcb10')
      }
    },
  },
}
</script>
