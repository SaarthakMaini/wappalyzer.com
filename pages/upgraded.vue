<template>
  <Page
    :title="title"
    :hero="{
      title: 'Wappalyzer has been upgraded',
      subtitle: release ? release.version : error ? '' : '...',
    }"
    :crumbs="false"
    no-head
  >
    <v-row justify="space-between" class="my-4">
      <v-col cols="12" sm="6" class="py-0">
        <v-card class="mb-12 mb-sm-4">
          <v-card-title>Changelog</v-card-title>

          <v-card-text v-if="error" class="px-0">
            <v-alert color="error" class="mx-4 mb-0" text>
              The changelog could not be loaded at this time.
            </v-alert>
          </v-card-text>
          <div
            v-if="!release && !error"
            class="d-flex justify-center py-2 pb-6"
          >
            <Progress />
          </div>
          <template v-if="release">
            <div v-for="type in ['add', 'fix', 'new']" :key="type">
              <template v-if="release.items[type].length">
                <v-card-title v-if="type === 'add'" class="subtitle-2">
                  <v-icon left>
                    {{ mdiPlusBox }}
                  </v-icon>
                  Additions
                </v-card-title>
                <v-card-title v-if="type === 'fix'" class="subtitle-2">
                  <v-icon left>
                    {{ mdiAutoFix }}
                  </v-icon>
                  Improvements
                </v-card-title>
                <v-card-title v-if="type === 'new'" class="subtitle-2">
                  <v-icon left>
                    {{ mdiStar }}
                  </v-icon>
                  Features
                </v-card-title>
                <v-card-text class="px-0">
                  <v-simple-table>
                    <tbody>
                      <tr
                        v-for="(item, index) in release.items[type]"
                        :key="index"
                      >
                        <td>{{ item }}</td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card-text>
              </template>
            </div>
          </template>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" lg="5" class="py-0">
        <v-card
          v-if="!isLoading && !isPlus"
          color="primary lighten-1 primary--text"
          class="mb-8"
          flat
        >
          <v-card-title class="subtitle-2">Get plus for $9/mo</v-card-title>
          <v-card-text class="primary--text">
            <p>
              With <v-chip color="primary" x-small outlined>PLUS</v-chip>, the
              browser extension shows company and contact information of
              websites you visit.
            </p>

            <v-btn to="/plus/" color="primary" large depressed> Sign up </v-btn>
          </v-card-text>
        </v-card>

        <div class="text-h3 mb-4">Empower your sales and marketing teams</div>

        <p class="mb-8">
          Use our tools for lead generation, market analysis and competitor
          research.
        </p>

        <UseCases class="mb-12" tall />

        <v-alert v-if="!isSignedIn" color="primary lighten-1 text-center">
          <v-btn class="primary" large depressed @click="signUpDialog = true"
            >Sign up for free</v-btn
          >
        </v-alert>
      </v-col>
    </v-row>

    <v-dialog v-model="signUpDialog" max-width="400px">
      <SignIn mode-sign-up welcome />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiPlusBox, mdiAutoFix, mdiStar } from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import UseCases from '~/components/UseCases.vue'
import SignIn from '~/components/SignIn.vue'
import G2 from '~/assets/images/awards/g2-2022-spring.svg?inline'

export default {
  components: {
    Page,
    Progress,
    UseCases,
    SignIn,
    G2,
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      isPlus: ({ credits }) => credits.plus,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
    }),
  },
  data() {
    return {
      title: 'Upgraded',
      mdiPlusBox,
      mdiAutoFix,
      mdiStar,
      release: null,
      error: false,
      signUpDialog: false,
    }
  },
  async mounted() {
    try {
      this.release = (await this.$axios.get(this.$config.RELEASE_URL)).data
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signUpDialog = false

        this.getCredits()
      }
    },
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
  },
}
</script>
