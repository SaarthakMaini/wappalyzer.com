<template>
  <Page
    :title="title"
    :seoTitle="seoTitle"
    :head="meta"
    :crumbs="[{ title: 'Technology lookup', to: '/lookup/' }]"
    no-head
  >
    <SignIn
      v-if="!isLoading && !isSignedIn && signInDialog"
      v-model="signInDialog"
      class="px-2 mb-4"
      mode-sign-up
      mode-continue
    />
    <h1 v-else class="mb-4 mt-n3">
      {{ title }}
    </h1>

    <v-alert v-if="error" type="info" class="mt-12" prominent text>
      {{ error }}
    </v-alert>

    <template #content>
      <template v-if="!error && (!signInDialog || isSignedIn || isLoading)">
        <v-row>
          <v-col cols="12" sm="6">
            <h3 class="mb-4">Technology stack</h3>

            <template v-if="isLoading || (!signInDialog && loading)">
              <v-card
                v-for="index in [0, 1, 2]"
                class="mb-4"
                :key="index"
                :outlined="!$vuetify.theme.dark"
              >
                <v-card-text>
                  <v-skeleton-loader type="card-heading" />
                  <v-row>
                    <v-col>
                      <v-skeleton-loader type="list-item-avatar" />
                    </v-col>
                    <v-col>
                      <v-skeleton-loader type="list-item-avatar" />
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </template>
            <div
              v-else-if="technologies.length"
              v-for="category in categorised"
              :key="category.slug"
            >
              <v-card class="mb-4" :outlined="!$vuetify.theme.dark">
                <v-hover v-slot="{ hover }">
                  <v-sheet
                    :color="
                      $vuetify.theme.dark ? 'primary lighten-1' : 'secondary'
                    "
                  >
                    <v-card-title class="subtitle-2" style="line-height: 1rem">
                      <nuxt-link
                        :class="hover ? '' : 'text-decoration-none'"
                        :style="hover ? '' : 'color: inherit !important'"
                        :to="`/technologies/${category.slug}`"
                      >
                        {{ category.name }}
                      </nuxt-link>
                    </v-card-title>
                  </v-sheet>
                </v-hover>

                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="{
                        name,
                        slug,
                        categories,
                        versions,
                        icon,
                      } in category.technologies"
                      :key="name"
                      cols="12"
                      sm="6"
                    >
                      <nuxt-link
                        :to="`/technologies/${category.slug}/${slug}/`"
                        class="body-2 text-decoration-none"
                      >
                        <v-hover v-slot="{ hover }">
                          <v-card flat>
                            <v-card-text class="d-flex align-center pa-0">
                              <TechnologyIcon :icon="icon" large white />

                              <div
                                class="ml-2 d-flex align-center text-decoration-none"
                              >
                                <span :class="hover ? 'accent--text' : ''">
                                  {{ name }}
                                </span>

                                <v-chip
                                  v-if="versions.length"
                                  class="text--disabled ml-1"
                                  color="secondary"
                                  small
                                  label
                                >
                                  {{ versions.slice(-1, 1).pop() }}
                                </v-chip>
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </nuxt-link>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </div>
            <v-alert v-else type="info" prominent text
              >No technologies found.</v-alert
            >
          </v-col>

          <v-col cols="12" sm="6">
            <h3 class="d-flex align-center mb-4">About</h3>

            <v-card
              v-if="!isLoading && !isPlus"
              color="primary lighten-1 primary--text"
              class="mb-4 pb-2"
              flat
              tile
            >
              <v-card-title class="subtitle-2">Get plus for $9/mo</v-card-title>
              <v-card-text class="primary--text">
                <p>
                  Get <v-chip color="primary" x-small outlined>PLUS</v-chip> to
                  include company and contact details in technology lookups.
                </p>

                <v-btn
                  to="/plus/"
                  color="primary"
                  class="mb-n2"
                  large
                  depressed
                >
                  Sign up
                </v-btn>
              </v-card-text>
            </v-card>

            <v-card
              v-if="isLoading || (!signInDialog && loading)"
              class="mb-4"
              :outlined="!$vuetify.theme.dark"
            >
              <v-card-text>
                <v-skeleton-loader type="article, article " />
              </v-card-text>
            </v-card>
            <template
              v-else-if="Object.keys(attributes).length || keywords.length"
            >
              <Attributes
                v-if="Object.keys(attributes).length"
                :hostname="attributes"
                :masked-sets="maskedSets"
              />

              <v-card
                v-if="keywords && keywords.length"
                class="mb-4"
                :outlined="!$vuetify.theme.dark"
              >
                <v-sheet
                  :color="
                    $vuetify.theme.dark ? 'primary lighten-1' : 'secondary'
                  "
                >
                  <v-card-title class="subtitle-2">Keywords</v-card-title>
                </v-sheet>

                <v-card-text>
                  <v-chip-group column>
                    <v-chip
                      v-for="keyword in keywords"
                      :key="keyword"
                      :to="`/websites/${keyword}/`"
                      color="accent--text"
                      outlined
                      label
                    >
                      {{ keyword }}
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </template>
            <v-alert v-else type="info" prominent text
              >No information availably yet. Please check back soon.</v-alert
            >
          </v-col>
        </v-row>
      </template>
    </template>

    <template #footer>
      <Logos apps />
    </template>
  </Page>
</template>

<script>
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Attributes from '~/components/Attributes.vue'
import SignIn from '~/components/SignIn.vue'
import Logos from '~/components/Logos.vue'
import { lookup as meta } from '~/assets/json/meta.json'
import sets from '~/assets/json/sets.json'

function getFullUrl(url) {
  if (!url) {
    return null
  }

  if (url.startsWith('http')) {
    return url
  }

  let fullUrl

  try {
    new URL(url) // eslint-disable-line no-new

    return url
  } catch (error) {
    if (url.includes('.')) {
      if (url.startsWith('www.')) {
        fullUrl = `https://${url}`
      } else {
        fullUrl = `https://${url.split('.').length > 2 ? '' : 'www.'}${url}`
      }

      new URL(fullUrl) // eslint-disable-line no-new

      return fullUrl
    }
  } finally {
    // Continue
  }

  return null
}

export default {
  components: {
    Page,
    TechnologyIcon,
    Attributes,
    SignIn,
    Logos,
  },
  async asyncData({
    route,
    error: errorHandler,
    $axios,
    store: {
      state: {
        user: { isSignedIn },
      },
    },
  }) {
    const { url } = route.params

    const fullUrl = getFullUrl(url)

    if (fullUrl) {
      let { hostname } = new URL(fullUrl)

      hostname = hostname.replace(/^www\./, '')

      const title = hostname
      const seoTitle = `Technologies used on ${hostname}`

      const response = {
        hostname,
        title,
        seoTitle,
        fullUrl,
        loading: false,
        maskedSets: [],
        technologies: [],
        attributes: [],
        keywords: [],
      }

      try {
        const { maskedSets, technologies, attributes, keywords } = (
          await $axios.get(
            `lookup-site${isSignedIn ? '' : '/public'}/${encodeURIComponent(
              fullUrl
            )}`
          )
        ).data

        return {
          ...response,
          maskedSets,
          technologies,
          attributes: Object.keys(attributes)
            .filter((key) =>
              Array.isArray(attributes[key])
                ? attributes[key].length
                : attributes[key]
            )
            .reduce(
              (_attributes, key) => ({
                ..._attributes,
                [key]: attributes[key],
              }),
              {}
            ),
          keywords,
          loading: !isSignedIn,
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            return {
              ...response,
              signInDialog: true,
              loading: true,
            }
          } else if ([400, 404].includes(error.response.status)) {
            return {
              ...response,
              error: error.response.data,
            }
          }
        }

        errorHandler(error)
      }
    } else if (url) {
      const title = url

      return {
        hostname: url,
        title,
        seoTitle: title,
      }
    }
  },
  data() {
    return {
      error: false,
      loading: true,
      meta,
      sets,
      attributes: {},
      keywords: [],
      maskedSets: [],
      url: '',
      signInDialog: false,
      technologies: [],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isPlus: ({ credits }) => credits.plus,
    }),
    categorised() {
      return Object.values(
        this.technologies.reduce((categories, technology) => {
          technology.categories.forEach((category) => {
            categories[category.slug] = categories[category.slug] || {
              ...category,
              technologies: [],
            }

            categories[category.slug].technologies.push(technology)
          })

          return categories
        }, {})
      )
        .sort(({ name: a }, { name: b }) => (a > b ? 1 : -1))
        .sort(({ priority: a }, { priority: b }) => (a > b ? 1 : -1))
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        if (this.loading) {
          try {
            ;({
              maskedSets: this.maskedSets,
              technologies: this.technologies,
              attributes: this.attributes,
              keywords: this.keywords,
            } = (
              await this.$axios.get(
                `lookup-site/${encodeURIComponent(this.fullUrl)}`
              )
            ).data)
          } catch (error) {
            this.error = error.response.data
          }
        }
      }

      this.loading = false
    },
  },
  async mounted() {
    const path = `/lookup/${this.hostname}/`

    if (this.hostname && this.$route.path !== path) {
      this.$router.replace(path)
    }
  },
}
</script>
