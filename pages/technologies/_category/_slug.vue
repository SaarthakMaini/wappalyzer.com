<template>
  <div>
    <Page
      v-if="technology && technology.name"
      :title="title"
      :seo-title="
        technology.categories &&
        technology.categories.find(({ slug }) =>
          ['payment-processors', 'buy-now-pay-later'].includes(slug)
        )
          ? `Stores that accept ${title}`
          : technology.categories &&
            technology.categories.find(({ slug }) => slug === 'ecommerce')
          ? `Find ${title} stores`
          : technology.saas
          ? `Find ${title} customers`
          : `Websites using ${title}`
      "
      :crumbs="crumbs"
      :head="{
        meta: `Download a list of websites using ${technology.name}} with email addresses, phone numbers and LinkedIn profiles.`,
      }"
      no-head
      :hero="false"
    >
      <h1 class="d-flex align-center mt-n3">
        <TechnologyIcon :icon="technology.icon || 'default.svg'" large />

        {{ title }}
      </h1>

      <div class="d-flex align-center mb-4">
        <v-chip-group column>
          <v-chip
            v-for="{ slug: _slug, name } in technology.categories"
            :key="_slug"
            :to="`/technologies/${_slug}/`"
            color="primary"
            outlined
            small
            exact
          >
            {{ name }}
          </v-chip>

          <v-chip
            :href="technology.website"
            color="accent"
            target="_blank"
            outlined
            small
          >
            Visit {{ formatHostname(technology.website) }}
            <v-icon right x-small>
              {{ mdiOpenInNew }}
            </v-icon>
          </v-chip>

          <v-chip v-if="technology.saas" small outlined>
            Software as a service
          </v-chip>

          <v-chip v-if="technology.oss" small outlined>
            Open-source software
          </v-chip>

          <template v-if="technology.pricing">
            <v-tooltip top>
              <template #activator="{ on }">
                <v-chip
                  v-if="
                    technology.pricing.includes('low') ||
                    technology.pricing.includes('mid') ||
                    technology.pricing.includes('high')
                  "
                  small
                  outlined
                  v-on="on"
                >
                  <v-icon small>
                    {{ mdiCurrencyUsd }}
                  </v-icon>
                  <v-icon :disabled="technology.pricing.includes('low')" small>
                    {{
                      technology.pricing.includes('low')
                        ? mdiCurrencyUsdOff
                        : mdiCurrencyUsd
                    }}
                  </v-icon>
                  <v-icon
                    :disabled="
                      technology.pricing.includes('low') ||
                      technology.pricing.includes('mid')
                    "
                    small
                  >
                    {{
                      technology.pricing.includes('low') ||
                      technology.pricing.includes('mid')
                        ? mdiCurrencyUsdOff
                        : mdiCurrencyUsd
                    }}
                  </v-icon>
                </v-chip>
              </template>

              {{
                `Typically costs ${
                  technology.pricing.includes('mid')
                    ? 'less than US $1,000/mo'
                    : technology.pricing.includes('high')
                    ? 'more than US $1,000/mo'
                    : 'less than US $100/mo'
                } (indicative)`
              }}
            </v-tooltip>

            <v-chip
              v-if="technology.pricing.includes('recurring')"
              small
              outlined
            >
              Offers paid plans
            </v-chip>

            <v-chip
              v-if="technology.pricing.includes('freemium')"
              small
              outlined
            >
              Offers a free plan
            </v-chip>

            <v-chip v-if="technology.pricing.includes('poa')" small outlined>
              Price on asking
            </v-chip>

            <v-chip v-if="technology.pricing.includes('payg')" small outlined>
              Pay as you go
            </v-chip>

            <v-chip
              v-if="technology.pricing.includes('onetime')"
              small
              outlined
            >
              Accepts one-time payments
            </v-chip>
          </template>
        </v-chip-group>
      </div>

      <template v-if="technology.hostnames < 50">
        <v-row align="center">
          <v-col cols="12" sm="8">
            <p v-if="technology.description">
              {{ technology.description }}
            </p>
          </v-col>
        </v-row>

        <v-alert color="accent" class="mt-2" text>
          <p class="subtitle-1 font-weight-medium mb-2">
            No data available, yet.
          </p>

          <template
            v-if="technology.createdAt > Date.now() / 1000 - 60 * 60 * 24 * 30"
          >
            We've started tracking {{ technology.name }}. It may take a few
            weeks to collect a meaningful amount of information, which will be
            displayed here.
          </template>
          <template v-else>
            {{ technology.name }} appears to have a small userbase. Only
            technologies with considerable usage are displayed.
          </template>
        </v-alert>
      </template>
      <template v-else>
        <v-row align="center">
          <v-col cols="12" sm="8">
            <p v-if="technology.description" class="subtitle-1 mb-8">
              {{ technology.description }}
            </p>
          </v-col>
        </v-row>

        <v-alert color="primary lighten-1">
          <p class="subtitle-1 font-weight-medium primary--text mb-2">
            Reach out to {{ technology.name }}
            {{ technology.saas ? `customers` : `users` }}
          </p>

          <p class="primary--text">
            Create a list of
            <template v-if="technology.hostnames < 10000000">
              {{ formatNumber(technology.hostnames, true) }}
            </template>
            <nuxt-link
              class="primary--text"
              :to="`/lists/?technologies=${slug}`"
              >{{ technology.name }} websites</nuxt-link
            >
            with company and contact details.
          </p>

          <v-btn
            :to="`/lists/?technologies=${slug}`"
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

        <h2 class="mb-4">
          <v-row class="align-center px-3">
            <v-icon color="primary" class="mr-2">
              {{ mdiEarth }}
            </v-icon>
            Websites using {{ technology.name }}
          </v-row>
        </h2>

        <template v-if="technology.hostnames < 10000000">
          <p class="mb-6">
            These are the top websites using {{ technology.name }} based on
            traffic.
          </p>

          <v-card class="mb-4">
            <v-card-text class="px-0">
              <v-simple-table>
                <tbody>
                  <tr>
                    <th>#</th>
                    <th>Website</th>
                    <th>Traffic</th>
                  </tr>
                  <tr
                    v-for="(attributes, hostname) in technology.topHostnames"
                    :key="hostname"
                  >
                    <td width="1">
                      {{
                        Object.keys(technology.topHostnames).indexOf(hostname) +
                        1
                      }}
                    </td>
                    <td width="50%">
                      <nuxt-link :to="`/lookup/${hostname}/`">{{
                        hostname
                      }}</nuxt-link>
                    </td>
                    <td>
                      <Bar
                        :value="attributes.hits"
                        :max="maxHits"
                        :total="technology.hits"
                        class="mt-2 mt-md-0 mr-4"
                      />
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>

          <p class="mb-8">
            <small>
              Get the full list of
              <nuxt-link :to="`/lists/?technologies=${slug}`"
                >websites and companies using {{ technology.name }}</nuxt-link
              >.
            </small>
          </p>

          <h3 class="mb-2">{{ technology.name }} reports</h3>
        </template>

        <p>
          Create relevant reports for {{ technology.name }} to find sales leads
          or learn more about your target audience.
        </p>

        <v-card class="mb-4">
          <v-card-title class="subtitle-2">Example reports</v-card-title>
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

        <p>
          <small>
            Or,
            <nuxt-link :to="`/lists/?technologies=${slug}`">
              Create a custom {{ technology.name }} report</nuxt-link
            >.
          </small>
        </p>

        <template v-if="technology.hostnames < 10000000">
          <v-divider class="my-12" />

          <h2 class="mb-4">
            <v-row class="align-center px-3">
              <v-icon color="primary" class="mr-2">
                {{ mdiFinance }}
              </v-icon>
              {{ technology.name }} usage trend
            </v-row>
          </h2>

          <p class="mb-6">
            This graph shows the growth of {{ technology.name }} since
            {{ formatDate(trendStartDate, 'monthYear') }}.
          </p>

          <v-card>
            <v-card-text>
              <GChart
                type="LineChart"
                :data="trend"
                :options="lineChartOptions"
                width="100%"
              />
            </v-card-text>
          </v-card>
        </template>

        <v-divider class="my-12" />

        <h2 class="mb-4">
          <v-row class="align-center px-3">
            <v-icon color="primary" class="mr-2">
              {{ mdiMap }}
            </v-icon>
            {{ technology.name }} demographics
          </v-row>
        </h2>

        <p class="mb-10">
          A breakdown of countries and languages used by
          {{ technology.name }} websites.
        </p>

        <v-row class="mb-12">
          <v-col
            v-if="topIpCountries && topIpCountries.length"
            cols="12"
            md="6"
            class="py-0"
          >
            <v-card>
              <v-card-title class="subtitle-2">Countries</v-card-title>
              <v-card-text class="pb-8">
                <GChart
                  type="PieChart"
                  :data="topIpCountries"
                  :options="pieChartOptions"
                  width="100%"
                />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            v-if="topLanguages && topLanguages.length"
            cols="12"
            md="6"
            class="py-0"
          >
            <v-card>
              <v-card-title class="subtitle-2">Languages</v-card-title>
              <v-card-text class="pb-8">
                <GChart
                  type="PieChart"
                  :data="topLanguages"
                  :options="pieChartOptions"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="my-12" />

        <h2 class="mb-4">
          <v-row class="align-center px-3">
            <v-icon color="primary" class="mr-2">
              {{ mdiLightbulbOnOutline }}
            </v-icon>
            Alternatives to {{ technology.name }}
          </v-row>
        </h2>

        <p class="mb-6">
          These are the most popular {{ technology.name }} alternatives in
          {{ new Date().getFullYear() }}.
        </p>

        <template
          v-if="technology.alternatives && technology.alternatives.length"
        >
          <v-card class="my-4">
            <v-card-text class="px-0">
              <v-simple-table>
                <thead>
                  <tr>
                    <th width="1">#</th>
                    <th>Technology</th>
                    <th width="30%" class="text-right">Compare</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(alternative, index) in technology.alternatives"
                    :key="alternative.slug"
                  >
                    <th>
                      {{ index + 1 }}
                    </th>
                    <td>
                      <nuxt-link
                        :to="`/technologies/${alternative.categorySlug}/${alternative.slug}/`"
                        class="body-2 d-flex align-center my-2"
                        ><TechnologyIcon :icon="alternative.icon" />
                        {{ alternative.name }}</nuxt-link
                      >
                    </td>
                    <td class="text-right">
                      <small>
                        <nuxt-link
                          :to="`/compare/${technology.slug}-vs-${alternative.slug}/`"
                          style="color: inherit !important"
                          >{{ technology.name }} vs.
                          {{ alternative.name }}</nuxt-link
                        >
                      </small>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </template>

        <p>
          <small>
            See the full list of
            <nuxt-link :to="`/technologies/${categorySlug}/`"
              >{{ technology.name }} alternatives</nuxt-link
            >.
          </small>
        </p>
      </template>

      <template #footer>
        <Logos apps />
      </template>
    </Page>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>

    <v-dialog
      v-model="createListDialog"
      :persistent="!createListError"
      max-width="400px"
    >
      <v-card>
        <v-card-title>Creating your list&hellip;</v-card-title>
        <v-card-text class="pb-0">
          <v-alert v-if="createListError" type="error" class="mb-0" text>
            {{ createListError }}
          </v-alert>

          <Progress v-if="!createListError" class="mx-auto pb-8" />
        </v-card-text>
        <v-card-actions v-if="createListError">
          <v-spacer />
          <v-btn color="accent" text @click="createListDialog = false"
            >Ok</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- eslint-disable-next-line vue/no-v-html -->
    <script type="application/ld+json" v-html="JSON.stringify(jsonld)" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiFilterVariant,
  mdiOpenInNew,
  mdiMagnify,
  mdiArrowRight,
  mdiEarth,
  mdiMap,
  mdiLightbulbOnOutline,
  mdiFinance,
  mdiFountainPenTip,
  mdiCheck,
  mdiClose,
  mdiFileTableOutline,
  mdiCurrencyUsd,
  mdiCurrencyUsdOff,
} from '@mdi/js'
import { GChart } from 'vue-google-charts'

import Page from '~/components/Page.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Bar from '~/components/Bar.vue'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'
import Logos from '~/components/Logos.vue'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'

export default {
  components: {
    Page,
    TechnologyIcon,
    Bar,
    GChart,
    SignIn,
    Progress,
    Logos,
  },
  async asyncData({ route, $axios, redirect }) {
    const { category, slug } = route.params

    const technology = (await $axios.get(`technologies/${slug}`)).data || {}

    if (
      technology.categories &&
      technology.categories.length &&
      !technology.categories.some(({ slug }) => slug === category)
    ) {
      const categorySlug = technology.categories[0].slug

      redirect(`/technologies/${categorySlug}/${slug}/`)
    }

    return { technology }
  },
  data() {
    return {
      creatingList: false,
      createListError: false,
      createListDialog: false,
      mdiFilterVariant,
      mdiOpenInNew,
      mdiMagnify,
      mdiArrowRight,
      mdiEarth,
      mdiMap,
      mdiFinance,
      mdiLightbulbOnOutline,
      mdiFountainPenTip,
      mdiCheck,
      mdiClose,
      mdiFileTableOutline,
      mdiCurrencyUsd,
      mdiCurrencyUsdOff,
      signInDialog: false,
      technology: {},
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      lineChartOptions() {
        return {
          backgroundColor: 'transparent',
          chartArea: {
            height: '100%',
            width: '100%',
          },
          series: {
            1: {
              lineDashStyle: [2, 2],
              lineWidth: 2,
            },
          },
          lineWidth: 3,
          colors: ['#4608ad', '#a182d5'],
          curveType: 'function',
          enableInteractivity: false,
          hAxis: {
            baselineColor: 'none',
          },
          vAxis: {
            baselineColor: 'none',
            gridlines: { count: 0 },
          },
          legend: {
            textStyle: { color: this.$vuetify.theme.dark ? '#FFF' : 'inherit' },
            position: 'in',
          },
        }
      },
      pieChartOptions() {
        return {
          backgroundColor: 'transparent',
          chartArea: {
            height: '100%',
            width: '100%',
          },
          pieHole: 0.7,
          height: 150,
          sliceVisibilityThreshold: 0.01,
          enableInteractivity: false,
          pieSliceText: 'none',
          legend: {
            textStyle: {
              color: this.$vuetify.theme.dark ? '#FFF' : 'inherit',
              fontSize: 13,
            },
          },
        }
      },
    }),
    jsonld() {
      return {
        '@context': 'https://schema.org/',
        '@type': 'WebApplication',
        name: this.technology.name,
        about: {
          description: this.technology.description,
        },
        author: {
          '@type': 'Organization',
          url: this.technology.website,
        },
        applicationCategory:
          this.technology &&
          this.technology.categories &&
          this.technology.categories.length
            ? this.technology.categories[0].name
            : '',
      }
    },
    categorySlug() {
      return this.$route.params.category
    },
    slug() {
      return this.$route.params.slug
    },
    title() {
      return this.technology
        ? this.technology.name
        : this.slug
            .replace(/-/g, ' ')
            .replace(/(?:^|\s)\S/g, (s) => s.toUpperCase())
    },
    crumbs() {
      return [
        { title: 'Technologies', to: '/technologies/' },
        {
          title:
            this.technology && this.technology.categories
              ? this.technology.categories.find(
                  ({ slug }) => slug === this.categorySlug
                ).name
              : this.categorySlug,
          to: `/technologies/${this.categorySlug}/`,
        },
      ]
    },
    maxHits() {
      return (
        Object.values(this.technology.topHostnames || []).reduce(
          (total, { hits }) => (total = Math.max(total, hits)),
          0
        ) || 1
      )
    },
    maxHostnames() {
      return (
        Object.values(this.technology.alternatives || []).reduce(
          (total, { hostnames }) => (total = Math.max(total, hostnames)),
          0
        ) || 1
      )
    },
    totalHostnames() {
      return (
        Object.values(this.technology.alternatives || []).reduce(
          (total, { hostnames }) => (total += hostnames),
          0
        ) || 1
      )
    },
    topIpCountries() {
      if (!this.technology.topIpCountries) {
        return []
      }

      const totalHostnames = Object.keys(this.technology.topIpCountries).reduce(
        (sum, ipCountry) => sum + this.technology.topIpCountries[ipCountry],
        0
      )

      return [
        ['Country', 'Websites'],
        ...Object.keys(this.technology.topIpCountries).reduce(
          (topIpCountries, ipCountry) => {
            const hostnames = this.technology.topIpCountries[ipCountry]

            const country = countries.find(
              ({ value }) => value.toUpperCase() === ipCountry.toUpperCase()
            )

            topIpCountries.push([
              `${country ? country.text : ipCountry} (${Math.round(
                (100 / totalHostnames) * hostnames
              )}%)`,
              hostnames,
            ])

            return topIpCountries
          },
          []
        ),
      ]
    },
    topLanguages() {
      if (!this.technology.topLanguages) {
        return []
      }

      const totalHostnames = Object.keys(this.technology.topLanguages).reduce(
        (sum, language) => sum + this.technology.topLanguages[language],
        0
      )

      return [
        ['Language', 'Websites'],
        ...Object.keys(this.technology.topLanguages).reduce(
          (topLanguages, language) => {
            const hostnames = this.technology.topLanguages[language]

            let _language = language

            for (const name in languages) {
              if (typeof languages[name] === 'string') {
                if (languages[name].toUpperCase() === language.toUpperCase()) {
                  _language = name

                  break
                }
              } else {
                for (const variant in languages[name]) {
                  if (
                    languages[name][variant].toUpperCase() ===
                    language.toUpperCase()
                  ) {
                    _language = name

                    break
                  }
                }
              }
            }

            topLanguages.push([
              `${_language} (${Math.round(
                (100 / totalHostnames) * hostnames
              )}%)`,
              hostnames,
            ])

            return topLanguages
          },
          []
        ),
      ]
    },
    trendStartDate() {
      const yearMonth = [...(this.technology.trend || [])].sort(
        ({ yearMonth: a }, { yearMonth: b }) => (a > b ? 1 : -1)
      )[0].yearMonth

      const month = yearMonth.toString().slice(2, 4)
      const year = `20${yearMonth.toString().slice(0, 2)}`

      const date = new Date()

      date.setTime(0)
      date.setFullYear(year)
      date.setMonth(month)

      return date
    },
    trend() {
      return [
        ['Month', 'Websites', 'Traffic'],
        ...(this.technology.trend || []).map(
          ({ yearMonth, hostnames, hits }) => {
            const month = yearMonth.toString().slice(2, 4)
            const year = `20${yearMonth.toString().slice(0, 2)}`

            const date = new Date()

            date.setTime(0)
            date.setFullYear(year)
            date.setMonth(month)

            return [date, hostnames, hits]
          }
        ),
      ]
    },
    lists() {
      const technologies = [
        {
          slug: this.slug,
          name: this.technology.name,
          icon: this.technology.icon,
          categories: this.technology.categories,
        },
      ]

      return this.technology
        ? [
            {
              text: `${this.technology.name} websites in the United States`,
              query: {
                technologies,
                geoIps: [{ text: 'United States', value: 'US' }],
              },
            },
            {
              text: `${this.technology.name} websites in the United Kindom`,
              query: {
                technologies,
                geoIps: [{ text: 'United Kingdom', value: 'GB' }],
              },
            },
            {
              text: `Email addresses and phone numbers of ${this.technology.name} customers`,
              query: {
                technologies,
                requiredSets: ['email', 'phone'],
              },
            },
            {
              text: `${this.technology.name} websites with a .com domain`,
              query: {
                technologies,
                tlds: ['.com'],
              },
            },
            {
              text: `Top 5,000 most visited ${this.technology.name} websites`,
              query: {
                technologies,
                subset: 5000,
              },
            },
            {
              text: `5,000 low-traffic ${this.technology.name} websites`,
              query: {
                technologies,
                subset: 5000,
                subsetSlice: 4,
              },
            },
            ...(this.technology.categories || []).map((category) => ({
              text: `Top 500 websites for every technology in the category ${category.name}`,
              query: {
                categories: [category],
                subset: 500,
              },
            })),
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
      this.createListError = false

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      this.createListDialog = true

      try {
        const { id } = (
          await this.$axios.put('lists-site', {
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
