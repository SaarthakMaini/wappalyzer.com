<!-- eslint-disable vue/no-v-html -->
<template>
  <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
    <h1 class="mb-2">
      {{ title }}
    </h1>

    <p style="max-width: 600px" class="mb-6">
      Each data product includes a set of base fields, such as websites and
      technologies. Additional fields can optionally be included.
    </p>

    <v-expansion-panels>
      <v-expansion-panel
        v-for="set in sets.filter(({ disabled }) => !disabled)"
        :key="set.key"
      >
        <v-expansion-panel-header>
          {{ set.name
          }}<span class="body-2 my-n1"
            ><code
              v-if="set.key && !set.key.startsWith('base-')"
              class="ml-2"
              >{{ set.key }}</code
            >
          </span>
          <v-spacer />
          <v-chip
            v-if="set.pro"
            color="primary"
            class="mx-2 flex-grow-0"
            x-small
            outlined
            >PRO</v-chip
          >
        </v-expansion-panel-header>

        <v-expansion-panel-content class="no-x-padding" eager>
          <Pro v-if="set.pro" class="mb-4" small />

          <v-simple-table>
            <tbody>
              <tr>
                <th width="25%">Field</th>
                <th>Description</th>
              </tr>
              <tr v-for="attr in set.attributes" :key="attr.key">
                <td>
                  <code>{{ attr.key }}</code>
                </td>
                <td v-html="attr.description" />
              </tr>
            </tbody>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </Page>
</template>

<script>
import { mdiInformationOutline, mdiLink } from '@mdi/js'

import Page from '~/components/Page.vue'
import Pro from '~/components/Pro.vue'
import side from '~/assets/json/nav/docs.json'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Pro,
  },
  data() {
    return {
      title: 'Fields',
      mdiInformationOutline,
      mdiLink,
      side,
      sets,
      crumbs: [{ title: 'Developer documentation', to: '/docs/' }],
    }
  },
}
</script>
