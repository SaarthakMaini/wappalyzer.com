<template>
  <Page :title="title" :loading="!cardsLoaded" secure>
    <v-btn href="/plan/" class="mb-4" depressed>
      <v-icon left>
        {{ mdiTagOutline }}
      </v-icon>
      Manage subscription
    </v-btn>

    <v-card class="mb-4">
      <v-card-title>Credit cards</v-card-title>

      <CreditCards @load="cardsLoaded = true" />
    </v-card>
  </Page>
</template>

<script>
import { mdiTagOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import CreditCards from '~/components/CreditCards.vue'

export default {
  components: {
    Page,
    CreditCards,
  },
  data() {
    return {
      title: 'Payment methods',
      cardsLoaded: false,
      mdiTagOutline,
    }
  },
}
</script>
