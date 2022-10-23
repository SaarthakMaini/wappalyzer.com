<template>
  <div>
    <v-card-text v-if="error" class="pt-0">
      <v-alert type="error" class="mb-0" text>
        {{ error }}
      </v-alert>
    </v-card-text>

    <template v-if="paymentMethods">
      <v-card-text v-if="!paymentMethods.length" class="pa-0">
        <v-alert color="info" class="mt-0 mx-4" text>
          You don't have any cards.
        </v-alert>
      </v-card-text>
      <v-card-text v-else class="pt-0 px-0">
        <v-alert v-if="success" type="success" class="mx-4" text>
          {{ success }}
        </v-alert>

        <v-radio-group v-model="selection" class="ma-0 pa-0" hide-details>
          <v-simple-table>
            <thead>
              <tr>
                <th v-if="modeSelect" width="1" />
                <th>Name on card</th>
                <th>Card details</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="paymentMethod in paymentMethods"
                :key="paymentMethod.id"
                @click="selection = paymentMethod.id"
              >
                <td v-if="modeSelect">
                  <v-radio :value="paymentMethod.id" />
                </td>
                <td>{{ paymentMethod.name }}</td>
                <td>
                  <CreditCard
                    :brand="paymentMethod.brand"
                    :last4="paymentMethod.last4"
                    :exp-month="paymentMethod.expMonth"
                    :exp-year="paymentMethod.expYear"
                  />
                </td>
                <td class="text-right">
                  <v-btn
                    icon
                    @click="
                      removeId = paymentMethod.id
                      removeDialog = true
                    "
                  >
                    <v-icon color="error">
                      {{ mdiCreditCardRemoveOutline }}
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" text @click="addDialog = true">
          <v-icon left>
            {{ mdiCreditCardPlusOutline }}
          </v-icon>
          Add card
        </v-btn>
      </v-card-actions>

      <v-dialog v-model="removeDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Remove card </v-card-title>
          <v-card-text>
            <v-alert v-if="removeError" type="error">
              {{ removeError }}
            </v-alert>

            The card will be removed.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeDialog = false">
              Cancel
            </v-btn>
            <v-btn :loading="removing" color="error" text @click="remove">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="addDialog" max-width="400px" eager>
        <v-card>
          <v-card-title> Add card </v-card-title>

          <v-card-text v-if="!user.stripeCustomer" class="pb-0">
            <v-alert type="info" class="mb-0" outlined>
              Please provide your
              <nuxt-link to="/account"> billing details </nuxt-link> before
              adding a card.
            </v-alert>
          </v-card-text>
          <v-card-text v-else>
            <v-alert v-if="addError" type="error" class="mb-0" text>
              {{ addError }}
            </v-alert>
            <v-alert v-else-if="!$stripe" type="error" class="mb-0" text>
              <p>
                The form could not be loaded. Please disable any browser
                extensions that block scripts and try again.
              </p>

              <p class="mb-0">If the problem persists, please contact us.</p>
            </v-alert>
            <template v-else>
              <v-form ref="form" v-model="valid">
                <v-text-field
                  v-model="billingName"
                  :rules="[(v) => !!v || 'This field is required']"
                  label="Name on card"
                  hide-details="auto"
                  outlined
                  dense
                />
              </v-form>

              <v-card :class="`mt-4`" :outlined="!stripeLoading" flat>
                <v-card-text>
                  <div id="stripe-elements-card" />
                </v-card-text>
              </v-card>
              <small v-if="stripeError" type="error" class="red--text">
                {{ stripeError }}
              </small>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="addDialog = false">
              Cancel
            </v-btn>
            <v-btn
              v-if="user.stripeCustomer"
              :loading="(stripeLoading || saving) && !addError"
              :disabled="!!addError || !$stripe"
              color="accent"
              text
              @click="save"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiCreditCardPlusOutline, mdiCreditCardRemoveOutline } from '@mdi/js'

import CreditCard from '~/components/CreditCard.vue'

export default {
  components: {
    CreditCard,
  },
  props: {
    modeSelect: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      addDialog: false,
      addError: false,
      billingName: '',
      error: false,
      mdiCreditCardPlusOutline,
      mdiCreditCardRemoveOutline,
      paymentMethods: null,
      removeDialog: false,
      removeError: false,
      removeId: null,
      removing: false,
      saving: false,
      selection: false,
      stripeCard: null,
      stripeClientSecret: null,
      stripeError: false,
      stripeLoading: false,
      success: false,
      valid: true,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
    }),
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.paymentMethods = (await this.$axios.get('paymentmethods')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    error() {
      this.$emit('load')
    },
    paymentMethods() {
      this.$emit('load')

      if (this.paymentMethods.length) {
        this.selection = this.paymentMethods[0].id
      } else {
        this.selection = false
      }
    },
    removeDialog(isOpen) {
      if (isOpen) {
        this.success = false
        this.removeError = false
      }
    },
    async addDialog(isOpen) {
      if (!this.$stripe) {
        this.stripeError = 'Failed to load'

        return
      }

      if (this.stripeCard) {
        this.stripeCard.unmount()
      }

      if (isOpen) {
        this.success = false
        this.addError = false
        this.stripeError = false
        this.stripeLoading = true

        try {
          const { clientSecret } = (await this.$axios.get('intent')).data

          this.stripeClientSecret = clientSecret
        } catch (error) {
          this.addError = this.getErrorMessage(error)

          return
        }

        if (!this.stripeCard) {
          const elements = this.$stripe.elements()

          this.stripeCard = elements.create('card')

          this.stripeCard.on('ready', () => (this.stripeLoading = false))

          this.stripeCard.on('change', (event) => {
            if (event.error) {
              this.stripeError = this.getErrorMessage(event.error)
            } else {
              this.stripeError = false
            }
          })
        }

        this.stripeCard.mount('#stripe-elements-card')
      }
    },
    selection(id) {
      this.$emit('select', id)
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.paymentMethods = (await this.$axios.get('paymentmethods')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  mounted() {
    this.billingName = this.user.billingName || this.user.name
  },
  methods: {
    async save() {
      this.addError = false
      this.stripeError = false

      if (this.$refs.form.validate()) {
        this.saving = true

        try {
          const response = await this.$stripe.confirmCardSetup(
            this.stripeClientSecret,
            {
              payment_method: {
                card: this.stripeCard,
                billing_details: {
                  address: {
                    city: this.user.billingCity,
                    country: this.user.billingCountry,
                    line1: this.user.billingAddress1,
                    line2: this.user.billingAddress2,
                    postal_code: this.user.billingPostcode,
                    state: this.user.billingState,
                  },
                  email: this.user.billingEmail,
                  name: this.billingName,
                },
              },
            }
          )

          if (response.error) {
            this.stripeError = this.getErrorMessage(response.error)
          } else {
            await this.$axios.put('paymentmethods', {
              id: response.setupIntent.payment_method,
            })

            this.paymentMethods = (await this.$axios.get('paymentmethods')).data

            this.success = 'The card has been added'

            this.addDialog = false
          }
        } catch (error) {
          this.addError = this.getErrorMessage(error)
        }

        this.saving = false
      }
    },
    async remove() {
      this.removeError = false
      this.removing = true

      try {
        await this.$axios.delete(`paymentmethods/${this.removeId}`)

        this.paymentMethods = (await this.$axios.get('paymentmethods')).data

        this.success = 'The card has been removed'

        this.removeDialog = false
      } catch (error) {
        this.removeError = this.getErrorMessage(error)
      }

      this.removing = false
    },
  },
}
</script>
