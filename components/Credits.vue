<template>
  <v-card v-if="isSignedIn" color="primary lighten-1" class="mb-4" flat>
    <v-card-title class="subtitle-2 primary--text">Balances</v-card-title>
    <v-card-text v-if="error">
      <v-alert color="error" class="mb-0" text>{{ error }}</v-alert>
    </v-card-text>
    <v-card-text v-else>
      <v-row align="center" class="py-2 primary--text">
        <v-col class="py-0">Credits</v-col>
        <v-col class="py-0 text-right">
          <Spinner v-if="isLoading" color="primary" />
          <template v-else>
            {{ formatNumber(credits) }}
          </template>
        </v-col>
      </v-row>
      <v-row align="center" class="py-2 primary--text">
        <v-col class="py-0">
          Free lists

          <v-tooltip v-if="freeLists.total === 0" max-width="250" right>
            <template #activator="{ on }">
              <sup>
                <v-icon color="primary" small v-on="on">{{
                  mdiHelpCircleOutline
                }}</v-icon>
              </sup>
            </template>

            Free lists are included in selected plans. See the pricing page for
            more information.
          </v-tooltip>
        </v-col>
        <v-col class="py-0 text-right">
          <Spinner v-if="isLoading" color="primary" />
          <template v-else>
            <v-tooltip v-if="freeLists.availableAt" max-width="250" top>
              <template #activator="{ on }">
                <sup>
                  <v-icon color="primary" small left v-on="on">{{
                    mdiCalendarBlank
                  }}</v-icon>
                </sup>
              </template>

              Your next free list will be available from
              {{
                formatDate(new Date(freeLists.availableAt * 1000))
              }} </v-tooltip
            >{{ formatNumber(freeLists.remaining) }} /
            {{ formatNumber(freeLists.total) }}
          </template>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mdiCalendarBlank, mdiHelpCircleOutline } from '@mdi/js'

import { mapState, mapActions } from 'vuex'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Spinner,
  },
  data() {
    return {
      mdiCalendarBlank,
      mdiHelpCircleOutline,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      credits: ({ credits: { credits } }) => credits,
      error: ({ credits: { error } }) => error,
      freeLists: ({ credits: { freeLists } }) => freeLists,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.getCredits()
      }
    },
  },
  created() {
    if (this.$store.state.user.isSignedIn && this.credits === null) {
      try {
        this.getCredits()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
  },
}
</script>
