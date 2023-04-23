<template>
  <div style="width: 100%">
    <v-card
      v-for="(set, setKey) in attributes"
      :key="setKey"
      class="mb-4 pb-4"
      :outlined="!$vuetify.theme.dark"
    >
      <v-sheet :color="$vuetify.theme.dark ? 'primary lighten-1' : 'secondary'">
        <v-card-title
          class="subtitle-2 d-flex justify-space-between"
          style="line-height: 1rem"
        >
          {{ set.title }}

          <span class="body-2 my-n2">
            <v-chip
              v-if="
                ['contact', 'company', 'social', 'signals'].includes(setKey)
              "
              to="/plus/"
              color="primary"
              class="ml-2"
              x-small
              outlined
              >PLUS</v-chip
            >
          </span>
        </v-card-title>
      </v-sheet>

      <Plus v-if="maskedSets.includes(setKey)" small />

      <div
        v-for="(attribute, attributeKey) in set.attributes"
        :key="attributeKey"
      >
        <v-card-title class="subtitle-2 pb-2">
          {{ attribute.title }}
        </v-card-title>

        <v-card-text class="pb-0">
          <v-simple-table
            v-if="
              ['email', 'verifiedEmail', 'safeEmail', 'phone'].includes(
                attributeKey
              ) || setKey === 'social'
            "
            class="mx-n4"
            style="max-width: none"
          >
            <tbody>
              <tr v-for="(value, index) in attribute.values" :key="index">
                <td
                  v-if="
                    ['email', 'verifiedEmail', 'safeEmail'].includes(
                      attributeKey
                    )
                  "
                  class="py-2"
                >
                  <nuxt-link :to="`/verify/${parseEmail(value.text).email}`">
                    <v-icon color="accent" class="mr-1" size="22">{{
                      mdiEmail
                    }}</v-icon
                    ><span
                      :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >{{ parseEmail(value.text).email }}</span
                    >
                  </nuxt-link>

                  <div
                    v-if="parseEmail(value.text).name"
                    :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                  >
                    {{ parseEmail(value.text).name }}
                    <span
                      v-if="parseEmail(value.text).title"
                      class="text--disabled"
                    >
                      &mdash;
                      {{ parseEmail(value.text).title }}
                    </span>
                  </div>
                </td>
                <td v-else-if="attributeKey === 'phone'">
                  <nuxt-link
                    :href="
                      maskedSets.includes(setKey)
                        ? undefined
                        : `tel:${value.text}`
                    "
                    :to="maskedSets.includes(setKey) ? '/plus/' : ''"
                  >
                    <v-icon color="accent" class="mr-1" size="22">{{
                      mdiPhone
                    }}</v-icon
                    ><span
                      :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >{{ value.text }}</span
                    >
                  </nuxt-link>
                </td>
                <td v-else-if="value.to">
                  <nuxt-link
                    :href="maskedSets.includes(setKey) ? undefined : value.to"
                    :to="maskedSets.includes(setKey) ? '/plus/' : ''"
                    rel="nofollow noopener"
                    target="_blank"
                  >
                    <v-icon
                      v-if="
                        [
                          'twitter',
                          'instagram',
                          'facebook',
                          'linkedin',
                          'youtube',
                          'github',
                          'pinterest',
                        ].includes(attributeKey)
                      "
                      color="accent"
                      class="mr-1"
                      size="22"
                    >
                      {{ mdi[attributeKey] }} </v-icon
                    ><span
                      :class="maskedSets.includes(setKey) ? 'blurred' : ''"
                      >{{ value.text }}</span
                    >
                  </nuxt-link>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <template v-else-if="['languages'].includes(attributeKey)">
            {{ attribute.values.map(({ text }) => text).join(', ') }}
          </template>
          <template v-else>
            <div v-for="(value, index) in attribute.values" :key="index">
              <v-icon v-if="value.text === true" color="success">
                {{ mdiCheck }}
              </v-icon>
              <v-icon v-else-if="value.text === false" color="error">
                {{ mdiClose }}
              </v-icon>
              <div
                v-else-if="attributeKey === 'employees'"
                :class="`mx-n4 ${
                  maskedSets.includes(setKey) ? 'blurred ' : ''
                }`"
              >
                <v-divider v-if="index" class="my-2" />

                <div class="px-4">
                  <span>{{ value.text.split(' -- ').shift() }}</span>
                  <span
                    v-if="value.text.split(' -- ').pop().length >= 3"
                    class="text--disabled"
                    >&mdash; {{ value.text.split(' -- ').pop() }}</span
                  >
                </div>
              </div>
              <span
                v-else-if="attributeKey === 'certInfo.validTo'"
                :class="`${maskedSets.includes(setKey) ? 'blurred ' : ''}`"
              >
                {{ formatDate(new Date(value.text * 1000)) }}
              </span>
              <span
                v-else-if="attributeKey === 'locations'"
                :class="`${maskedSets.includes(setKey) ? 'blurred ' : ''}`"
              >
                <a
                  :href="`https://maps.google.com/?q=${encodeURIComponent(
                    value.text
                  )}`"
                  target="_blank"
                >
                  {{ value.text }}
                </a>
              </span>
              <span
                v-else
                :class="`${
                  maskedSets.includes(setKey) &&
                  ['company', 'signals'].includes(setKey)
                    ? 'blurred '
                    : ''
                }`"
              >
                {{
                  !expanded[attributeKey] && value.text.length > 250
                    ? `${value.text.slice(0, 250)}...`
                    : typeof value.text === 'number' &&
                      attributeKey !== 'companyFounded'
                    ? attributeKey === 'fundingTotalUsd'
                      ? formatCurrency(value.text)
                      : formatNumber(value.text)
                    : value.text
                }}

                <a
                  v-if="value.text.length > 250"
                  href="#"
                  @click.prevent="toggle(attributeKey)"
                  >Show {{ expanded[attributeKey] ? 'less' : 'more' }}</a
                >
              </span>
            </div>
          </template>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import {
  mdiCheck,
  mdiClose,
  mdiTwitter,
  mdiFacebook,
  mdiInstagram,
  mdiLinkedin,
  mdiPhone,
  mdiEmail,
  mdiYoutube,
  mdiGithub,
  mdiPinterest,
} from '@mdi/js'

import Plus from '~/components/Plus.vue'

export default {
  components: {
    Plus,
  },
  props: {
    hostname: {
      type: Object,
      default() {
        return {}
      },
    },
    maskedSets: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      mdiCheck,
      mdiClose,
      mdiPhone,
      mdiEmail,
      mdi: {
        twitter: mdiTwitter,
        facebook: mdiFacebook,
        instagram: mdiInstagram,
        linkedin: mdiLinkedin,
        youtube: mdiYoutube,
        github: mdiGithub,
        pinterest: mdiPinterest,
      },
      expanded: {},
    }
  },
  computed: {
    attributes() {
      const hostname = Object.keys(this.hostname).reduce(
        (hostname, key) => ({
          ...hostname,
          ...([
            'verifiedEmail',
            'safeEmail',
            'copyrightYear',
            'responsive',
            'schemaOrgTypes',
          ].includes(key)
            ? {}
            : {
                [key]: this.hostname[key],
              }),
        }),
        {}
      )

      return this.transformAttributes(
        [
          'contact',
          'company',
          'social',
          'signals',
          'meta',
          'locale',
          'trackers',
          'security',
        ],
        hostname
      )
    },
  },
  methods: {
    toggle(attributeKey) {
      if (this.expanded[attributeKey]) {
        delete this.expanded[attributeKey]

        this.expanded = { ...this.expanded }
      } else {
        this.expanded = {
          ...this.expanded,
          [attributeKey]: true,
        }
      }
    },
    parseEmail(fullEmail) {
      const email = fullEmail.replace(/^[^<]*<([^>]+)>/, '$1')

      const [name, title] =
        email === fullEmail
          ? ['', '']
          : fullEmail.replace(/ <([^>]+)>$/, '').split(' -- ')

      return { email, name, title }
    },
  },
}
</script>

<style>
.nopadding .v-expansion-panel-content__wrap {
  padding-left: 0;
  padding-right: 0;
  padding-top: 0;
}

.blurred {
  filter: blur(3px);
  opacity: 0.5;
}
</style>
