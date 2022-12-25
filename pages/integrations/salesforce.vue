<template>
  <Page
    :title="title"
    :crumbs="[{ title: 'Integrations', to: '/integrations/' }]"
    secure
  >
    <v-alert v-if="success" type="success" class="mb-8" text>
      {{ success }}
    </v-alert>
    <v-alert v-if="error" type="error" class="mb-8" text>
      {{ error }}
    </v-alert>

    <v-row class="mb-2">
      <v-col cols="12" lg="8" class="py-0">
        <p>
          Connect Wappalyzer to Salesforce to see the technology stacks of your
          leads without leaving your CRM.
        </p>
      </v-col>
    </v-row>

    <div class="mb-4">
      <v-btn to="/docs/integrations/salesforce/" class="mr-2" depressed>
        <v-icon left>
          {{ mdiBookOpenPageVariant }}
        </v-icon>
        Documentation
      </v-btn>
    </div>

    <v-card class="mb-4">
      <v-card-title>Integration</v-card-title>
      <v-card-text class="px-0">
        <v-alert
          v-if="!connecting && !eligible"
          color="accent"
          class="mx-4"
          text
        >
          <p>
            Please subscribe to an eligible plan to enable this integration.
          </p>

          <v-btn to="/pricing/" color="accent" outlined>
            <v-icon left>
              {{ mdiCalculator }}
            </v-icon>
            Plans &amp; pricing
          </v-btn>
        </v-alert>

        <v-simple-table>
          <tbody>
            <tr>
              <th width="30%">Status</th>
              <td>
                <template v-if="connecting">
                  <Spinner />
                </template>
                <v-chip
                  v-else
                  :color="orgDomainName ? 'success' : ''"
                  outlined
                  small
                  label
                >
                  <v-icon v-if="orgDomainName" small left>
                    {{ mdiCheck }}
                  </v-icon>
                  {{ orgDomainName ? `Connected` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="orgDomainName">
              <th>Salesforce org domain name</th>
              <td>
                {{ orgDomainName }}
              </td>
            </tr>

            <tr />
          </tbody>
        </v-simple-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!orgDomainName"
          color="accent"
          _target="blank"
          :loading="connecting"
          :disabled="!eligible"
          text
          @click="connectDialog = true"
        >
          <v-icon left>
            {{ mdiPowerPlug }}
          </v-icon>
          Connect
        </v-btn>
        <v-btn
          v-else
          color="error"
          :loading="disconnecting"
          text
          @click="disconnect"
        >
          <v-icon left>
            {{ mdiPowerPlugOff }}
          </v-icon>
          Disconnect
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="orgDomainName" class="mb-4">
      <v-divider />

      <v-card-title>Field mappings</v-card-title>

      <v-card-text style="max-width: 600px">
        <p class="mb-0">
          Manage custom fields in Salesforce settings. Refer to the
          <nuxt-link to="/docs/integrations/salesforce/">
            documentation</nuxt-link
          >.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2">Technologies</v-card-title>
      <v-card-text class="px-0">
        <div class="mx-4" style="max-width: 600px">
          <p>
            Map technology categories to custom Salesforce account fields. These
            properties will be populated during a sync.
          </p>

          <p>
            Browse <nuxt-link to="/technologies/">categories</nuxt-link> to see
            which technologies are included or use the search function to find
            the category a technology belongs to.
          </p>
        </div>

        <v-simple-table v-if="assignedFields.length" class="mb-4">
          <thead>
            <tr>
              <th width="50%">Technology category</th>
              <th>Salesforce field</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="({ categorySlug, key, name }, index) in assignedFields"
              :key="index"
            >
              <td>
                {{ categories.find(({ slug }) => slug === categorySlug).name }}
              </td>
              <td>
                {{ name }}
              </td>
              <td width="1">
                <v-btn icon @click="removeField(key)">
                  <v-icon>{{ mdiCloseCircle }}</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </v-simple-table>

        <v-row class="mx-1">
          <v-col>
            <v-select
              v-model="selectedCategory"
              :items="
                categories.map(({ slug, name }) => ({
                  text: name,
                  value: slug,
                }))
              "
              label="Technology category"
              hide-details="auto"
              dense
              outlined
              eager
            />
          </v-col>
          <v-col>
            <v-select
              v-model="selectedField"
              :items="
                fields.map(({ key, name }) => ({ text: name, value: key }))
              "
              label="Salesforce field"
              hide-details="auto"
              dense
              outlined
              eager
            />
          </v-col>
          <v-col class="flex-grow-0 flex-shrink-1 d-flex flex-row align-end">
            <v-btn
              :disabled="!selectedCategory || !selectedField"
              color="primary"
              style="height: 40px"
              depressed
              @click="addField"
            >
              Add
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="accent" :loading="saving" text @click="save">
          <v-icon left>
            {{ mdiContentSave }}
          </v-icon>
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card v-if="orgDomainName" class="mb-4">
      <v-card-title>Synchronise</v-card-title>

      <v-card-text style="max-width: 600px">
        <p>
          Append technology information to all existing account records using
          the above field mappings.
        </p>

        <p>Each successully updated record cost 1 credit.</p>

        <v-row>
          <v-col>
            <v-btn
              color="primary lighten-1 primary--text"
              depressed
              :disabled="!assignedFields.length"
              @click="syncDialog = true"
            >
              <v-icon left>
                {{ mdiAutorenew }}
              </v-icon>
              Update all accounts
            </v-btn>
          </v-col>
        </v-row>

        <v-switch
          v-model="autoSync"
          label="Run automatically once a month"
          :disabled="!assignedFields.length"
          :loading="savingAutoSync"
          hide-details
          inset
          @change="saveAutoSync"
        />
      </v-card-text>
    </v-card>

    <v-dialog v-model="syncDialog" max-width="400px">
      <v-card>
        <v-card-title>Update all accounts</v-card-title>
        <v-card-text>
          <v-alert v-if="syncError" type="error" class="mb-4" text>
            {{ syncError }}
          </v-alert>

          This sync costs 1 credit per account and may take some time to
          complete.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="syncDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="syncing" color="accent" text @click="sync">
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="connectDialog" max-width="400px">
      <v-card>
        <v-card-title>Authenticate</v-card-title>
        <v-card-text>
          <v-alert v-if="connectError" type="error" class="mb-4" text>
            {{ connectError }}
          </v-alert>

          <p>
            You need to create a Connected App on Salesforce to authenticate.
            Refer to the
            <nuxt-link to="/docs/integrations/salesforce/"
              >documentation</nuxt-link
            >.
          </p>

          <v-text-field
            v-model="form.orgDomainName"
            label="Salesforce org domain name"
            :rules="rules.orgDomainName"
            required
            dense
            outlined
          />

          <v-text-field
            v-model="form.clientId"
            label="Consumer key"
            required
            dense
            outlined
          />

          <v-text-field
            v-model="form.clientSecret"
            label="Consumer secret"
            hide-details="auto"
            :type="showClientSecret ? 'text' : 'password'"
            :append-icon="showClientSecret ? mdiEyeOff : mdiEye"
            required
            dense
            outlined
            @click:append="() => (showClientSecret = !showClientSecret)"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="connectDialog = false"
            >Cancel</v-btn
          >
          <v-btn :loading="savingUser" color="accent" text @click="connect"
            >Continue</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import {
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiBookOpenPageVariant,
  mdiCalculator,
  mdiCheck,
  mdiEyeOff,
  mdiEye,
  mdiAutorenew,
  mdiContentSave,
  mdiCloseCircle,
} from '@mdi/js'
import { mapState, mapActions } from 'vuex'

import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Spinner,
  },
  async asyncData({ $axios }) {
    return { categories: (await $axios.get('categories')).data }
  },
  data() {
    return {
      title: 'Salesforce',
      connecting: false,
      connectDialog: false,
      connectError: null,
      disconnecting: false,
      eligible: true,
      fields: [],
      selectedField: null,
      selectedCategory: null,
      saving: false,
      savingUser: false,
      syncDialog: false,
      syncError: false,
      syncing: false,
      success: null,
      error: null,
      mdiPowerPlug,
      mdiPowerPlugOff,
      mdiBookOpenPageVariant,
      mdiCalculator,
      mdiCheck,
      mdiEyeOff,
      mdiEye,
      mdiAutorenew,
      mdiContentSave,
      mdiCloseCircle,
      orgDomainName: '',
      rules: {
        orgDomainName: [
          (v) =>
            /^[a-z0-9-]+\.[a-z0-9-.]+$/i.test(v) ||
            "Invalid domain name (e.g. 'example.my.salesforce.com')",
        ],
      },
      form: {
        orgDomainName: '',
        clientId: '',
        clientSecret: '',
      },
      showClientSecret: false,
      websiteUrl: this.$config.WEBSITE_URL,
      autoSync: false,
      savingAutoSync: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
    }),
    assignedFields() {
      return Object.values(this.fields).filter(
        ({ categorySlug }) => categorySlug
      )
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.connecting = true

        if (this.code) {
          try {
            await this.authenticate()
          } catch (error) {
            this.error = this.getErrorMessage(error)
          }
        } else {
          try {
            ;({
              eligible: this.eligible,
              orgDomainName: this.orgDomainName,
              fields: this.fields,
              fields: this.fields,
              autoSync: this.autoSync,
            } = (await this.$axios.get('salesforce')).data)
          } catch (error) {
            // Continue
          }
        }

        this.connecting = false
      }
    },
  },
  async mounted() {
    const { code } = this.$route.query

    this.code = code

    if (this.code) {
      this.$router.replace({
        path: this.$route.path,
      })
    }

    if (this.isSignedIn) {
      this.connecting = true

      if (this.code) {
        try {
          await this.authenticate()
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      } else {
        try {
          ;({
            eligible: this.eligible,
            orgDomainName: this.orgDomainName,
            fields: this.fields,
            autoSync: this.autoSync,
          } = (await this.$axios.get('salesforce')).data)
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }

      this.connecting = false
    }
  },
  methods: {
    async authenticate() {
      this.success = null
      this.error = null
      this.connecting = true

      try {
        await this.$axios.post(`salesforce/auth/${this.code}`)

        //
        ;({
          eligible: this.eligible,
          orgDomainName: this.orgDomainName,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('salesforce')).data)

        this.success = 'Connected to salesforce.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.connecting = false
    },
    async save() {
      this.success = null
      this.error = null
      this.saving = true

      try {
        await this.$axios.patch('salesforce', {
          fields: this.fields.filter(({ categorySlug }) => categorySlug),
        })

        //
        ;({
          eligible: this.eligible,
          orgDomainName: this.orgDomainName,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('salesforce')).data)

        this.success = 'Field mappings have been saved.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.saving = false

      this.scrollToTop()
    },
    async saveAutoSync() {
      this.savingAutoSync = true

      try {
        await this.$axios.patch('salesforce', {
          autoSync: this.autoSync,
        })

        //
        ;({
          eligible: this.eligible,
          orgDomainName: this.orgDomainName,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('salesforce')).data)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.savingAutoSync = false
    },
    async connect() {
      this.savingUser = true
      this.connectError = null

      try {
        await this.$axios.patch('salesforce', {
          clientId: this.form.clientId,
          clientSecret: this.form.clientSecret,
          orgDomainName: this.form.orgDomainName,
        })

        window.location = `https://${this.form.orgDomainName}/services/oauth2/authorize?client_id=${this.form.clientId}&redirect_uri=${this.websiteUrl}/integrations/salesforce/&response_type=code`
      } catch (error) {
        this.connectError = error.message || error.toString()
      }

      this.savingUser = false
    },
    async disconnect() {
      this.success = null
      this.error = null
      this.disconnecting = true

      try {
        await this.$axios.delete('salesforce')

        this.orgDomainName = null

        this.success = 'Disconnected from Salesforce.'
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.disconnecting = false
    },
    addField() {
      const index = this.fields.findIndex(
        ({ key }) => key === this.selectedField
      )

      this.fields[index].categorySlug = this.selectedCategory

      // Force recompute
      this.fields = [...this.fields]

      this.selectedField = null
      this.selectedCategory = null
    },
    removeField(key) {
      delete this.fields.find(({ key: _key }) => _key === key).categorySlug

      // Force recompute
      this.fields = [...this.fields]
    },
    async sync() {
      this.success = null
      this.syncError = null
      this.syncing = true

      try {
        await this.$axios.post('salesforce/sync')

        this.success =
          "The sync will start shortly. You'll receive an email upon start and finish."
        this.syncDialog = false

        this.scrollToTop()
      } catch (error) {
        this.syncError = this.getErrorMessage(error)
      }

      this.syncing = false
    },
  },
}
</script>
