<template>
  <Page
    :title="title"
    :head="{ title, subtitle: list && list.name }"
    :crumbs="[{ title: 'Technology lookups', to: '/lookup/lists/' }]"
    :loading="!list && !error"
    secure
  >
    <div v-if="list && list.name" class="mb-2"></div>

    <v-alert v-if="success" type="success" blist="left" text prominent>
      {{ success }}
    </v-alert>

    <v-alert
      v-if="error"
      type="error"
      blist="left"
      :icon="mdiAlertOctagonOutline"
      text
      prominent
    >
      {{ error }}
    </v-alert>

    <template v-if="list">
      <v-alert
        v-if="list.status === 'Processing'"
        type="info"
        blist="left"
        text
        prominent
      >
        Your list is being processed. You'll receive an email when it's ready.
      </v-alert>

      <v-alert
        v-if="list.status === 'Complete'"
        type="success"
        blist="left"
        text
        prominent
      >
        Your list is ready.
      </v-alert>

      <v-alert
        v-if="list.status === 'Failed'"
        :icon="mdiAlertOctagonOutline"
        type="error"
        border="left"
        text
        prominent
      >
        Sorry, something went wrong during the processing of your list. Please
        contact us.
      </v-alert>

      <v-btn
        v-if="isAdmin"
        :loading="processing"
        color="success"
        class="mr-2 mb-4"
        outlined
        @click="process"
      >
        <v-icon left>
          {{ mdiReload }}
        </v-icon>
        Process list
      </v-btn>

      <v-btn
        v-if="list.status === 'Complete'"
        :href="`${bulkLookupBaseUrl}${list.bulk.filename}`"
        color="success"
        class="mr-2 mb-4"
        depressed
      >
        <v-icon left> {{ mdiDownload }} </v-icon>Download list
      </v-btn>

      <div
        v-if="list.status === 'Processing'"
        class="text-center mb-n6"
        style="padding: 100px 0"
      >
        <div v-if="playGame">
          <TicTacToe class="mt-6" />

          <div class="mt-6">
            <small
              ><a
                class="text--disabled text-decoration-underline"
                @click="playGame = false"
                >Close</a
              ></small
            >
          </div>
        </div>
        <template v-else>
          <v-progress-circular
            color="accent"
            size="100"
            width="5"
            :value="progress"
            :indeterminate="!progress || progress === 100"
          >
            <small>
              {{
                progress === 100
                  ? 'Finalising...'
                  : progress
                  ? `${progress}%`
                  : 'Starting...'
              }}
            </small>
          </v-progress-circular>

          <div class="mt-6">
            <small
              ><a
                class="text--disabled text-decoration-underline"
                @click="playGame = true"
                >Play a game?</a
              ></small
            >
          </div>
        </template>
      </div>
      <v-card v-else class="mb-4">
        <template v-if="isAdmin">
          <v-card-title>Administration</v-card-title>
          <v-card-text class="px-0">
            <v-simple-table>
              <tbody>
                <tr>
                  <th width="30%">User ID</th>
                  <td>
                    <code class="small">{{ list.userId }}</code>
                  </td>
                </tr>
                <tr>
                  <th>Timestamp</th>
                  <td>
                    <code class="small">{{ list.createdAt }}</code>
                  </td>
                </tr>
                <tr>
                  <th>Filename</th>
                  <td>
                    <code class="small">{{ list.bulk.filename }}</code>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>

            <v-divider />
          </v-card-text>
        </template>
        <v-card-text class="px-0">
          <v-simple-table>
            <tbody>
              <tr>
                <th width="30%">Created</th>
                <td>
                  {{ formatDate(new Date(list.createdAt * 1000)) }}
                </td>
              </tr>
              <tr>
                <th>Websites</th>
                <td>
                  {{ formatNumber(list.bulk.rows) }}
                </td>
              </tr>
              <tr v-if="list.bulk.live && !list.bulk.noCrawl">
                <th>Live scan</th>
                <td>
                  <v-icon color="primary">
                    {{ mdiCheckboxMarked }}
                  </v-icon>
                </td>
              </tr>
              <tr v-if="list.bulk.noCrawl">
                <th>No live scans</th>
                <td>
                  <v-icon color="primary">
                    {{ mdiCheckboxMarked }}
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>

      <div v-if="list.status === 'Failed'" class="mt-4">
        <v-btn color="error" outlined @click="cancelDialog = true">
          <v-icon left>
            {{ mdiDelete }}
          </v-icon>
          Delete list
        </v-btn>
      </div>

      <v-dialog v-model="cancelDialog" max-width="400px" eager>
        <v-card>
          <v-card-title>Delete list</v-card-title>
          <v-card-text>
            <v-alert v-if="cancelError" type="error" text>
              {{ cancelError }}
            </v-alert>

            <div>The list will be deleted.</div>
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
    </template>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiPencil,
  mdiReload,
  mdiDownload,
  mdiAlertOctagonOutline,
  mdiCheckboxMarked,
  mdiDelete,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Progress from '~/components/Progress.vue'
import TicTacToe from '~/components/TicTacToe.vue'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Progress,
    TicTacToe,
  },
  data() {
    return {
      title: 'Technology lookup',
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      checks: 0,
      bulkLookupBaseUrl: this.$config.BULK_LOOKUP_BASE_URL,
      error: false,
      mdiPencil,
      mdiReload,
      mdiDownload,
      mdiAlertOctagonOutline,
      mdiCheckboxMarked,
      mdiDelete,
      list: null,
      listLoaded: false,
      playGame: false,
      processing: false,
      sets,
      statusItems: ['Open', 'Processing', 'Insufficient', 'Failed', 'Complete'],
      totalCredits: 0,
      success: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
    }),
    progress() {
      return this.list
        ? Math.min(
            100,
            Math.ceil(
              (100 / (this.list.bulk.rows || 1)) *
                (this.list.bulk.rowsProcessed || 0)
            )
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

          this.list = (await this.$axios.get(`lookup-site/lists/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    list({ id, status, totalCredits }) {
      this.totalCredits = totalCredits

      if (!this.listLoaded) {
        this.listLoaded = true
      }

      if (status === 'Processing') {
        setTimeout(async () => {
          this.list = (await this.$axios.get(`lookup-site/lists/${id}`)).data
        }, 5000)
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      const { id } = this.$route.params

      try {
        this.getCredits()

        this.list = (await this.$axios.get(`lookup-site/lists/${id}`)).data
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
        await this.$axios.patch(`lookup-site/lists/${this.list.id}`, {
          process: true,
        })

        this.list = (
          await this.$axios.get(`lookup-site/lists/${this.list.id}`)
        ).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.processing = false
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true
      this.success = false

      try {
        const { id } = this.$route.params

        await this.$axios.delete(`lookup-site/lists/${id}`)

        this.$router.push({ path: '/lookup/lists/' })
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
  },
}
</script>
