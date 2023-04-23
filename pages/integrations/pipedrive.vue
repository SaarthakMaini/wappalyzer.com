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
            :href="`https://marketplace.pipedrive.com/app/wappalyzer/${clientId}`"
            rel="noopener"
            target="_blank"
            >Pipedrive</a
          >
          to see the technology stacks of your leads without leaving your CRM.
        </p>
      </v-col>
    </v-row>

    <div class="mb-4">
      <v-btn to="/docs/integrations/pipedrive/" class="mr-2" depressed>
        <v-icon left>
          {{ mdiBookOpenPageVariant }}
        </v-icon>
        Documentation
      </v-btn>
      <v-btn
        href="https://marketplace.pipedrive.com/app/wappalyzer/${clientId}"
        target="_blank"
        depressed
      >
        <v-icon left>
          {{ mdiStore }}
        </v-icon>
        Marketplace
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
                  :color="pipedriveId ? 'success' : ''"
                  outlined
                  small
                  label
                >
                  <v-icon v-if="pipedriveId" small left>
                    {{ mdiCheck }}
                  </v-icon>
                  {{ pipedriveId ? `Connected` : 'Not connected' }}
                </v-chip>
              </td>
            </tr>
            <tr v-if="pipedriveId">
              <th>Pipedrive account ID</th>
              <td>
                {{ pipedriveId }}
              </td>
            </tr>

            <tr />
          </tbody>
        </v-simple-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!pipedriveId"
          :href="`https://oauth.pipedrive.com/oauth/authorize?redirect_uri=${websiteUrl}/integrations/pipedrive/&client_id=${clientId}`"
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

    <v-card v-if="pipedriveId" class="mb-4">
      <v-divider />

      <v-card-title>Field mappings</v-card-title>

      <v-card-text style="max-width: 600px">
        <p class="mb-0">
          Manage custom fields in
          <a
            :href="`${user.pipedriveBaseUrl}/settings/fields`"
            target="_blank"
            rel="noopener"
            >Pipedrive settings</a
          >
          &rarr;
          <v-chip small label outlined> Data fields </v-chip>
          &rarr; <v-chip small label outlined> Organization </v-chip> &rarr;
          <v-chip small label outlined> Custom fields </v-chip>.
        </p>
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2"> Website field </v-card-title>
      <v-card-text>
        <p style="max-width: 600px">
          Select the Pipedrive field that contains the website URL for
          organisations. This URL is used to display the website's technology
          stack in a panel on organisation pages.
        </p>

        <v-select
          v-model="orgWebsiteField"
          :items="[
            { text: 'Select a custom field...', value: '' },
            ...fields.map(({ key, name }) => ({ text: name, value: key })),
          ]"
          dense
          outlined
          eager
        />
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2"> Technologies </v-card-title>
      <v-card-text class="px-0">
        <div class="mx-4" style="max-width: 600px">
          <p>
            Map technology categories to custom Pipedrive fields on
            organisations. These fields will be populated during a sync.
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
              <th>Pipedrive field</th>
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
              label="Pipedrive field"
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

    <v-card v-if="pipedriveId">
      <v-divider />

      <v-card-title>Synchronise</v-card-title>

      <v-card-text style="max-width: 600px">
        <p>
          By default, Wappalyzer shows a panel on people and organisations with
          the most up-to-date technology information. It's also possible to save
          information to organisation records, which you can use to create
          custom reports in Pipedrive.
        </p>

        <p class="mb-0">Each successully updated record cost 1 credit.</p>
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2">Existing organisations</v-card-title>
      <v-card-text style="max-width: 600px">
        <p>
          Append technology information to all existing organisation records
          using the above field mappings.
        </p>

        <v-row>
          <v-col>
            <v-btn
              color="primary lighten-1 primary--text"
              :disabled="!orgWebsiteField || !assignedFields.length"
              depressed
              @click="syncDialog = true"
            >
              <v-icon left>
                {{ mdiAutorenew }}
              </v-icon>
              Update all organisations
            </v-btn>
          </v-col>
        </v-row>

        <v-switch
          v-model="autoSync"
          label="Run automatically once a month"
          :disabled="!orgWebsiteField || !assignedFields.length"
          :loading="savingAutoSync"
          hide-details
          inset
          @change="saveAutoSync"
        />
      </v-card-text>

      <v-divider />

      <v-card-title class="subtitle-2"> New organisations </v-card-title>
      <v-card-text>
        <p style="max-width: 600px">
          To automatically populate technology information on new organisation
          records, create a webhook:
        </p>

        <ul>
          <li>
            Go to
            <a
              :href="`${user.pipedriveBaseUrl}/settings/fields`"
              target="_blank"
              rel="noopener"
              >Pipedrive settings</a
            >
            &rarr;
            <v-chip small label outlined> Webhooks </v-chip>
            &rarr;
            <v-chip small label outlined> Create new webhook </v-chip>
          </li>
          <li>
            Set <v-chip small label outlined> Event action </v-chip> to 'added'
            and <v-chip small label outlined> Event object </v-chip> to
            'organization'.
          </li>
          <li>
            In the <v-chip small label outlined> Endpoint URL </v-chip> field,
            enter
            <code>https://api.wappalyzer.com/pipedrive/v2/organisation</code>
          </li>
        </ul>
      </v-card-text>
    </v-card>

    <v-dialog v-model="syncDialog" max-width="400px">
      <v-card>
        <v-card-title>Update all organisations</v-card-title>
        <v-card-text>
          <v-alert v-if="syncError" type="error" class="mb-4" text>
            {{ syncError }}
          </v-alert>

          This sync costs 1 credit per organisation and may take some time to
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
  mdiStore,
  mdiCalculator,
  mdiContentSave,
  mdiCloseCircle,
  mdiAutorenew,
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
    return { categories: (await $axios.get('categories')).data || [] }
  },
  data() {
    return {
      title: 'Pipedrive',
      code: null,
      connecting: false,
      disconnecting: false,
      eligible: true,
      fields: [],
      success: null,
      error: null,
      orgWebsiteField: null,
      pipedriveId: null,
      recompute: 0,
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
      mdiStore,
      mdiCalculator,
      mdiContentSave,
      mdiCloseCircle,
      mdiAutorenew,
      websiteUrl: this.$config.WEBSITE_URL,
      clientId: this.$config.PIPEDRIVE_CLIENT_ID,
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
              id: this.pipedriveId,
              orgWebsiteField: this.orgWebsiteField,
              fields: this.fields,
              autoSync: this.autoSync,
            } = (await this.$axios.get('pipedrive')).data)
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
            id: this.pipedriveId,
            orgWebsiteField: this.orgWebsiteField,
            fields: this.fields,
            autoSync: this.autoSync,
          } = (await this.$axios.get('pipedrive')).data)
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
        await this.$axios.post(`pipedrive/auth/${this.code}`)

        //
        ;({
          eligible: this.eligible,
          id: this.pipedriveId,
          orgWebsiteField: this.orgWebsiteField,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('pipedrive')).data)

        this.success = 'Connected to Pipedrive.'
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
        await this.$axios.patch('pipedrive', {
          orgWebsiteField: this.orgWebsiteField,
          fields: this.fields.filter(({ categorySlug }) => categorySlug),
        })

        //
        ;({
          eligible: this.eligible,
          id: this.pipedriveId,
          orgWebsiteField: this.orgWebsiteField,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('pipedrive')).data)

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
        await this.$axios.patch('pipedrive', {
          autoSync: this.autoSync,
        })

        //
        ;({
          eligible: this.eligible,
          id: this.pipedriveId,
          orgWebsiteField: this.orgWebsiteField,
          fields: this.fields,
          autoSync: this.autoSync,
        } = (await this.$axios.get('pipedrive')).data)
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
        await this.$axios.delete('pipedrive')

        this.pipedriveId = null

        this.success = 'Disconnected from Pipedrive.'
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
        await this.$axios.post('pipedrive/sync')

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
