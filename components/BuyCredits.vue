<template>
  <div>
    <v-alert v-if="error" type="error" class="mx-4" text>
      {{ error }}
    </v-alert>

    <div class="d-flex pa-4 pt-6">
      <div class="flex-grow-1 text-center body-2" style="width: 50%">
        Credits
        <div class="font-weight-medium text-h6">
          {{ credits[selection].toLocaleString() }}
        </div>
      </div>
      <v-divider vertical />
      <div class="flex-grow-1 text-center body-2" style="width: 50%">
        Price
        <div class="font-weight-medium text-h6">
          {{ formatCurrency(creditsToCents(credits[selection]) / 100) }}
        </div>
      </div>
    </div>
    <v-card-text class="mt-6">
      <v-slider
        v-model="selection"
        :max="bundles.length - 1"
        :min="0"
        :tick-labels="labels"
        tick-size="0"
        thumb-label="always"
        track-color="secondary darken-1"
      >
        <template v-slot:thumb-label>
          <v-icon dark>{{ mdiUnfoldMoreVertical }}</v-icon>
        </template>
      </v-slider>
    </v-card-text>
    <v-card-text class="text-center pb-8">
      <v-btn
        class="primary"
        large
        depressed
        :loading="submitting"
        @click.prevent="submit"
      >
        <v-icon left>
          {{ mdiAlphaCCircle }}
        </v-icon>
        Buy credits
      </v-btn>
    </v-card-text>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-sign-up />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiAlphaCCircle, mdiUnfoldMoreVertical } from '@mdi/js'

import SignIn from '~/components/SignIn.vue'

const bundles = [
  { value: 5000, text: '5K' },
  { value: 10000, text: '10K' },
  { value: 50000, text: '50K' },
  { value: 100000, text: '100K' },
  { value: 200000, text: '200K' },
  { value: 500000, text: '500K' },
  { value: 1000000, text: '1M' },
]

export default {
  components: {
    SignIn,
  },
  data() {
    return {
      signInDialog: false,
      mdiAlphaCCircle,
      mdiUnfoldMoreVertical,
      bundles,
      labels: bundles.map(({ text }) => text),
      credits: bundles.map(({ value }) => value),
      selection: 1,
      submitting: false,
      error: null,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn && this.signInDialog) {
        this.signInDialog = false

        if (this.submitting) {
          this.submit()
        }
      }
    },
    signInDialog() {
      if (!this.isSignedIn && !this.signInDialog) {
        this.submitting = false
      }
    },
  },
  methods: {
    async submit() {
      this.error = ''
      this.submitting = true

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      try {
        const order = (
          await this.$axios.put('orders', {
            product: 'Credits',
            credits: this.bundles[this.selection].value,
          })
        ).data

        this.$router.push(`/orders/${order.id}/`)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.submitting = false
    },
  },
}
</script>
