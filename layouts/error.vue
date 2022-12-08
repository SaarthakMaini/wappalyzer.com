<template>
  <Page :title="redirecting ? '' : title" no-hero no-subscribe no-head narrow>
    <div v-if="!redirecting" class="text-center py-12">
      <h1 class="mt-n2 mb-4">{{ title }}</h1>

      <p v-if="subtitle" class="subtitle-2 mt-n4">
        {{ subtitle }}
      </p>

      <p v-else-if="text" class="head-text mt-n2" v-html="text" />

      <v-alert v-if="statusCode !== 404" color="error" class="mt-10" text>
        {{ message }}

        <template v-if="code">
          <br /><br />
          Reference: {{ code }}
        </template>
      </v-alert>

      <div v-if="statusCode === 404" class="mt-16">
        <TicTacToe />
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '~/components/Page.vue'
import TicTacToe from '~/components/TicTacToe.vue'

export default {
  components: {
    Page,
    TicTacToe,
  },
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  beforeCreate() {
    if (!this.$route.path.endsWith('/')) {
      this.$router.replace(this.$route.path + '/')
    }
  },
  data() {
    return {
      statusCode: this.error.response
        ? this.error.response.status
        : this.error.statusCode,
      message: this.error.response
        ? this.error.response.data.message || this.error.response.data
        : this.error.message || this.error.toString(),
      code: (this.error.response && this.error.response.code) || '',
      redirecting: !this.$route.path.endsWith('/'),
    }
  },
  computed: {
    title() {
      return this.statusCode >= 500
        ? 'Something went wrong'
        : this.statusCode === 404
        ? 'Page not found'
        : this.statusCode >= 400
        ? 'Request error'
        : 'Something went wrong'
    },
    subtitle() {
      return this.statusCode === 404
        ? ''
        : `${
            this.statusCode === 500
              ? 'Internal server error'
              : this.statusCode === 502
              ? 'Bad gateway'
              : this.statusCode === 503
              ? 'Unavailable'
              : this.statusCode === 400
              ? 'Bad request'
              : this.statusCode === 401
              ? 'Unauthorised'
              : this.statusCode === 403
              ? 'Forbidden'
              : this.statusCode === 409
              ? 'Too many requests'
              : ''
          } (error ${this.statusCode})`
    },
    text() {
      return this.statusCode === 404
        ? "Sorry, the content you're looking for isn't here."
        : "Sorry, something went wrong. Try reloading the page or <a href='/contact'>contact us</a> if the issue persists."
    },
  },
}
</script>
