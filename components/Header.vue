<template>
  <div>
    <v-sheet
      v-if="isAdmin && user.disabled"
      color="error white--text"
      class="pb-1 text-center"
      tile
    >
      <small>User disabled</small>
    </v-sheet>
    <v-app-bar
      class="header"
      tag="header"
      color="primary"
      height="74"
      style="z-index: 7"
      flat
    >
      <v-container>
        <v-row class="align-center">
          <v-col class="flex-grow-0 flex-shrink-1">
            <Logo dark />
          </v-col>

          <v-col class="d-none d-md-block flex-grow-1 flex-shrink-0 text-right">
            <template v-if="!search">
              <template v-for="(item, index) in mainNav">
                <v-btn
                  v-if="item.to"
                  :key="item.title"
                  :to="item.to"
                  class="white--text"
                  text
                >
                  {{ item.title }}
                </v-btn>
                <v-menu
                  v-else
                  :key="index"
                  class="text-left"
                  style="z-index: 20001"
                  offset-y
                  left
                  eager
                  attach
                >
                  <template #activator="{ on }">
                    <v-btn
                      :icon="!!item.icon"
                      class="white--text"
                      text
                      v-on="on"
                    >
                      <v-icon v-if="item.icon" dense>
                        {{ item.icon }}
                      </v-icon>
                      <template v-else>
                        {{ item.title }}
                        <v-icon dense right>
                          {{ mdi.mdiChevronDown }}
                        </v-icon>
                      </template>
                    </v-btn>
                  </template>

                  <v-list v-if="item.items" class="header__menu">
                    <div v-for="(_item, _index) in item.items" :key="_index">
                      <v-divider v-if="_index" />

                      <v-list-item
                        :href="_item.to.match(/^http/) ? _item.to : null"
                        :target="_item.to.match(/^http/) ? '_blank' : '_self'"
                        :to="_item.to.match(/^http/) ? null : _item.to"
                        color="primary"
                      >
                        <v-list-item-action v-if="_item.icon">
                          <v-icon color="primary" dense>
                            {{ mdi[_item.icon] }}
                          </v-icon>
                        </v-list-item-action>
                        <v-list-item-content class="py-4">
                          <v-list-item-title class="subtitle-2">
                            {{ _item.title }}
                          </v-list-item-title>
                          <v-list-item-subtitle
                            v-if="_item.subtitle"
                            class="header__subtitle text--disabled"
                          >
                            <small>
                              {{ _item.subtitle }}
                            </small>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-icon v-if="_item.to.match(/^http/)">
                          <v-icon dense>
                            {{ mdi.mdiOpenInNew }}
                          </v-icon>
                        </v-list-item-icon>
                      </v-list-item>
                    </div>
                  </v-list>
                </v-menu>
              </template>
              <span v-if="isLoading" class="px-4">
                <Spinner color="white" />
              </span>
              <v-menu
                v-else-if="isSignedIn"
                class="text-left"
                offset-y
                left
                eager
                attach
              >
                <template #activator="{ on }">
                  <v-btn
                    class="font-weight-regular text-left"
                    color="white"
                    text
                    v-on="on"
                  >
                    <v-icon v-if="!isAdmin && !isMember" left size="20">
                      {{ mdi.mdiAccount }}
                    </v-icon>
                    <v-icon v-else-if="isAdmin" left size="20">
                      {{ mdi.mdiLockOpen }}
                    </v-icon>
                    <v-icon v-else-if="isMember" left size="20">
                      {{ mdi.mdiDomain }}
                    </v-icon>
                    {{ user.billingName || user.name || user.email }}

                    <v-chip
                      v-if="isPro"
                      color="white"
                      class="ml-2"
                      outlined
                      x-small
                    >
                      PRO
                    </v-chip>
                    <v-chip
                      v-else-if="isPlus"
                      color="white"
                      class="ml-2"
                      outlined
                      x-small
                    >
                      PLUS
                    </v-chip>
                  </v-btn>
                </template>

                <v-sheet v-if="isMember || isAdmin" tile>
                  <v-list nav dense>
                    <v-list-item @click="signOutAs">
                      <v-list-item-icon>
                        <v-icon dense>
                          {{ mdi.mdiAccountSwitch }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{
                            impersonator.billingName ||
                            impersonator.name ||
                            impersonator.email
                          }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-divider />
                </v-sheet>

                <v-sheet
                  v-if="isSignedIn && !isMember && organisations.length"
                  tile
                >
                  <v-list nav dense>
                    <v-list-item
                      v-for="organisation in organisations"
                      :key="organisation.id"
                      @click="signInAs(organisation.organisationId)"
                    >
                      <v-list-item-icon>
                        <v-icon dense>
                          {{ mdi.mdiAccountSwitch }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ organisation.name }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                  <v-divider />
                </v-sheet>

                <v-sheet tile>
                  <v-list nav dense>
                    <v-list-item v-if="user.admin" to="/admin/">
                      <v-list-item-icon>
                        <v-icon color="success" dense>
                          {{ mdi.mdiLockOpen }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Admin</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      v-for="{ title, to, icon } in userNav"
                      :key="title"
                      :to="to"
                    >
                      <v-list-item-icon>
                        <v-icon dense>
                          {{ mdi[icon] }}
                        </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ title }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-sheet>
              </v-menu>

              <template v-else>
                <v-btn
                  color="white"
                  class="font-weight-regular"
                  @click="signInDialog = true"
                  text
                >
                  Sign in
                </v-btn>
                <v-btn
                  color="white"
                  class="mr-4"
                  outlined
                  @click="signUpDialog = true"
                >
                  Sign up free
                </v-btn>
              </template>
            </template>

            <v-scroll-x-reverse-transition>
              <div v-if="search" v-show="search" class="d-flex align-center">
                <v-spacer />

                <div style="width: 500px">
                  <Search dense />
                </div>

                <v-btn icon color="white" class="ml-2" @click="search = false">
                  <v-icon size="20">{{ mdi.mdiClose }}</v-icon>
                </v-btn>
              </div>
            </v-scroll-x-reverse-transition>

            <v-btn v-if="!search" icon color="white" @click="toggleTheme">
              <v-icon size="20">{{
                $vuetify.theme.dark ? mdi.mdiWeatherSunny : mdi.mdiWeatherNight
              }}</v-icon> </v-btn
            ><v-btn v-if="!search" icon color="white" @click="search = true">
              <v-icon size="20">{{ mdi.mdiMagnify }}</v-icon>
            </v-btn>
          </v-col>

          <v-col class="text-right d-md-none">
            <v-btn icon color="white" @click.stop="$emit('openDrawer')">
              <v-icon>{{ mdi.mdiMenu }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-in welcome />
    </v-dialog>

    <v-dialog v-model="signUpDialog" max-width="400px">
      <SignIn mode-sign-up welcome />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiChevronDown,
  mdiAccount,
  mdiMenu,
  mdiLockOpen,
  mdiAlphaCCircle,
  mdiCreditCard,
  mdiTagOutline,
  mdiCart,
  mdiFileDocumentOutline,
  mdiKeyVariant,
  mdiStar,
  mdiLogoutVariant,
  mdiDomain,
  mdiAccountSwitch,
  mdiFilterVariant,
  mdiPowerPlug,
  mdiLayersOutline,
  mdiApps,
  mdiConsole,
  mdiBellOutline,
  mdiMagnify,
  mdiClose,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiEmailCheckOutline,
} from '@mdi/js'
import Logo from '~/components/Logo.vue'
import SignIn from '~/components/SignIn.vue'
import Spinner from '~/components/Spinner.vue'
import Search from '~/components/Search.vue'

export default {
  components: {
    Logo,
    SignIn,
    Spinner,
    Search,
  },
  props: {
    hero: {
      type: [Object, Boolean],
      default: true,
    },
    mainNav: {
      type: Array,
      default: () => [],
    },
    userNav: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      signInDialog: false,
      signUpDialog: false,
      search: false,
      mdi: {
        mdiChevronDown,
        mdiAccount,
        mdiMenu,
        mdiLockOpen,
        mdiAlphaCCircle,
        mdiCreditCard,
        mdiTagOutline,
        mdiCart,
        mdiFileDocumentOutline,
        mdiKeyVariant,
        mdiStar,
        mdiLogoutVariant,
        mdiDomain,
        mdiAccountSwitch,
        mdiFilterVariant,
        mdiPowerPlug,
        mdiLayersOutline,
        mdiApps,
        mdiConsole,
        mdiBellOutline,
        mdiMagnify,
        mdiClose,
        mdiWeatherNight,
        mdiWeatherSunny,
        mdiEmailCheckOutline,
      },
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPlus: ({ credits }) => credits.plus,
      isPro: ({ credits }) => credits.pro,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.isSignedIn &&
        (user.admin || (user.impersonator && user.impersonator.admin)),
      isMember: ({ user }) =>
        user.isSignedIn &&
        !user.admin &&
        user.impersonator &&
        !user.impersonator.admin,
      impersonator: ({ user }) => user.impersonator,
      organisations: ({ organisations }) => organisations.memberOf,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false
        this.signUpDialog = false
      }
    },
    $route() {
      this.search = false
    },
  },
  methods: {
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark

      this.$cookies.set('theme', this.$vuetify.theme.dark ? 'dark' : 'light', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      })
    },
  },
}
</script>

<style>
.header .logo {
  height: 50px !important;
  width: 200px;
}

.header__menu {
  max-width: 500px;
}

.header__subtitle {
  white-space: normal !important;
}

.header .v-menu__content {
  min-width: 250px !important;
}
</style>
