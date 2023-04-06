<template>
  <div>
    <v-select
      ref="results"
      v-model="selection"
      :items="results"
      :append-icon="mdiMagnify"
      :loading="!!(loading && query)"
      class="mb-4"
      placeholder="Find a technology"
      hide-details="auto"
      return-object
      outlined
      dense
      @change="submit"
      @focus="focus"
    >
      <template #prepend-item>
        <v-form class="search" @submit.prevent="search">
          <v-text-field
            ref="search"
            v-model="query"
            class="pt-2 mx-4"
            :placeholder="
              noCategories ? `E.g. Shopify` : `E.g. ecommerce or Shopify`
            "
            :append-icon="mdiMagnify"
            :loading="!!(loading && query)"
            outlined
            dense
            required
            hide-details="auto"
            @click:append="search"
          />
        </v-form>

        <v-alert v-if="error" color="error" class="ma-4" text>
          {{ error }}
        </v-alert>

        <v-divider class="mt-4 mb-2" />

        <div
          v-if="!results.length && !error"
          class="pt-1 pb-2 px-4 text--disabled"
        >
          <small v-if="query && !loading">
            Can't find what you're looking for?
            <a href="/technologies/suggest" target="_blank"
              >Suggest a new technology</a
            >.
          </small>
          <small v-else>Type something...</small>
        </div>
      </template>

      <template #selection="{ item }">
        {{ item.name }}
      </template>

      <template #item="{ item }">
        <div v-if="item.type === 'technology'" class="d-flex align-center py-2">
          <TechnologyIcon :icon="item.icon" />
          <span>{{ item.name }}</span>
        </div>
        <template v-else>
          <v-row>
            <v-col>{{ item.name }}</v-col>
            <v-col class="text-right">
              <small>{{ item.technologiesCount }} technologies</small>
            </v-col>
          </v-row>
        </template>
      </template>

      <template #no-data>
        <div />
      </template>
    </v-select>
  </div>
</template>

<script>
import { mdiMagnify } from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    TechnologyIcon,
    Progress,
  },
  props: {
    noCategories: {
      type: Boolean,
      default: false,
    },
    noLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      error: '',
      loading: false,
      mdiMagnify,
      query: '',
      searchTimeout: null,
      selection: false,
      technologies: [],
      categories: [],
      results: [],
    }
  },
  watch: {
    query() {
      clearTimeout(this.searchTimeout)

      this.searchTimeout = setTimeout(() => this.search(), 300)
    },
  },
  methods: {
    async search() {
      this.error = ''
      this.results = []

      const match = this.query.toLowerCase().replace(/[^a-z0-9]/, '')

      const categories = this.categories.filter(({ name }) =>
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/, '')
          .includes(match)
      )

      if (categories.length <= 5) {
        this.results.push(
          ...categories.map((category) => ({
            type: 'category',
            ...category,
          }))
        )
      }

      const technologies = this.technologies.filter(({ name }) =>
        name
          .toLowerCase()
          .replace(/[^a-z0-9]/, '')
          .includes(match)
      )

      if (technologies.length <= 50) {
        this.results.push(
          ...technologies.map((technology) => ({
            type: 'technology',
            ...technology,
          }))
        )
      }

      this.results.sort((a, b) => {
        if (this.query.toLowerCase().trim() === a.name.toLowerCase().trim()) {
          return -1
        }

        if (this.query.toLowerCase().trim() === b.name.toLowerCase().trim()) {
          return 1
        }

        if (
          a.name
            .toLowerCase()
            .trim()
            .startsWith(this.query.toLowerCase().trim())
        ) {
          return -1
        }

        if (
          b.name
            .toLowerCase()
            .trim()
            .startsWith(this.query.toLowerCase().trim())
        ) {
          return 1
        }

        return a.name > b.name ? 1 : -1
      })
    },
    clear() {
      this.$nextTick(() => {
        this.$refs.results && this.$refs.results.blur()

        this.error = ''
        this.query = ''
        this.loading = false
        this.selection = false
        this.results = []
      })
    },
    submit(item) {
      if (!this.noLoading) {
        this.loading = true
      }

      this.$refs.results.blur()

      this.$emit('select', item)
    },
    async focus() {
      this.query = ''
      this.loading = false

      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs.search) {
            this.$refs.search.$el.querySelector('input').focus()
          }
        }, 300)
      })

      if (!this.technologies.length) {
        this.loading = true

        this.technologies = (await this.$axios.get('technologies')).data

        this.loading = false

        this.categories = this.noCategories
          ? []
          : this.technologies.reduce((_categories, { categories }) => {
              categories.forEach((category) => {
                const _category = _categories.find(
                  ({ slug }) => slug === category.slug
                )

                if (!_category) {
                  _categories.push({
                    ...category,
                    technologiesCount: 1,
                  })
                } else {
                  _category.technologiesCount++
                }
              })

              return _categories
            }, [])

        this.search()
      }
    },
  },
}
</script>

<style>
.search__results {
  max-height: 300px;
  overflow-y: auto;
}
</style>
