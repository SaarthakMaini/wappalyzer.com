<template>
  <div>
    <Page
      :title="title"
      :seo-title="`${title} market share, websites and contacts`"
      :crumbs="[{ title: 'Technologies', to: '/technologies' }]"
      :head="{
        title,
        subtitle: `${
          category
            ? `Tracking ${
                Object.keys(category.technologies).length
              } technologies in this category`
            : `Technology category`
        }`,
        meta: `Download a list of websites${
          category ? ` using ${category.name} technologies` : ''
        } with email addresses, phone numbers and company profiles.`,
      }"
      :hero="false"
    >
      <v-chip-group column>
        <v-chip
          v-for="{ slug, name } in category.groups"
          :key="name"
          :to="`/technologies/#${slug}`"
          color="primary"
          outlined
          small
          exact
        >
          {{ name }}
        </v-chip>
      </v-chip-group>

      <v-alert color="primary lighten-1" class="mt-6">
        <p class="subtitle-1 font-weight-medium primary--text mb-2">
          Reach out to {{ category.name }} users
        </p>

        <p class="primary--text">
          Create a list of
          {{ formatNumber(totalHostnames, true) }}
          <nuxt-link
            class="primary--text"
            :to="`/lists/?categories=${categorySlug}`"
            >websites using {{ category.name }} technology</nuxt-link
          >
          with company and contact details.
        </p>

        <v-btn
          :to="`/lists/?categories=${categorySlug}`"
          color="primary"
          class="mt-2"
          large
          depressed
        >
          <v-icon left>
            {{ mdiFilterVariant }}
          </v-icon>
          Create a lead list
        </v-btn>
      </v-alert>

      <v-divider class="my-12" />

      <h2 class="mb-2">
        <v-row class="align-center px-3">
          <v-icon color="primary" class="mr-2">
            {{ mdiFinance }}
          </v-icon>
          {{ category.name }} technologies market share
        </v-row>
      </h2>

      <p class="mb-6">
        These are the top {{ category.name }} technologies based on market share
        in {{ new Date().getFullYear() }}.
      </p>

      <v-card class="my-4">
        <v-card-text class="py-8">
          <v-row class="justify-center">
            <v-col cols="12" sm="10" md="8">
              <GChart
                type="PieChart"
                :data="marketShare"
                :options="pieChartOptions"
                width="100%"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-text class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="1">#</th>
                <th width="35%">
                  Technology
                  <v-btn
                    :disabled="sort === 'name'"
                    color="accent"
                    icon
                    x-small
                    @click="sort = 'name'"
                  >
                    <v-icon>{{ mdiChevronDown }}</v-icon>
                  </v-btn>
                </th>
                <th width="20%">Websites tracked</th>
                <th>
                  Market share
                  <v-btn
                    :disabled="sort === 'hostnames'"
                    color="accent"
                    icon
                    x-small
                    @click="sort = 'hostnames'"
                  >
                    <v-icon>{{ mdiChevronDown }}</v-icon>
                  </v-btn>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="{ name, slug, icon, hostnames } in technologies"
                :key="slug"
              >
                <td>
                  {{ Object.keys(technologies).indexOf(slug) + 1 }}
                </td>
                <td>
                  <nuxt-link
                    :to="`/technologies/${categorySlug}/${slug}/`"
                    class="body-2 d-flex align-center my-2"
                  >
                    <TechnologyIcon :icon="icon" />
                    {{ name }}
                  </nuxt-link>
                </td>
                <td v-if="hostnames >= 10000000">
                  <nuxt-link :to="`/technologies/${categorySlug}/${slug}/`">
                    10M+
                  </nuxt-link>
                </td>
                <td v-else-if="hostnames >= 50">
                  <nuxt-link :to="`/technologies/${categorySlug}/${slug}/`">
                    {{ formatNumber(hostnames, true) }}
                  </nuxt-link>
                </td>
                <td v-else>-</td>
                <td>
                  <Bar
                    :value="hostnames"
                    :max="maxHostnames"
                    :total="totalHostnames"
                  />
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <div class="text-right mb-4">
        <v-btn color="accent" small outlined @click="showAll = !showAll">
          <v-icon left>
            {{ showAll ? mdiMinus : mdiPlus }}
          </v-icon>
          {{
            showAll
              ? 'View less'
              : `View all ${formatNumber(
                  Object.keys(category.technologies).length
                )}`
          }}
        </v-btn>
      </div>

      <v-divider class="mb-12" />

      <h3 class="mb-2">{{ category.name }} technology reports</h3>

      <p>
        Create relevant {{ category.name }} technology reports to find sales
        leads or learn more about your target audience.
      </p>

      <v-card class="mb-4">
        <v-card-title class="subtitle-2"> Example reports </v-card-title>
        <v-card-text class="px-0">
          <v-simple-table dense>
            <tbody>
              <tr v-for="(list, index) in lists" :key="index">
                <td>
                  <a
                    class="d-flex align-center body-1"
                    @click="createList(list)"
                  >
                    <v-icon left>{{ mdiFileTableOutline }}</v-icon
                    ><small>{{ list.text }}</small>
                  </a>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <p class="mb-0">
        <small>
          Or,
          <nuxt-link :to="`/lists/?categories=${categorySlug}`">
            create a custom {{ category.name }} technology report</nuxt-link
          >.
        </small>
      </p>

      <template #footer>
        <Logos apps />
      </template>
    </Page>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>

    <v-dialog
      v-model="createListDialog"
      :persistent="!createlistError"
      max-width="400px"
    >
      <v-card>
        <v-card-title> Creating your list&hellip; </v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="createlistError" type="error" class="mb-0" text>
            {{ createlistError }}
          </v-alert>

          <Progress v-if="!createlistError" class="mx-auto pb-8" />
        </v-card-text>
        <v-card-actions v-if="createlistError">
          <v-spacer />
          <v-btn v-if="error" color="accent" text @click="close"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiFilterVariant,
  mdiChevronDown,
  mdiFinance,
  mdiFileTableOutline,
  mdiMinus,
  mdiPlus,
} from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
    SignIn,
    Progress,
    Logos,
    GChart,
  },
  async asyncData({ route, redirect, $axios }) {
    const { category: slug } = route.params

    try {
      return {
        category: (await $axios.get(`categories/${slug}`)).data,
      }
    } catch (error) {
      const technology = (await $axios.get(`technologies/${slug}`)).data

      redirect(
        `/technologies/${
          technology.categories.length
            ? `${technology.categories[0].slug}/`
            : ''
        }${slug}/`
      )
    }
  },
  data() {
    return {
      category: false,
      creatingList: false,
      createlistError: false,
      createListDialog: false,
      mdiFilterVariant,
      mdiChevronDown,
      mdiFinance,
      mdiFileTableOutline,
      mdiMinus,
      mdiPlus,
      showAll: false,
      signInDialog: false,
      sort: 'hostnames',
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
    pieChartOptions() {
      return {
        backgroundColor: 'transparent',
        chartArea: {
          height: '100%',
          width: '100%',
        },
        pieHole: 0.7,
        height: 250,
        sliceVisibilityThreshold: 0.01,
        enableInteractivity: false,
        pieSliceText: 'none',
        legend: {
          textStyle: {
            fontSize: 13,
            color: this.$vuetify.theme.dark ? '#FFF' : 'inherit',
          },
          position: 'labeled',
        },
      }
    },
    categorySlug() {
      return this.$route.params.category
    },
    title() {
      return this.category
        ? this.category.name
        : this.categorySlug
            .replace(/-/g, ' ')
            .replace(/^./, (s) => s.toUpperCase())
    },
    technologies() {
      if (!this.category) {
        return {}
      }

      const { technologies } = this.category
      const ordered = {}

      delete technologies['cart-functionality']

      Object.keys(technologies)
        .filter((name) => this.showAll || technologies[name].hostnames > 50)
        .sort((a, b) => {
          const order = this.sort === 'name' ? 1 : -1

          return technologies[a][this.sort] > technologies[b][this.sort]
            ? order
            : technologies[a][this.sort] < technologies[b][this.sort]
            ? -order
            : 0
        })
        .slice(0, this.showAll ? Object.keys(technologies).length : 10)
        .forEach((name) => (ordered[name] = technologies[name]))

      return ordered
    },
    marketShare() {
      if (!this.category) {
        return []
      }

      const { technologies } = this.category

      delete technologies['cart-functionality']

      return [
        ['Technology', 'Market share'],
        ...Object.values(technologies)
          .filter(({ hostnames }) => hostnames > 50)
          .sort(({ hostnames: a }, { hostnames: b }) => (a > b ? -1 : 1))
          .slice(0, 10)
          .reduce((technologies, technology) => {
            technologies.push([technology.name, technology.hostnames])

            return technologies
          }, []),
      ]
    },
    maxHostnames() {
      return (
        Object.values(this.technologies).reduce(
          (total, { hostnames }) => (total = Math.max(total, hostnames)),
          0
        ) || 1
      )
    },
    totalHostnames() {
      return (
        Object.values(this.technologies).reduce(
          (total, { hostnames }) => (total += hostnames),
          0
        ) || 1
      )
    },
    lists() {
      const categories = [
        {
          name: this.category.name,
          slug: this.category.slug,
        },
      ]

      return this.category
        ? [
            {
              text: `${this.category.name} websites in the United States`,
              query: {
                categories,
                geoIps: [{ text: 'United States', value: 'US' }],
              },
            },
            {
              text: `${this.category.name} websites in the United Kindom`,
              query: {
                categories,
                geoIps: [{ text: 'United Kingdom', value: 'GB' }],
                tlds: ['.uk'],
              },
            },
            {
              text: `Email addresses and phone numbers of ${this.category.name} users`,
              query: {
                categories,
                requiredSets: ['email', 'phone'],
              },
            },
            {
              text: `${this.category.name} websites with a .com domain`,
              query: {
                categories,
                tlds: ['.com'],
              },
            },
            {
              text: `Top 5,000 most visited ${this.category.name} websites`,
              query: {
                categories,
                subset: 5000,
              },
            },
            {
              text: `5,000 low-traffic ${this.category.name} websites`,
              query: {
                categories,
                subset: 5000,
                subsetSlice: 4,
              },
            },
          ]
        : []
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        if (this.creatingList) {
          this.createList()
        }
      }
    },
  },
  methods: {
    async createList(list = this.creatingList) {
      this.creatingList = list
      this.createError = false

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.createListDialog = true

      try {
        const { id } = (
          await this.$axios.put('lists', {
            query: {
              minAge: 0,
              maxAge: 3,
              ...list.query,
            },
          })
        ).data

        this.$router.push(`/lists/${id}/`)
      } catch (error) {
        this.createListError = this.getErrorMessage(error)
      }

      this.creatingList = false
    },
  },
}
</script>
