<template>
  <Page :title="title" :loading="loading && !error" secure>
    <v-alert v-if="success" type="success" text>
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error" text>
      {{ error }}
    </v-alert>

    <p class="mb-6">
      Your API key provides authenticated access to your account when using our
      <nuxt-link to="/api/">APIs</nuxt-link> or
      <nuxt-link to="/apps/">browser extension</nuxt-link>. Treat it like a
      password: keep it safe and don't share it with anyone you don't trust.
    </p>

    <template v-if="!loading">
      <v-btn href="/docs/api/" class="mb-4" depressed>
        <v-icon left>
          {{ mdiBookOpenPageVariant }}
        </v-icon>
        API reference
      </v-btn>

      <v-card class="mb-4">
        <v-card-title>API key</v-card-title>
        <v-card-text>
          <p>Use your API key to make authenticated API calls.</p>

          <template v-if="!apiKey">
            <v-alert color="info" class="mb-0" text>
              You haven't created an API key yet
            </v-alert>
          </template>
          <template v-else>
            <v-text-field
              v-model="apiKey.value"
              :append-icon="showKey ? mdiEyeOff : mdiEye"
              :type="showKey ? 'text' : 'password'"
              class="secret__value"
              readonly
              hide-details
              outlined
              @click:append="() => (showKey = !showKey)"
            />
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!apiKey"
            :loading="creatingKey"
            color="accent"
            text
            @click="createKey"
          >
            <v-icon left>
              {{ mdiKeyPlus }}
            </v-icon>
            Create key
          </v-btn>
          <v-btn v-else color="error" text @click="removeKeyDialog = true">
            <v-icon left>
              {{ mdiKeyRemove }}
            </v-icon>
            Delete key
          </v-btn>
        </v-card-actions>

        <v-divider />

        <v-card-title>Signing secret</v-card-title>
        <v-card-text>
          <p>Use your signing secret to verify callback requests.</p>

          <template v-if="!secret">
            <v-alert color="info" class="mb-0" text>
              You haven't created an signing secret yet
            </v-alert>
          </template>
          <template v-else>
            <v-text-field
              v-model="secret"
              :append-icon="showSecret ? mdiEyeOff : mdiEye"
              :type="showSecret ? 'text' : 'password'"
              class="secret__value"
              readonly
              hide-details
              outlined
              @click:append="() => (showSecret = !showSecret)"
            />
          </template>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            v-if="!secret"
            :loading="creatingSecret"
            color="accent"
            text
            @click="createSecret"
          >
            <v-icon left>
              {{ mdiKeyPlus }}
            </v-icon>
            Create secret
          </v-btn>
          <v-btn v-else color="error" text @click="removeSecretDialog = true">
            <v-icon left>
              {{ mdiKeyRemove }}
            </v-icon>
            Delete secret
          </v-btn>
        </v-card-actions>
      </v-card>

      <small class="text--disabled"
        >Unused API keys on free plans are automatically deleted after two
        months.</small
      >

      <v-dialog
        v-if="!confirmRemoveKeyDialog"
        v-model="removeKeyDialog"
        max-width="400px"
        eager
      >
        <v-card>
          <v-card-title>Delete key</v-card-title>
          <v-card-text>
            <v-alert v-if="removeKeyError" type="error" text>
              {{ removeKeyError }}
            </v-alert>

            Any integrations using this key will stop working.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeKeyDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :loading="removingKey"
              color="error"
              text
              @click="removeKey()"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-if="!confirmRemoveSecretDialog"
        v-model="removeSecretDialog"
        max-width="400px"
        eager
      >
        <v-card>
          <v-card-title>Delete signing secret</v-card-title>
          <v-card-text>
            <v-alert v-if="removeSecretError" type="error" text>
              {{ removeSecretError }}
            </v-alert>

            The signing secret will be deleted.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="removeSecretDialog = false">
              Cancel
            </v-btn>
            <v-btn
              :loading="removingSecret"
              color="error"
              text
              @click="removeSecret()"
            >
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <v-dialog v-model="confirmRemoveKeyDialog" max-width="400px">
      <SignIn
        mode-confirm
        @confirm="removeKey(true)"
        @close="confirmRemoveKeyDialog = false"
      />
    </v-dialog>

    <v-dialog v-model="confirmRemoveSecretDialog" max-width="400px">
      <SignIn
        mode-confirm
        @confirm="removeSecret(true)"
        @close="confirmRemoveSecretDialog = false"
      />
    </v-dialog>
  </Page>
</template>

<script>
import {
  mdiBookOpenPageVariant,
  mdiEye,
  mdiEyeOff,
  mdiKeyPlus,
  mdiKeyRemove,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    Page,
    SignIn,
  },
  data() {
    return {
      title: 'API key',
      apiKey: null,
      secret: null,
      creatingKey: false,
      creatingSecret: false,
      error: false,
      mdiBookOpenPageVariant,
      mdiEye,
      mdiEyeOff,
      mdiKeyPlus,
      mdiKeyRemove,
      removeKeyDialog: false,
      confirmRemoveKeyDialog: false,
      removeSecretDialog: false,
      confirmRemoveSecretDialog: false,
      removeKeyError: false,
      removeSecretError: false,
      removingKey: false,
      removingSecret: false,
      showKey: false,
      showSecret: false,
      success: false,
      signInDialog: true,
      loading: true,
    }
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          ;({ apiKey: this.apiKey, secret: this.secret } = (
            await this.$axios.get('apikey')
          ).data)

          this.loading = false
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.loading = false
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async createKey() {
      this.success = false
      this.error = false
      this.creatingKey = true

      try {
        await this.$axios.put('apikey')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your API key has been created'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.creatingKey = false
    },
    async removeKey(confirmed) {
      this.success = false
      this.error = false
      this.removeKeyError = false

      if (!confirmed) {
        this.confirmRemoveKeyDialog = true

        return
      }

      this.confirmRemoveKeyDialog = false
      this.removingKey = true

      try {
        await this.$axios.delete('apikey')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your API key has been deleted'

        this.removeKeyDialog = false
      } catch (error) {
        this.removeKeyError = this.getErrorMessage(error)
      }

      this.removingKey = false
    },
    async createSecret() {
      this.success = false
      this.error = false
      this.creatingSecret = true

      try {
        await this.$axios.put('apikey/secret')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your signing secret has been created'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.creatingSecret = false
    },
    async removeSecret(confirmed) {
      this.success = false
      this.error = false
      this.removeSecretError = false

      if (!confirmed) {
        this.confirmRemoveSecretDialog = true

        return
      }

      this.confirmRemoveSecretDialog = false
      this.removingSecret = true

      try {
        await this.$axios.delete('apikey/secret')
        ;({ apiKey: this.apiKey, secret: this.secret } = (
          await this.$axios.get('apikey')
        ).data)

        this.success = 'Your signing secret has been deleted'

        this.removeSecretDialog = false
      } catch (error) {
        this.removeSecretError = this.getErrorMessage(error)
      }

      this.removingSecret = false
    },
  },
}
</script>

<style>
.secret__value input {
  font-family: monospace;
}
</style>
