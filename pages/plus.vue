<template>
  <div>
    <Page :title="title" no-head narrow>
      <article>
        <h1 class="text-h1 mb-8">{{ title }}</h1>

        <v-alert v-if="error" color="error" class="mt-4 mb-8 text-center" text>
          {{ error }}
        </v-alert>

        <p class="subtitle-1">
          Wappalyzer offers tools for website profiling, market research and
          lead generation. Sign up for
          <v-chip color="primary" x-small outlined>PLUS</v-chip> to unlock
          additional features.
        </p>

        <div
          class="d-flex flex-row align-center body-2 font-weight-medium mb-6 mt-10"
        >
          <v-spacer />
          <span class="font-weight-regular mr-2">Billing</span>
          <span @click="annually = !annually">Monthly</span>
          <v-switch v-model="annually" class="my-0 ml-4" inset hide-details />
          <span @click="annually = !annually">
            Annually
            <span class="font-weight-regular ml-1">(2 months free)</span>
          </span>
          <v-spacer />
        </div>

        <Matrix
          :items="plans"
          :attrs="attrs"
          button-text="Sign up"
          class="mb-4"
          @select="subscribe"
        />

        <p class="text--disabled">
          <small>
            This plan applies to invididual technology lookups, the browser
            extension and our Android app. For full access to all our products,
            including lead lists, bulk technology lookups, CRM integrations and
            APIs, see the
            <nuxt-link to="/pricing/">pricing</nuxt-link> page.
          </small>
        </p>

        <v-divider id="lookup" class="mt-10 mb-6" />

        <h2 class="text-h2 mt-8 mb-2 d-flex">
          <v-icon color="primary" class="mr-2">
            {{ mdiLayersOutline }}
          </v-icon>

          Technology lookup
        </h2>

        <p>
          Our <nuxt-link to="/lookup/">technology lookup</nuxt-link> tool
          uncovers the technology stack of any website. Sign up for
          <v-chip color="primary" x-small outlined>PLUS</v-chip> to instantly
          see company and contact information, as well as social media profiles
          and other data points.
        </p>

        <v-row class="mt-4 mb-8">
          <v-col cols="12" sm="6">
            <v-card>
              <v-img
                src="/images/faqs/lookup-plus-1.png"
                alt="Wappalyzer technology lookup"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-img
                src="/images/faqs/lookup-plus-2.png"
                alt="Wappalyzer technology lookup"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-divider id="extension" class="mt-12 mb-6" />

        <h2 class="text-h2 mt-8 mb-2 d-flex">
          <v-icon color="primary" class="mr-2">
            {{ mdiMonitor }}
          </v-icon>
          Browser extension
        </h2>

        <p>
          Our free
          <nuxt-link to="/apps/">browser extension</nuxt-link> shows you the
          technologies used on websites you visit. With
          <v-chip color="primary" x-small outlined>PLUS</v-chip>, you can view
          available company and contact information as well as any metadata we
          find without leaving the page you're on.
        </p>

        <p>You'll have access to:</p>

        <ul class="mb-4">
          <li>Company information, such as name, size and industry</li>
          <li>Email addresses</li>
          <li>Phone numbers</li>
          <li>Social media profiles</li>
          <li>Metadata</li>
          <li>And <nuxt-link to="/docs/fields">much more</nuxt-link></li>
        </ul>

        <v-row class="mt-4 mb-8">
          <v-col cols="12" sm="6">
            <v-card>
              <v-img
                src="/images/faqs/extension.png"
                alt="Wappalyzer PLUS extension"
              />
            </v-card>
          </v-col>
          <v-col cols="12" sm="6">
            <v-card>
              <v-img
                src="/images/faqs/extension-plus.png"
                alt="Wappalyzer PLUS extension"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-divider id="android" class="mt-10 mb-6" />

        <h2 class="text-h2 mt-8 mb-2 d-flex">
          <v-icon color="primary" class="mr-2">
            {{ mdiAndroid }}
          </v-icon>
          Android app
        </h2>

        <p>
          Put Wappalyzer in your pocket! Share a website URL from your browser
          to our free
          <nuxt-link to="/apps/">Android app</nuxt-link> to see the technologies
          in use. With <v-chip color="primary" x-small outlined>PLUS</v-chip>,
          you get to see the available company and contact as well.
        </p>

        <v-card class="my-8" max-width="50%">
          <v-img
            src="/images/faqs/android-plus.png"
            alt="Wappalyzer PLUS Android app"
          />
        </v-card>
      </article>

      <template #footer>
        <Logos />
      </template>
    </Page>

    <v-dialog v-model="signInDialog" max-width="400px">
      <SignIn mode-continue mode-sign-up />
    </v-dialog>
  </div>
</template>

<script>
import { mdiMonitor, mdiLayersOutline, mdiAndroid } from '@mdi/js'
import { mapState } from 'vuex'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Matrix from '~/components/Matrix.vue'
import SignIn from '~/components/SignIn.vue'
import { attrs, plans } from '~/assets/json/plus.json'

export default {
  components: {
    Page,
    Logos,
    Matrix,
    SignIn,
  },
  data() {
    return {
      title: 'Plus features',
      attrs,
      annually: false,
      order: false,
      error: '',
      ordering: false,
      signInDialog: false,
      subscribing: false,
      mdiMonitor,
      mdiLayersOutline,
      mdiAndroid,
    }
  },
  mounted() {
    const { billing } = this.$route.query

    if (billing) {
      this.annually = billing === 'annually'

      this.$router.replace(this.$route.path)
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
