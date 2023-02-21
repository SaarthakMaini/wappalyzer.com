<template>
  <Page :title="title" secure>
    <v-alert v-if="success" type="success" text>
      {{ success }}
    </v-alert>

    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <template v-if="isAdmin">
      <v-btn
        :href="`https://dashboard.stripe.com/customers/${user.stripeCustomer}`"
        :disabled="!user.stripeCustomer"
        color="success"
        class="mr-2 mb-4"
        target="_blank"
        outlined
      >
        Stripe customer
        <v-icon right>
          {{ mdiOpenInNew }}
        </v-icon>
      </v-btn>

      <v-btn
        v-if="user.email_verified === 'false'"
        :loading="confirming"
        color="success"
        class="mr-2 mb-4"
        outlined
        @click="confirm"
      >
        <v-icon left>
          {{ mdiAccountCheck }}
        </v-icon>
        Confirm user
      </v-btn>

      <v-btn
        v-if="user.disabled !== 'true'"
        :loading="disabling"
        color="error"
        class="mr-2 mb-4"
        outlined
        @click="disable"
      >
        <v-icon left>
          {{ mdiAccountRemove }}
        </v-icon>
        Disable user
      </v-btn>

      <v-btn
        v-if="user.disabled === 'true'"
        :loading="enabling"
        color="success lighten-5 success--text"
        class="mr-2 mb-4"
        depressed
        @click="enable"
      >
        <v-icon left>
          {{ mdiAccountCheck }}
        </v-icon>
        Enable user
      </v-btn>
    </template>

    <v-card class="mb-4">
      <template v-if="isAdmin">
        <v-card-title>Administration</v-card-title>

        <v-form ref="form" v-model="valid">
          <v-card-text class="py-0">
            <v-row>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field v-model="userId" label="User ID" readonly />
              </v-col>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field
                  v-model="stripeCustomer"
                  label="Stripe customer"
                  required
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="py-0" cols="12" sm="6">
                <v-text-field
                  v-model="proExpiresAt"
                  label="Enable Pro (days)"
                  placeholder="7"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>

        <v-card-actions>
          <v-spacer />
          <v-btn
            :loading="saving"
            color="success"
            text
            @click.prevent="submit(false)"
          >
            <v-icon left>
              {{ mdiContentSave }}
            </v-icon>
            Save
          </v-btn>
        </v-card-actions>

        <v-divider />
      </template>

      <v-card-title>Sign in details</v-card-title>

      <v-form ref="form" v-model="valid" class="mb-2">
        <v-card-text class="py-0">
          <v-row>
            <v-col class="py-0" cols="12" sm="6">
              <v-text-field
                v-model="email"
                :rules="rules.email"
                label="Email address"
                required
              />
            </v-col>
            <v-col class="py-0">
              <v-text-field
                v-model="oldPassword"
                :append-icon="showPassword ? mdiEyeOff : mdiEye"
                :type="showPassword ? 'text' : 'password'"
                label="Current password"
                @click:append="() => (showPassword = !showPassword)"
              />

              <v-text-field
                v-model="newPassword"
                :append-icon="showPassword ? mdiEyeOff : mdiEye"
                :type="showPassword ? 'text' : 'password'"
                label="New password (optional)"
                @click:append="() => (showPassword = !showPassword)"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>

      <v-card-actions>
        <v-spacer />
        <v-btn
          :loading="saving"
          color="accent"
          text
          @click.prevent="submit(false)"
        >
          <v-icon left>
            {{ mdiContentSave }}
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>

      <v-divider />

      <Account @save="accountDetailsSaved" />
    </v-card>

    <v-btn
      v-if="!isImpersonator"
      color="error"
      outlined
      @click="deleteAccountDialog = true"
    >
      <v-icon left>
        {{ mdiAccountRemove }}
      </v-icon>
      Delete account
    </v-btn>

    <v-dialog v-model="changeEmailDialog" width="80%" max-width="400">
      <v-card>
        <v-card-title>Email address change</v-card-title>
        <v-card-text>
          You will be signed out. You must to verify your new email address to
          sign back in.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="changeEmailDialog = false">
            Cancel
          </v-btn>
          <v-btn color="accent" text @click="submit(true)"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-if="!confirmDeleteAccountDialog"
      v-model="deleteAccountDialog"
      max-width="400"
    >
      <v-card v-if="isPlus">
        <v-card-title>Delete account</v-card-title>
        <v-card-text
          >Please cancel your <nuxt-link to="/plan/">plan</nuxt-link> before
          deleting your account.</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="deleteAccountDialog = false">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>Delete account</v-card-title>
        <v-card-text>Your account will be deleted permanently.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="deleteAccountDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="removing" color="error" text @click="remove()">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDeleteAccountDialog" max-width="400px">
      <SignIn
        mode-confirm
        @confirm="remove(true)"
        @close="confirmDeleteAccountDialog = false"
      />
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiOpenInNew,
  mdiAccountRemove,
  mdiAccountCheck,
  mdiContentSave,
  mdiEye,
  mdiEyeOff,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Account from '~/components/Account.vue'
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    Page,
    Account,
    SignIn,
  },
  data() {
    return {
      title: 'Account',
      changeEmailDialog: false,
      deleteAccountDialog: false,
      confirmDeleteAccountDialog: false,
      email: '',
      error: false,
      mdiOpenInNew,
      mdiAccountRemove,
      mdiAccountCheck,
      mdiContentSave,
      mdiEye,
      mdiEyeOff,
      newPassword: '',
      oldPassword: '',
      confirming: false,
      disabling: false,
      enabling: false,
      removing: false,
      stripeCustomer: '',
      proExpiresAt: null,
      rules: {
        email: [(v) => /@/.test(v) || 'Enter a valid email address'],
        required: [(v) => !!v || 'This field is required'],
      },
      saving: false,
      showPassword: false,
      success: false,
      userId: '',
      valid: true,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPlus: ({ credits }) => credits.plus,
      isImpersonator: ({ user }) => user.impersonator,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
  },
  watch: {
    user() {
      this.fill()
    },
  },
  beforeMount() {
    this.fill()
  },
  methods: {
    ...mapActions({
      saveUser: 'user/save',
      deleteUser: 'user/delete',
      enableUser: 'user/enable',
      confirmUser: 'user/confirm',
      disableUser: 'user/disable',
      changePassword: 'user/changePassword',
    }),
    async submit(emailChange) {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        if (this.email !== this.user.email && !emailChange) {
          this.changeEmailDialog = true

          return
        }

        this.changeEmailDialog = false
        this.saving = true

        try {
          if (this.newPassword) {
            await this.changePassword({
              oldPassword: this.oldPassword,
              newPassword: this.newPassword,
            })
          }

          await this.saveUser({
            email: this.email,
            stripeCustomer: this.stripeCustomer,
            proExpiresAt: Math.round(
              Date.now() / 1000 + this.proExpiresAt * 60 * 60 * 24
            ),
          })

          this.success = 'Your details have been saved'
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.scrollToTop()

        this.saving = false
      }
    },
    async remove(confirmed) {
      this.error = false

      if (!confirmed) {
        this.confirmDeleteAccountDialog = true

        return
      }

      this.confirmDeleteAccountDialog = false
      this.removing = true

      try {
        await this.deleteUser()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.removing = false
      this.deleteAccountDialog = false

      this.scrollToTop()
    },
    async disable() {
      this.disabling = true
      this.error = false

      try {
        await this.disableUser()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.disabling = false

      this.scrollToTop()
    },
    async confirm() {
      this.confirming = true
      this.error = false

      try {
        await this.confirmUser()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.confirming = false

      this.scrollToTop()
    },
    async enable() {
      this.enabling = true
      this.error = false

      try {
        await this.enableUser()
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.enabling = false

      this.scrollToTop()
    },
    accountDetailsSaved() {
      this.success = 'Your details have been updated'

      this.scrollToTop()
    },
    fill() {
      this.email = this.user.email
      this.stripeCustomer = this.user.stripeCustomer
      this.proExpiresAt =
        Math.max(
          0,
          Math.ceil(
            ((this.user.proExpiresAt || 0) - Date.now() / 1000) / 60 / 60 / 24
          )
        ) || null
      this.userId = this.user.sub
    },
  },
}
</script>
