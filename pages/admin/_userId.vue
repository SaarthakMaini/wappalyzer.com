<template>
  <Page :title="title" :hero="false" no-subscribe>
    <v-alert v-if="success" type="success" text>
      {{ success }}
    </v-alert>

    <v-row>
      <v-col>
        <v-card max-width="600px">
          <v-card-title class="subtitle-2">Sign in as</v-card-title>
          <v-card-text>
            <v-alert v-if="signInError" type="error" text>
              {{ signInError }}
            </v-alert>

            <v-form :disabled="isImpersonator" @submit.prevent="signIn">
              <v-text-field
                v-model="userId"
                label="Email address or user ID"
                class="mb-4"
                required
                outlined
                dense
                hide-details="auto"
              />

              <v-btn
                :loading="signingIn"
                color="primary"
                class="mb-0"
                depressed
                @click="signIn"
              >
                Sign in
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col>
        <v-card max-width="600px">
          <v-card-title class="subtitle-2">Search</v-card-title>
          <v-card-text>
            <v-alert v-if="searchError" type="error" text>
              {{ searchError }}
            </v-alert>

            <v-form @submit.prevent="search">
              <v-text-field
                v-model="itemId"
                label="Order or list ID"
                class="mb-4"
                required
                outlined
                dense
                hide-details="auto"
              />

              <v-btn
                :loading="searching"
                color="primary"
                class="mb-0"
                depressed
                @click="search"
              >
                Search
              </v-btn>
            </v-form>
          </v-card-text>

          <template v-if="items.length">
            <v-divider />
            <v-card-text class="px-0">
              <v-simple-table>
                <tbody>
                  <tr v-for="item in items">
                    <td>
                      <a
                        @click="
                          userId = item.userId
                          signIn()
                        "
                        >{{ item.userEmail }}</a
                      >
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </template>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col>
        <v-card max-width="600px">
          <v-card-title class="subtitle-2">Credits report</v-card-title>
          <v-card-text>
            <v-alert v-if="creditsTotalsError" type="error" text>
              {{ signInError }}
            </v-alert>

            <v-form
              :disabled="isImpersonator"
              @submit.prevent="submitCreditsTotals"
            >
              <v-row>
                <v-col>
                  <v-select
                    v-model="creditsTotalsMonth"
                    label="Month"
                    :items="months"
                    class="mb-4"
                    required
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="creditsTotalsYear"
                    label="Year"
                    class="mb-4"
                    required
                    outlined
                    dense
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <v-btn
                :loading="submittingCreditsTotals"
                color="primary"
                class="mb-0"
                depressed
                @click="submitCreditsTotals"
              >
                Generate
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col> </v-col>
    </v-row>
  </Page>
</template>

<script>
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Admin',
      userId: this.$route.params.userId || '',
      itemId: '',
      signInError: false,
      searchError: false,
      success: false,
      items: [],
      signingIn: false,
      searching: false,
      submittingCreditsTotals: false,
      creditsTotalsError: false,
      creditsTotalsYear: new Date(
        Date.now() - 1000 * 60 * 60 * 24 * 30
      ).getFullYear(),
      creditsTotalsMonth:
        new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).getMonth() + 1,
      months: [
        { value: 1, text: 'January' },
        { value: 2, text: 'February' },
        { value: 3, text: 'March' },
        { value: 4, text: 'April' },
        { value: 5, text: 'May' },
        { value: 6, text: 'June' },
        { value: 7, text: 'July' },
        { value: 8, text: 'August' },
        { value: 9, text: 'September' },
        { value: 10, text: 'October' },
        { value: 11, text: 'November' },
        { value: 12, text: 'December' },
      ],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isImpersonator: ({ user }) => !!user.impersonator,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
  },
  created() {
    if ((!this.isAdmin || this.isImpersonator) && !this.$route.params.userId) {
      return this.$nuxt.error({ statusCode: 404 })
    }
  },
  methods: {
    async signIn() {
      this.signInError = false
      this.signingIn = true

      if (this.userId) {
        try {
          await this.signInAs(this.userId)

          this.userId = ''

          this.$router.push('/account/')
        } catch (error) {
          this.signInError = this.getErrorMessage(error)
        }
      }

      this.signingIn = false
    },
    async search() {
      this.searchError = false
      this.searching = true

      this.itemId = this.itemId.trim()

      if (this.itemId) {
        try {
          if (this.itemId.startsWith('lst_')) {
            this.items = (
              await this.$axios.get(`lists-site/find/${this.itemId}`)
            ).data
          } else if (/^(ord|lkp|vrf)_/.test(this.itemId)) {
            this.items = (
              await this.$axios.get(`orders/find/${this.itemId}`)
            ).data
          } else {
            throw new Error('Invalid item ID')
          }
        } catch (error) {
          this.searchError = this.getErrorMessage(error)
        }
      }

      this.searching = false
    },
    async submitCreditsTotals() {
      this.submittingCreditsTotals = true
      this.success = false
      this.creditsTotalsError = false

      try {
        await this.$axios.put(`admin/credits-totals`, {
          year: parseInt(String(this.creditsTotalsYear).slice(-2), 10),
          month: this.creditsTotalsMonth,
        })

        this.scrollToTop()

        this.success = "Export starting, you'll get an email when it's ready."
      } catch (error) {
        this.creditsTotalsError = this.getErrorMessage(error)
      }

      this.submittingCreditsTotals = false
    },
  },
}
</script>
