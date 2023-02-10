<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Orders', to: '/orders/' }]"
    :loading="!order && !error"
    secure
  >
    <v-alert v-if="success" type="success" border="left" text prominent>
      {{ success }}
    </v-alert>

    <v-alert
      v-if="error"
      type="error"
      border="left"
      :icon="mdiAlertOctagonOutline"
      text
      prominent
    >
      {{ error }}
    </v-alert>

    <template v-if="order">
      <template v-if="order.status === 'Open'">
        <v-alert type="info" border="left" text prominent>
          Your order has been created. Please make payment below to complete the
          purchase.
        </v-alert>

        <v-alert
          v-if="order.product === 'Subscription' && isPlus"
          type="warning"
          border="left"
          text
          prominent
        >
          You current plan will be cancelled immediately but you'll keep your
          remaining credits.
        </v-alert>
      </template>

      <template v-if="order.status === 'Pending'">
        <v-alert type="warning" border="left" text prominent>
          <p>
            Your card could not be charged automatically, please use the link
            below to complete the payment. An additional step may be required by
            your card issuer to authorise the transaction.
          </p>

          <v-btn
            :href="order.invoiceUrl"
            color="warning"
            target="_blank"
            depressed
          >
            Confirm payment

            <v-icon right>
              {{ mdiArrowRight }}
            </v-icon>
          </v-btn>
        </v-alert>
      </template>

      <template v-if="order.status === 'Complete'">
        <template v-if="order.product === 'Subscription'">
          <v-alert type="success" border="left" text prominent>
            Thank you for your payment, your subscription has been created.

            <div
              v-if="order.plan && order.plan.id.startsWith('credits_plus')"
              class="mt-2"
            >
              To enable Plus features in the browser extension,
              <nuxt-link to="/apikey/">create an API key</nuxt-link>
              and add it in the 'More info' tab.
            </div>
          </v-alert>

          <v-btn
            to="/plan/"
            color="primary lighten-1"
            class="mr-2 mb-4 primary--text"
            depressed
          >
            <v-icon left>{{ mdiTagOutline }}</v-icon
            >Manage plan
          </v-btn>
        </template>

        <v-alert
          v-if="order.product === 'Credits'"
          type="success"
          border="left"
          text
          prominent
        >
          Thank you for your payment, credits have been added to your balance.
        </v-alert>
      </template>

      <v-btn
        v-if="
          (order.status === 'Pending' && order.invoiceUrl) ||
          order.status === 'Complete'
        "
        :href="order.status === 'Pending' ? order.invoiceUrl : undefined"
        :to="order.status === 'Complete' ? `/invoices/${order.id}` : undefined"
        :target="order.status === 'Pending' ? '_blank' : undefined"
        class="mr-2 mb-4"
        depressed
      >
        <v-icon left>
          {{ mdiFileDocumentOutline }}
        </v-icon>
        Invoice
      </v-btn>

      <v-card class="mb-4">
        <v-card-text class="px-0 pb-0">
          <v-simple-table>
            <tbody>
              <tr>
                <th width="30%">Status</th>
                <td class="d-flex align-center">
                  <v-chip
                    :color="
                      order.status === 'Complete'
                        ? 'success'
                        : order.status === 'Pending'
                        ? 'warning'
                        : 'accent'
                    "
                    label
                    outlined
                    small
                  >
                    {{ order.status }}
                  </v-chip>
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>
                  {{ formatDate(new Date(order.createdAt * 1000)) }}
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <v-divider />

        <v-card-title>
          {{ order.product }}
        </v-card-title>

        <v-card-text class="px-0">
          <v-simple-table v-if="order.product === 'Subscription'">
            <tbody>
              <tr>
                <th width="30%">Plan</th>
                <td>
                  {{ order.plan.name }}
                </td>
              </tr>
              <tr>
                <th>Billing cycle</th>
                <td>
                  {{ order.plan.interval === 'year' ? 'Annually' : 'Monthly'
                  }}<small v-if="order.plan.interval === 'year'" class="ml-1">
                    (<nuxt-link
                      :to="{ path: '/pricing', query: { billing: 'monthly' } }"
                      >change to monthly</nuxt-link
                    >)
                  </small>
                </td>
              </tr>
            </tbody>
          </v-simple-table>

          <v-simple-table v-if="order.product === 'Lead list'">
            <tbody>
              <tr v-if="order.listId">
                <th width="30%">ID</th>
                <td>
                  <nuxt-link :to="`/lists/${order.listId}`">{{
                    order.listId
                  }}</nuxt-link>
                </td>
              </tr>
            </tbody>
          </v-simple-table>

          <v-simple-table
            v-if="
              ['Technology lookup', 'Email verification'].includes(
                order.product
              )
            "
          >
            <tbody>
              <tr>
                <th v-if="order.product === 'Technology lookup'" width="30%">
                  Websites
                </th>
                <th v-if="order.product === 'Email verification'" width="30%">
                  Email addresses
                </th>
                <td>
                  {{ formatNumber(order.bulk.rows) }}
                </td>
              </tr>
              <tr
                v-if="order.product === 'Technology lookup' && order.bulk.live"
              >
                <th>Live scan</th>
                <td>
                  <v-icon color="primary">
                    {{ mdiCheckboxMarked }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>

          <v-simple-table v-if="order.product === 'Credits'">
            <tbody>
              <tr>
                <th width="30%">Credits</th>
                <td>
                  {{ formatNumber(order.credits) }}
                </td>
              </tr>
              <tr v-if="order.credits >= 5000">
                <td>
                  <nuxt-link to="/pro/"
                    ><v-chip
                      to="/pro/"
                      color="accent"
                      class="mr-1"
                      x-small
                      outlined
                      >PRO</v-chip
                    >features</nuxt-link
                  >
                </td>
                <td>
                  <v-icon color="primary">
                    {{ mdiCheckboxMarked }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>

        <template
          v-if="!isMember && !['Insufficient', 'Failed'].includes(order.status)"
        >
          <v-divider />

          <v-card-title>Price</v-card-title>

          <v-card-text class="px-0">
            <v-simple-table>
              <tbody>
                <tr>
                  <th width="30%">Subtotal</th>
                  <td>
                    {{
                      formatCurrency(order.subtotal / 100, order.currency, true)
                    }}
                  </td>
                </tr>
                <tr
                  v-if="
                    order.discount ||
                    order.coupon ||
                    (order.status === 'Open' &&
                      order.product === 'Subscription')
                  "
                >
                  <th>Discount</th>
                  <td v-if="order.discount">
                    {{
                      formatCurrency(
                        order.discount / 100,
                        order.currency,
                        true
                      )
                    }}<v-chip
                      v-if="order.coupon"
                      class="ml-2"
                      color="success lighten-5 success--text"
                      label
                      small
                      :close="order.status === 'Open'"
                      :disabled="savingCoupon"
                      @click:close="saveCoupon('')"
                      >{{ order.coupon }}</v-chip
                    >
                  </td>
                  <td
                    v-else-if="
                      order.status === 'Open' &&
                      order.product === 'Subscription'
                    "
                  >
                    <a
                      href="#"
                      class="text--disabled"
                      @click.prevent="couponDialog = true"
                      >Enter promo code</a
                    >
                  </td>
                </tr>
                <tr>
                  <th>
                    Tax ({{
                      order.taxPercent &&
                      user.billingCountry &&
                      user.billingCountry.toLowerCase() === 'au'
                        ? 'GST '
                        : ''
                    }}{{ order.taxPercent }}%)
                  </th>
                  <td>
                    {{ formatCurrency(order.tax / 100, order.currency, true) }}
                  </td>
                </tr>
                <tr>
                  <th>
                    Total {{ order.status === 'Open' ? 'payable now' : '' }}
                  </th>
                  <td>
                    <span class="font-weight-bold">
                      {{
                        formatCurrency(order.total / 100, order.currency, true)
                      }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
        </template>

        <template v-if="order.status === 'Open'">
          <v-divider />

          <v-card-title>Billing</v-card-title>
          <v-card-text class="px-0 pb-0">
            <v-alert v-if="accountSuccess" type="success" class="mx-4" text>
              {{ accountSuccess }}
            </v-alert>
            <v-alert
              v-if="!user.billingEmail"
              color="info"
              class="mt-0 mx-4"
              text
            >
              No billing details provided.
            </v-alert>
            <v-simple-table v-else>
              <tbody>
                <tr>
                  <th width="30%">Name</th>
                  <td>{{ user.billingName }}</td>
                </tr>
                <tr>
                  <th>Email address</th>
                  <td>{{ user.billingEmail }}</td>
                </tr>
                <tr>
                  <th>Address</th>
                  <td>
                    {{ billingAddress }}
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="billingDialog = true">
              <v-icon left>
                {{ mdiPencil }}
              </v-icon>
              Edit details
            </v-btn>
          </v-card-actions>

          <v-divider />

          <v-card-title v-if="!isMember">Payment</v-card-title>

          <v-card-text class="pa-0">
            <div v-if="!cardsLoaded" class="d-flex justify-center pt-2 pb-6">
              <Progress />
            </div>

            <CreditCards
              mode-select
              @load="cardsLoaded = true"
              @select="(id) => (stripePaymentMethod = id)"
            />

            <v-divider />

            <div class="d-flex justify-center py-8">
              <v-btn
                v-if="!order.taxPercent || order.product === 'Subscription'"
                :loading="paying"
                :disabled="
                  !stripePaymentMethod || !user.billingEmail || !order.total
                "
                color="primary"
                large
                depressed
                @click="pay"
              >
                <v-icon left>
                  {{ mdiCreditCard }}
                </v-icon>
                Pay now
              </v-btn>
              <v-btn
                v-if="order.product !== 'Subscription'"
                :loading="invoicing"
                :disabled="!user.billingEmail || !order.total"
                class="ml-4"
                color="primary lighten-1 primary--text"
                large
                depressed
                @click="invoice"
              >
                <v-icon left>
                  {{ mdiEmail }}
                </v-icon>
                Send invoice
              </v-btn>
            </div>
          </v-card-text>
        </template>
      </v-card>

      <small class="text--disabled">Prices are in United States dollars.</small>

      <div
        v-if="!['Complete', 'Processing'].includes(order.status)"
        class="mt-4"
      >
        <v-btn color="error" outlined @click="cancelDialog = true">
          <v-icon left>
            {{ mdiClose }}
          </v-icon>
          Cancel order
        </v-btn>
      </div>

      <v-dialog v-model="billingDialog" width="80%" max-width="700">
        <v-card>
          <Account class="mx-2" @save="billingUpdated" />
        </v-card>
      </v-dialog>

      <v-dialog v-model="cancelDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>Cancel order</v-card-title>
          <v-card-text>
            <v-alert v-if="cancelError" type="error" text>
              {{ cancelError }}
            </v-alert>

            <div>The order will be cancelled.</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="cancelDialog = false">
              Cancel
            </v-btn>
            <v-btn :loading="cancelling" color="error" text @click="cancel">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="couponDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>Add a promo code</v-card-title>
          <v-card-text>
            <v-alert v-if="couponError" type="error" text>
              {{ couponError }}
            </v-alert>

            <v-form @submit.prevent="saveCoupon()">
              <v-text-field
                v-model="coupon"
                label="Promo code"
                hide-details
                outlined
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="couponDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :loading="savingCoupon"
              color="accent"
              text
              @click="saveCoupon()"
            >
              Apply
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <script type="text/javascript">
      ;(function () {
        var capterra_vkey = '830c6c2068776e8f03bb8641826b95d9',
          capterra_vid = '2152203',
          capterra_prefix =
            'https:' == document.location.protocol
              ? 'https://ct.capterra.com'
              : 'http://ct.capterra.com'
        var ct = document.createElement('script')
        ct.type = 'text/javascript'
        ct.async = true
        ct.src =
          capterra_prefix +
          '/capterra_tracker.js?vid=' +
          capterra_vid +
          '&vkey=' +
          capterra_vkey
        var s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(ct, s)
      })()
    </script>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiPencil,
  mdiFileDocumentOutline,
  mdiTagOutline,
  mdiClose,
  mdiCreditCard,
  mdiEmail,
  mdiCheckboxMarked,
  mdiAlertOctagonOutline,
  mdiArrowRight,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Account from '~/components/Account.vue'
import CreditCards from '~/components/CreditCards.vue'
import Progress from '~/components/Progress.vue'
import declineCodes from '~/assets/json/declineCodes.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Account,
    CreditCards,
    Progress,
  },
  data() {
    return {
      title: 'Order',
      accountSuccess: false,
      billingDialog: false,
      billingSuccess: false,
      coupon: '',
      couponDialog: false,
      couponError: false,
      savingCoupon: false,
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      cardsLoaded: false,
      declineCodes,
      discount: 0,
      error: false,
      invoicing: false,
      mdiPencil,
      mdiFileDocumentOutline,
      mdiTagOutline,
      mdiClose,
      mdiCreditCard,
      mdiEmail,
      mdiCheckboxMarked,
      mdiAlertOctagonOutline,
      mdiArrowRight,
      order: null,
      orderLoaded: false,
      paying: false,
      processing: false,
      sets,
      status: '',
      statusItems: [
        'Open',
        'Pending',
        'Processing',
        'Insufficient',
        'Failed',
        'Complete',
      ],
      stripePaymentMethod: null,
      success: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPlus: ({ credits }) => credits.plus,
      isPro: ({ credits }) => credits.pro,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
      freeLists: ({ credits: { freeLists } }) => freeLists,
    }),
    billingAddress() {
      return [
        this.user.billingAddress1,
        this.user.billingAddress2,
        this.user.billingCity,
        this.user.billingPostcode,
        this.user.billingState,
        this.user.billingCountry,
      ]
        .filter((value) => value)
        .join(', ')
    },
    progress() {
      return this.order
        ? Math.ceil(
            (100 / (this.order.bulk.rows || 1)) *
              (this.order.bulk.rowsProcessed || 0)
          )
        : 0
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        const { id } = this.$route.params

        try {
          this.getCredits()

          this.order = (await this.$axios.get(`orders/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    billingDialog(open) {
      if (open) {
        this.billingSuccess = false
      }
    },
    user() {
      this.billingDialog = false
    },
    order({ id, status, discount }) {
      this.status = status
      this.discount = discount / 100

      if (status === 'Processing') {
        setTimeout(async () => {
          this.order = (await this.$axios.get(`orders/${id}`)).data
        }, 5000)
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      const { id } = this.$route.params

      try {
        this.getCredits()

        this.order = (await this.$axios.get(`orders/${id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async process() {
      this.error = false
      this.success = false
      this.processing = true

      try {
        await this.$axios.patch(`orders/${this.order.id}`, { process: true })

        this.order = (await this.$axios.get(`orders/${this.order.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.processing = false
    },
    async pay() {
      this.error = false
      this.paying = true
      this.success = false

      try {
        if (this.order.product === 'Subscription') {
          await this.$axios.patch(`orders/${this.order.id}`, {
            paymentMethod: 'stripe',
            stripePaymentMethod: this.stripePaymentMethod,
          })

          this.order = (await this.$axios.get(`orders/${this.order.id}`)).data
        } else {
          if (!this.order.stripePaymentIntent.id) {
            await this.$axios.patch(`orders/${this.order.id}`)

            this.order = (await this.$axios.get(`orders/${this.order.id}`)).data

            if (!this.order.stripePaymentIntent.id) {
              throw new Error(
                'The order is not in a payable state. Please contact us.'
              )
            }
          }

          const { clientSecret } = this.order.stripePaymentIntent

          const { paymentIntent, error } =
            await this.$stripe.confirmCardPayment(clientSecret, {
              payment_method: this.stripePaymentMethod,
            })

          if (error) {
            if (error.code === 'card_declined') {
              if (declineCodes[error.decline_code]) {
                throw new Error(declineCodes[error.decline_code])
              }
            }

            throw new Error(this.getErrorMessage(error))
          }

          if (paymentIntent.status === 'succeeded') {
            for (let attempt = 1; attempt <= 20; attempt += 1) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  try {
                    this.order = (
                      await this.$axios.get(`orders/${this.order.id}`)
                    ).data

                    resolve()
                  } catch (error) {
                    reject(new Error(this.getErrorMessage(error)))
                  }
                }, 500)
              })

              if (this.order.status === 'Complete') {
                break
              }
            }

            if (
              this.order.status !== 'Processing' &&
              this.order.status !== 'Complete'
            ) {
              this.error =
                'Your payment was successful but the order failed to update. Please try reloading the page and contact us if the issue persists.'
            }
          }
        }
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.paying = false

      this.getCredits()

      this.scrollToTop()
    },
    async invoice() {
      this.error = false
      this.invoicing = true
      this.success = false

      try {
        await this.$axios.patch(`orders/${this.order.id}`, {
          paymentMethod: 'stripe',
          stripePaymentMethod: this.stripePaymentMethod,
        })

        this.order = (await this.$axios.get(`orders/${this.order.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.invoicing = false

      this.scrollToTop()
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.delete(`orders/${id}`)

        this.$router.push({ path: '/orders/' })
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
    async saveCoupon(coupon = this.coupon) {
      this.couponError = false
      this.savingCoupon = true

      try {
        await this.$axios.patch(`orders/${this.order.id}`, {
          coupon: coupon.toUpperCase(),
        })

        try {
          this.order = (await this.$axios.get(`orders/${this.order.id}`)).data

          this.coupon = ''

          this.success = `The promo code has been ${
            this.order.coupon ? 'added' : 'removed'
          }.`
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.couponDialog = false
      } catch (error) {
        this.couponError = this.getErrorMessage(error)
      }

      this.savingCoupon = false
    },
    async billingUpdated() {
      this.accountSuccess = 'Your billing details have been updated.'

      this.order = (await this.$axios.get(`orders/${this.order.id}`)).data
    },
  },
}
</script>
