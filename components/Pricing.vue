<template>
  <div>
    <v-alert v-if="error" color="error" class="mt-4 mb-8 text-center" text>
      {{ error }}
    </v-alert>

    <div
      class="d-flex flex-row align-center body-2 font-weight-medium mb-8 mt-4 mt-md-0"
    >
      <v-spacer />
      <span class="font-weight-regular mr-2">Billing</span>
      <span @click="annually = !annually">Monthly</span>
      <v-switch v-model="annually" class="my-0 ml-4" inset hide-details />
      <span @click="annually = !annually">
        Annually <span class="font-weight-regular ml-1">(2 months free)</span>
      </span>
      <v-spacer />
    </div>

    <Matrix
      :items="plans"
      :attrs="attrs"
      button-text="Sign up"
      @select="subscribe"
    />

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import Matrix from '~/components/Matrix.vue'
import SignIn from '~/components/SignIn.vue'
import { attrs, plans } from '~/assets/json/plans.json'

export default {
  components: {
    Matrix,
    SignIn,
  },
  props: {
    billing: {
      type: String,
      default: 'monthly',
    },
  },
  data() {
    return {
      attrs,
      annually: false,
      order: false,
      error: '',
      ordering: false,
      signInDialog: false,
      subscribing: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      isMember: ({ user }) =>
        !user.admin && user.impersonator && !user.impersonator.admin,
    }),
    plans() {
      return Object.keys(plans).reduce((_plans, plan) => {
        if (plans[plan].interval === (this.annually ? 'year' : 'month')) {
          _plans[plan] = plans[plan]
        }

        plans[plan].buttonLoading = plan === this.ordering

        return _plans
      }, {})
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn && this.subscribing) {
        this.signInDialog = false

        this.subscribe(this.subscribing)
      }
    },
  },
  created() {
    this.annually = this.billing === 'annually'
  },
  methods: {
    async subscribe(plan) {
      this.order = false
      this.error = ''
      this.subscribing = plan
      this.ordering = plan

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      if (this.isMember && this.user.role !== 'admin') {
        this.error =
          "You don't have permission from the account owner to create subscriptions."

        this.ordering = false

        return
      }

      try {
        const { id } = (
          await this.$axios.put('orders', {
            product: 'Subscription',
            plan,
          })
        ).data

        this.$router.push(`/orders/${id}/`)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.ordering = false
    },
  },
}
</script>
