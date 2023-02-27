<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">{{ title }}</h1>

      <p>Enumerate subdomains for a domain.</p>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        Results come from our database of millions of websites and mainly
        include actively visited subdomains that serve website content.
        Subdomains may be missing or fail to resolve. This API serves as a tool
        for discovery, not for comprehensive DNS lookups.
      </v-alert>

      <Heading id="endpoint" size="2" class="mt-8 mb-4">Endpoint</Heading>

      <p>
        <code>GET</code> <code>https://api.wappalyzer.com/v2/subdomains/</code>
      </p>

      <Heading id="properties" size="2" class="mt-8 mb-4">Properties</Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Property</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Execution</td>
              <td>Synchronous</td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>10 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>1 credit per 10 subdomains<br /></td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="parameters" size="2" class="mt-8 mb-4"
        >Query string parameters</Heading
      >

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>domains</code>&nbsp;<em class="text--disabled"
                  >(required)</em
                >
              </td>
              <td>
                <p>Between one and ten domain names, comma separated.</p>

                <p>
                  Example:
                  <code>example.com,example.org</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>limit</code>
              </td>
              <td>
                <p>
                  The maximum number of results to return. Must be a multiple of
                  10.
                </p>

                <p>
                  Example:
                  <code>100</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>after</code>
              </td>
              <td>
                <p>
                  Get the next page of results by passing the value of
                  <code>moreAfter</code> from a previous response.
                </p>

                <p>
                  Example:
                  <code>shop.example.com</code>.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="response" size="2" class="mt-8 mb-4">Response body</Heading>

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>subdomains</code>
              </td>
              <td>List of subdomains found for the domain.</td>
            </tr>
            <tr>
              <td>
                <code>moreAfter</code>
              </td>
              <td>
                Indicates that more results are available. To get the next page
                of results, set this value as the <code>after</code> parameter
                in a subsequent query.
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="example" size="2" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/subdomains/?domains=example.com"</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>
      <pre><Code>{
  "subdomains": {
    "status.example.com": {
      "createdAt": 1670285563,
      "updatedAt": 1675604779
    },
    ...
    "shop.example.com": {
      "createdAt": 1670285563,
      "updatedAt": 1675604779
    }
  },
  "moreAfter": "shop.example.com"
}</Code></pre>
    </Page>
  </div>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import Code from '~/components/Code.vue'
import side from '~/assets/json/nav/docs.json'

export default {
  components: {
    Page,
    Heading,
    Code,
  },
  data() {
    return {
      title: 'Subdomain finder',
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
      mdiLightbulbOnOutline,
    }
  },
}
</script>

<style>
td {
  padding-top: 0.2rem !important;
  padding-bottom: 0.2rem !important;
}
</style>
