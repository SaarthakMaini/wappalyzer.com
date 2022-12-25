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
          Connect Wappalyzer to
          <a
            :href="`https://app.hubspot.com/ecosystem/${appId}/marketplace/apps/marketing/lead-generation/wappalyzer-by-wappalyzer`"
            rel="noopener"
            target="_blank"
            >HubSpot</a
          >
          to see the technology stacks of your leads without leaving your CRM.
        </p>
      </v-col>
    </v-row>

    <div class="mb-4">
      <v-btn to="/docs/integrations/hubspot/" class="mr-2" depressed>
        <v-icon left>
          {{ mdiBookOpenPageVariant }}
        </v-icon>
        Documentation
      </v-btn>
      <v-btn
        :href="`https://app.hubspot.com/ecosystem/${appId}/marketplace/apps/marketing/lead-generation/wappalyzer-by-wappalyzer`"
        target="_blank"
        depressed
      >
        <v-icon left>
          {{ mdiHubspot }}
        </v-icon>
        App marketplace
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
                  :color="hubspotId ? 'success' : ''"
                  outlined
                  small
                  label
                >
                  <v-icon v-if="hubspotId" small left>
                    {{ mdiCheck }}
                  </v-icon>
                  {{ hubspotId ? `Connected` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="hubspotId">
              <th>HubSpot account ID</th>
              <td>
                {{ hubspotId }}
              </td>
            </tr>

            <tr />
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!hubspotId"
          :href="`https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${websiteUrl}/integrations/hubspot/&scope=crm.objects.contacts.read%20crm.objects.contacts.write%20crm.objects.custom.read%20crm.objects.custom.write%20crm.objects.companies.write%20crm.schemas.contacts.read%20crm.objects.companies.read%20crm.schemas.companies.read`"
          color="accent"
          _target="blank"
          :loading="connecting"
          :disabled="!eligible"
          text
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

    <v-card v-if="hubspotId" class="mb-4">
      <v-divider />

      <v-card-title>Field mappings</v-card-title>

      <v-card-text style="max-width: 600px">
        <p class="mb-0">
          Manage company properties in
          <a
            :href="`https://app.hubspot.com/property-settings/${hubspotId}/properties?type=0-2`"
            target="_blank"
            rel="noopener"
            >HubSpot settings</a
          >. Refer to the
          <a
            target="_blank"
            rel="noopener"
            href="https://knowledge.hubspot.com/crm-setup/manage-your-properties#create-custom-properties"
            >documentation</a
          >.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2"> Technologies </v-card-title>
      <v-card-text class="px-0">
        <div class="mx-4" style="max-width: 600px">
          <p>
            Map technology categories to custom HubSpot company properties.
            These properties will be populated during a sync.
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
              <th>HubSpot property</th>
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
              label="HubSpot property"
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

    <v-card v-if="hubspotId" class="mb-4">
      <v-card-title>Synchronise</v-card-title>

      <v-card-text style="max-width: 600px">
        <p>
          By default, Wappalyzer shows a card on companies and contacts with the
          most up-to-date technology information. It's also possible to save
          information to company records, which you can use to create custom
          reports in HubSpot.
        </p>

        <p class="mb-0">Each successully updated record cost 1 credit.</p>
      </v-card-text>
      <v-divider />

      <v-card-title class="subtitle-2"> Existing companies </v-card-title>
      <v-card-text style="max-width: 600px">
        <p>
          Append technology information to all existing company records using
          the above field mappings.
        </p>

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
              Update all companies
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

      <v-divider />

      <v-card-title class="subtitle-2">New companies</v-card-title>
      <v-card-text>
        <p style="max-width: 600px" class="mb-0">
          If you created field mappings above, new companies are automatically
          populated with technology information.
        </p>
      </v-card-text>
    </v-card>

    <v-dialog v-model="syncDialog" max-width="400px">
      <v-card>
        <v-card-title>Update all companies</v-card-title>
        <v-card-text>
          <v-alert v-if="syncError" type="error" class="mb-4" text>
            {{ syncError }}
          </v-alert>

          This sync costs 1 credit per company and may take some time to
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
  </Page>
</template>

<script>
import {
  mdiCheck,
  mdiClose,
  mdiPowerPlug,
  mdiPowerPlugOff,
  mdiBookOpenPageVariant,
  mdiHubspot,
  mdiCalculator,
  mdiAutorenew,
  mdiContentSave,
  mdiCloseCircle,
} from '@mdi/js'
import { mapState } from 'vuex'

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
      title: 'HubSpot',
      code: null,
      connecting: false,
      disconnecting: false,
      eligible: true,
      fields: [],
      success: null,
      error: null,
      hubspotId: null,
      selectedField: null,
      selectedCategory: null,
      saving: false,
      syncDialog: false,
      syncError: false,
      syncing: false,
      mdiCheck,
      mdiClose,
      mdiPowerPlug,
      mdiPowerPlugOff,
      mdiBookOpenPageVariant,
      mdiHubspot,
      mdiCalculator,
      mdiAutorenew,
      mdiContentSave,
      mdiCloseCircle,
      websiteUrl: this.$config.WEBSITE_URL,
      appId: this.$config.HUBSPOT_APP_ID,
      clientId: this.$config.HUBSPOT_CLIENT_ID,
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
              portalId: this.hubspotId,
              fields: this.fields,
              autoSync: this.autoSync,
            } = (await this.$axios.get('hubspot')).data)
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
            portalId: this.hubspotId,
            fields: this.fields,
            autoSync: this.autoSync,
          } = (await this.$axios.get('hubspot')).data)
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
        await this.$axios.post(`hubspot/auth/${this.code}`)

        //
        ;({
          eligible: this.eligible,
          portalId: this.hubspotId,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('hubspot')).data)

        this.success = 'Connected to HubSpot.'
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
        await this.$axios.patch('hubspot', {
          fields: this.fields.filter(({ categorySlug }) => categorySlug),
        })

        //
        ;({
          eligible: this.eligible,
          portalId: this.hubspotId,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('hubspot')).data)

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
        await this.$axios.patch('hubspot', {
          autoSync: this.autoSync,
        })

        //
        ;({
          eligible: this.eligible,
          portalId: this.hubspotId,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('hubspot')).data)
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.savingAutoSync = false
    },
    async disconnect() {
      this.success = null
      this.error = null
      this.disconnecting = true

      try {
        await this.$axios.delete('hubspot')

        this.hubspotId = null

        this.success = 'Disconnected from HubSpot.'
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
        await this.$axios.post('hubspot/sync')

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
