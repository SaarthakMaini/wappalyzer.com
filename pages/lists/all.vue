<template>
  <Page :title="title" :loading="!lists && !error" secure>
    <v-alert v-if="error" type="error" class="mb-4" text>
      {{ error }}
    </v-alert>

    <template v-if="lists">
      <v-row align="center" class="mb-4">
        <v-col class="py-0">
          <v-btn href="/lists/" depressed>
            <v-icon left>
              {{ mdiPlus }}
            </v-icon>
            Create a new list
          </v-btn>
        </v-col>
        <v-col
          v-if="lists && lists.length !== myLists.length"
          class="py-0 text-right"
        >
          <v-switch
            v-model="viewMine"
            class="ma-0 d-inline-block"
            label="Show only my lists"
            hide-details
          />
        </v-col>
      </v-row>

      <v-alert v-if="!filteredLists.length" class="ma-0" color="info" text>
        You don't have any lists.
      </v-alert>
      <v-card v-else class="mb-4">
        <v-card-text class="px-0">
          <v-simple-table>
            <thead>
              <tr>
                <th width="20%">ID</th>
                <th width="1">Status</th>
                <th>Description</th>
                <th width="10%">Websites</th>
                <th width="1">Repeat</th>
                <th width="1"></th>
              </tr>
            </thead>
            <tbody>
              <template v-for="list in filteredLists">
                <v-tooltip bottom>
                  <template #activator="{ on }">
                    <v-hover v-slot="{ hover }">
                      <tr v-on="on" :key="list.createdAt">
                        <td style="white-space: nowrap">
                          <nuxt-link :to="`/lists/${list.id}/`">{{
                            list.id
                          }}</nuxt-link>

                          <v-tooltip
                            v-if="
                              list.status === 'Complete' &&
                              list.paymentMethod === 'free'
                            "
                            max-width="250"
                            top
                          >
                            <template #activator="{ on }">
                              <sup>
                                <v-icon small v-on="on">{{
                                  mdiGiftOutline
                                }}</v-icon>
                              </sup>
                            </template>

                            Free list
                          </v-tooltip>

                          <v-tooltip
                            v-if="list.repeatListId"
                            max-width="250"
                            top
                          >
                            <template #activator="{ on }">
                              <nuxt-link :to="`/lists/${list.repeatListId}/`"
                                ><sup>
                                  <v-icon color="accent" small v-on="on">{{
                                    mdiUpdate
                                  }}</v-icon>
                                </sup></nuxt-link
                              >
                            </template>

                            Weekly update for list {{ list.repeatListId }}.
                            Click to manage.
                          </v-tooltip>
                        </td>
                        <td>
                          <v-chip
                            :color="
                              list.status === 'Complete'
                                ? 'success'
                                : list.status === 'Calculating'
                                ? 'warning'
                                : list.status === 'Insufficient'
                                ? 'warning'
                                : list.status === 'Failed'
                                ? 'error'
                                : 'accent'
                            "
                            label
                            outlined
                            small
                          >
                            {{ list.status }}
                          </v-chip>
                        </td>
                        <td>
                          <template v-if="list.name">
                            {{ list.name }}
                          </template>

                          <v-chip-group
                            v-else-if="list.technologies.length"
                            column
                          >
                            <v-chip
                              v-for="technology in list.technologies.slice(
                                0,
                                10
                              )"
                              :key="technology"
                              small
                              outlined
                              label
                            >
                              {{ technology }}
                            </v-chip>
                            <v-chip
                              v-if="list.technologies.length > 10"
                              small
                              outlined
                              label
                            >
                              (+{{ list.technologies.length - 10 }} more)
                            </v-chip>
                          </v-chip-group>
                          <v-chip-group v-else-if="list.keywords.length" column>
                            <v-chip
                              v-for="keyword in list.keywords.slice(0, 10)"
                              :key="keyword"
                              small
                              outlined
                              label
                            >
                              {{ keyword }}
                            </v-chip>
                            <v-chip
                              v-if="list.keywords.length > 10"
                              small
                              outlined
                              label
                            >
                              (+{{ list.keywords.length - 10 }} more)
                            </v-chip>
                          </v-chip-group>
                          <v-chip-group v-else-if="list.tlds.length" column>
                            <v-chip
                              v-for="tld in list.tlds.slice(0, 10)"
                              :key="tld"
                              small
                              outlined
                              label
                            >
                              {{ tld }}
                            </v-chip>
                            <v-chip
                              v-if="list.tlds.length > 10"
                              small
                              outlined
                              label
                            >
                              (+{{ list.tlds.length - 10 }} more)
                            </v-chip>
                          </v-chip-group>
                        </td>
                        <td v-if="list.status === 'Calculating'">
                          <Spinner />
                        </td>
                        <td v-else>
                          {{ list.rows ? formatNumber(list.rows) : '-' }}
                        </td>
                        <td class="text-center">
                          <v-icon v-if="list.repeat">
                            {{ mdiUpdate }}
                          </v-icon>
                        </td>
                        <td style="white-space: nowrap">
                          <div :style="hover ? '' : 'visibility: hidden'">
                            <v-btn
                              color="accent"
                              icon
                              @click="
                                selected = list
                                editDialog = true
                              "
                            >
                              <v-icon>{{ mdiPencil }}</v-icon> </v-btn
                            ><v-btn
                              :disabled="list.status === 'Complete'"
                              color="error"
                              icon
                              @click="
                                selected = list
                                cancelDialog = true
                              "
                            >
                              <v-icon>{{ mdiDelete }}</v-icon>
                            </v-btn>
                          </div>
                        </td>
                      </tr>
                    </v-hover>
                  </template>

                  Created:
                  {{ formatDate(new Date(list.createdAt * 1000)) }}
                </v-tooltip>
              </template>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </template>

    <v-dialog v-model="editDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Edit list</v-card-title>
        <v-card-text>
          <v-alert v-if="editError" type="error" text>
            {{ editError }}
          </v-alert>

          <p>Name your list so you can find it back later.</p>

          <v-form ref="form" @submit.prevent="edit">
            <v-text-field
              v-model="selected.name"
              label="Name"
              :rules="[(v) => (v && v.length > 250 ? 'Name too long' : true)]"
              placeholder="My list"
              hide-details="auto"
              dense
              outlined
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="editDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="editing" color="error" text @click="edit">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="cancelDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Delete list</v-card-title>
        <v-card-text>
          <v-alert v-if="cancelError" type="error" text>
            {{ cancelError }}
          </v-alert>

          <div>
            The list <strong>{{ selected.id }}</strong> will be deleted.
          </div>
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
  </Page>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiPlus,
  mdiCheck,
  mdiUpdate,
  mdiPencil,
  mdiDelete,
  mdiGiftOutline,
} from '@mdi/js'
import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'

export default {
  components: {
    Page,
    Spinner,
  },
  data() {
    return {
      title: 'Lead lists',
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      editDialog: false,
      editError: false,
      editing: false,
      error: false,
      lists: null,
      mdiPlus,
      mdiCheck,
      mdiUpdate,
      mdiPencil,
      mdiDelete,
      mdiGiftOutline,
      selected: {},
      viewMine: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      impersonator: ({ user }) => user.impersonator,
    }),
    myLists() {
      return this.lists.filter(({ memberId }) =>
        this.isMember ? memberId === this.impersonator.sub : !memberId
      )
    },
    filteredLists() {
      return this.viewMine ? this.myLists : this.lists
    },
  },
  watch: {
    async '$store.state.user.isSignedIn'(isSignedIn) {
      if (isSignedIn) {
        try {
          this.lists = (await this.$axios.get('lists-site')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
  },
  async created() {
    if (this.$store.state.user.isSignedIn) {
      try {
        this.lists = (await this.$axios.get('lists-site')).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }
    }
  },
  methods: {
    async edit() {
      this.editError = false
      this.editing = true

      try {
        await this.$axios.patch(`lists-site/${this.selected.id}`, {
          name: this.selected.name,
        })

        try {
          this.lists = (await this.$axios.get('lists-site')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.editDialog = false
      } catch (error) {
        this.editError = this.getErrorMessage(error)
      }

      this.editing = false
    },
    async cancel() {
      this.cancelError = false
      this.cancelling = true

      try {
        await this.$axios.delete(`lists-site/${this.selected.id}`)

        try {
          this.lists = (await this.$axios.get('lists-site')).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }

        this.cancelDialog = false
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
  },
}
</script>
