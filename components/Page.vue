<template>
  <div>
    <Hero
      v-if="hero"
      :title="hero && hero !== true ? hero.title : meta.title"
      :subtitle="hero && hero !== true ? hero.subtitle : meta.text"
      :search="search"
    />

    <Crumbs v-if="crumbs" :crumbs="crumbNav" />

    <slot name="header" />

    <v-container class="py-10 py-sm-12">
      <Progress
        v-if="secure && !isSignedIn && isLoading"
        style="margin: 0 auto"
      />
      <SignIn v-else-if="secure && !isSignedIn" class="px-2" mode-continue />
      <v-row v-else-if="sideNav.length">
        <v-col cols="12" sm="4" lg="3" order="2" order-sm="0">
          <Credits v-if="secure && isSignedIn" />

          <SideNav :items="sideNav" />

          <v-card
            v-if="$route.path.startsWith('/docs/')"
            color="secondary"
            class="mt-4 text-center"
            flat
          >
            <v-card-text>
              <Status />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="8" lg="9">
          <PageHead
            v-if="!noHead"
            :loading="loading"
            :title="head.title"
            :subtitle="head.subtitle"
            :text="head.text"
            :image="head.image"
          >
            <slot />
          </PageHead>
          <slot v-else />
          <slot name="content" />
        </v-col>
      </v-row>
      <v-row v-else-if="narrow" justify="center" no-gutters>
        <v-col sm="10" lg="8">
          <PageHead
            v-if="!noHead"
            :loading="loading"
            :title="head.title"
            :subtitle="head.subtitle"
            :text="head.text"
            :image="head.image"
            :narrow="narrow"
          >
            <slot />
          </PageHead>
          <slot v-else />
          <slot name="content" />
        </v-col>
      </v-row>
      <template v-else>
        <PageHead
          v-if="!noHead"
          :loading="loading"
          :title="head.title"
          :subtitle="head.subtitle"
          :text="head.text"
          :image="head.image"
          :narrow="narrow"
        >
          <slot />
        </PageHead>
        <slot v-else />
        <slot name="content" />
      </template>
    </v-container>

    <slot name="footer" />

    <Subscribe v-if="!noSubscribe && (!secure || isSignedIn)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

import PageHead from '~/components/PageHead.vue'
import Subscribe from '~/components/Subscribe.vue'
import SideNav from '~/components/SideNav.vue'
import Crumbs from '~/components/Crumbs.vue'
import SignIn from '~/components/SignIn.vue'
import Credits from '~/components/Credits.vue'
import Hero from '~/components/Hero.vue'
import Progress from '~/components/Progress.vue'
import Status from '~/components/Status.vue'
import userNav from '~/assets/json/nav/user.json'
import { hero as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Hero,
    PageHead,
    Subscribe,
    SideNav,
    Status,
    Crumbs,
    SignIn,
    Credits,
    Progress,
  },
  props: {
    crumbs: {
      type: [Array, String, Boolean],
      default: () => [],
    },
    side: {
      type: Array,
      default: () => [],
    },
    seoTitle: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    head: {
      type: Object,
      default() {
        return {
          loading: this.loading,
          title: this.title,
          subtitle: '',
          text: '',
          image: '',
          meta: '',
        }
      },
    },
    noHead: {
      type: Boolean,
      default: false,
    },
    search: {
      type: Boolean,
      default: false,
    },
    noSideBar: {
      type: Boolean,
      default: false,
    },
    noSubscribe: {
      type: Boolean,
      default: false,
    },
    narrow: {
      type: Boolean,
      default: false,
    },
    hero: {
      type: [Object, Boolean],
      default: false,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      drawer: false,
      meta,
    }
  },
  head() {
    return {
      title: this.seoTitle || this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.head.meta || this.head.text || '',
        },
      ],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user }) => user.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    sideNav() {
      return this.secure && !this.noSideBar
        ? this.isSignedIn
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
        : this.side
    },
    crumbNav() {
      return [...this.crumbs, { title: this.title, to: '' }]
    },
  },
}
</script>

<style>
.iframe-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
}

.iframe-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
</style>
