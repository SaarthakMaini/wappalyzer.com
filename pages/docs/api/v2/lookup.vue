<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">{{ title }}</h1>

      <p>
        Find out the technology stack of any website, such as the CMS or
        ecommerce platform. Perform near-instant queries against our
        comprehensive database of millions of websites or analyse websites live
        for real-time results.
      </p>

      <p>
        In addition to technologies, responses optionally include company
        details, verified email addresses, phone numbers, social media profiles,
        locale information, keywords, metadata and more.
      </p>

      <Heading id="endpoint" size="2" class="mt-8 mb-2"> Endpoint </Heading>

      <p><code>GET</code> <code>https://api.wappalyzer.com/v2/lookup/</code></p>

      <Heading id="properties" size="2" class="mt-8 mb-2">Properties</Heading>

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
              <td>
                Synchronous<br />
                Asynchronous when using <code>recursive=true</code>
              </td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>30 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second (up to 10 URLs per request)</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>
                1 credit per URL<br />
                2 credits per URL when using
                <code>live=true</code> with <code>recursive=true</code>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="parameters" size="2" class="mt-8 mb-2"
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
                <code>urls</code>&nbsp;<em class="text--disabled"
                  >(required)</em
                >
              </td>
              <td class="pt-4">
                <p>Between one and ten website URLs, comma separated.</p>

                <p>
                  Example:
                  <code>https://example.com,https://example.org</code>.
                </p>

                <p>
                  Multiple URLs are not supported with
                  <code>recursive=false</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>live</code>
              </td>
              <td class="pt-4">
                <p>
                  Scan websites in real-time. Defaults to <code>false</code> to
                  return cached results from our database (faster and more
                  complete).
                </p>

                <p>
                  If no record is found, <code>live=true</code> is automatically
                  used instead. Use <code>recursive=false</code> to get live
                  results in the same request.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>recursive</code></td>
              <td class="pt-4">
                <p>
                  Index multiple pages (follows internal website links for
                  increased coverage). Defaults to <code>true</code> for best
                  results.<br />
                </p>

                <p>
                  If no record is found or <code>live=true</code> is used, using
                  <code>recursive=true</code> causes the request to be completed
                  asynchronously, meaning technologies will not be included in
                  the initial response and the website is being crawled. To get
                  the results when they become available, use
                  <code>callback_url</code> or repeat the request at a later
                  time (free for up to one hour).
                </p>

                <p>
                  A crawl can take up to 15 minutes. We recommend using
                  <code>callback_url</code> or repeating the request up to three
                  times every five minutes.
                </p>

                <p>
                  When using both <code>live=true</code> and
                  <code>recursive=true</code>, <code>callback_url</code> is
                  required and requests cost two credits instead of one.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>callback_url</code></td>
              <td class="pt-4">
                <p>
                  When an asynchronous request completes, a
                  <code>POST</code> request is made to the callback URL with the
                  results. A callback URL is an public endpoint hosted on your
                  own server.
                </p>

                <p>Example: <code>https://yourdomain.com/wappalyzer</code>.</p>

                <p>
                  Required when using both <code>live=true</code> and
                  <code>recursive=true</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>debug_email</code></td>
              <td class="pt-4">
                <p>
                  Send debug information to the specified email address when
                  using <code>callback_url</code>. If you're not receiving any
                  results on your callback URL, use this to get more detailed
                  information.
                </p>

                <p>Example: <code>john@example.com</code>.</p>

                <p>
                  For testing purposes only, please do not use in production.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>sets</code></td>
              <td class="pt-4">
                <p>
                  Comma-separated list of additional field sets to include in
                  the results (e.g. <code>meta,social</code>). Some fields
                  require an eligible plan.
                </p>

                <p></p>

                <p>
                  See
                  <nuxt-link to="/docs/fields/">Fields</nuxt-link>.
                </p>

                <p>
                  Use
                  <code>all</code> to include all fields.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>denoise</code></td>
              <td class="pt-4">
                <p>
                  Exclude low confidence results. Defaults to <code>true</code>.
                  Setting this to <code>false</code> yields more results but is
                  more likely to include false positives.
                </p>
              </td>
            </tr>
            <tr>
              <td><code>min_age</code></td>
              <td class="pt-4">
                <p>
                  Return results that have been verified at least once before
                  <code>min_age</code> months ago. Defaults to
                  <code>0</code> for most recent results.
                </p>

                <p>
                  Use a higher value in combination with
                  <code>squash=false</code> and <code>max_age</code> for
                  historic results grouped by month (up to 12 months per
                  request).
                </p>
              </td>
            </tr>
            <tr>
              <td><code>max_age</code></td>
              <td class="pt-4">
                <p>
                  Return results that have been verified at least once in the
                  last <code>max_age</code> months. Defaults to
                  <code>2</code> for best results.
                </p>

                <p>
                  To get the most up-to-date but fewer results, use
                  <code>max_age=1</code>. For real-time results, use
                  <code>live=true</code> instead.
                </p>

                <p>
                  Use a higher value to get more but less recently verified
                  results. These results are more likely to include websites
                  that no longer use the technology.
                </p>

                <p>
                  Use a higher value in combination with
                  <code>squash=false</code> and optionally
                  <code>min_age</code> for historic results grouped by month (up
                  to 12 months per request).
                </p>
              </td>
            </tr>
            <tr>
              <td><code>squash</code></td>
              <td class="pt-4">
                <p>
                  Merge monthly results into a single set. Defaults to
                  <code>true</code>. Set to <code>false</code> to group results
                  by month.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="callback" size="2" class="mt-8 mb-4"
        >Response callback</Heading
      >

      <p>
        A callback URL is a public endpoint hosted on your own server. If you
        request a domain that we haven't seen before, you'll initially get an
        empty response while the website is being indexed. Minutes later, your
        callback URL will receive a POST request with the final results. Without
        a callback URL, you will not get these results unless you make another
        request or use <code>recursive=false</code> to peform a shallow scan.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        To verify that the request was made by Wappalyzer, enable
        <nuxt-link :to="{ path: '/docs/api/v2/basics', hash: 'signatures' }">
          callback signatures </nuxt-link
        >.
      </v-alert>

      <Heading id="examples" size="2" class="mt-8 mb-2">Examples</Heading>

      <v-expansion-panels class="mb-8" multiple>
        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Cached results with live fallback (deep scan)
            <div class="text-right mr-4">
              <v-chip outlined label small>Recommended</v-chip>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              This method provides the most complete results. Results are
              recently verified and cached for speed. When no record is found, a
              deep scan is performed and results are sent to your callback URL
              within minutes.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              In this example we request two URLs with a callback URL and the
              default options.
            </p>

            <pre
              class="mt-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://example.com,https://example.org&amp;callback_url=https://yourdomain.com"</Code></pre>

            <h4 class="mt-8 mb-2">Response (success)</h4>

            <p>
              We get a result for each URL, in this case one successful and one
              empty. An empty response means the website has either not been
              indexed or no technologies were found. The
              <code>crawl</code> field indicates that a crawl has been
              initiated. When ready, results will be sent to the callback URL
              provided.
            </p>

            <pre><Code>[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "slug": "craft-cms",
        "name": "Craft CMS",
        "cpe": "cpe:2.3:a:craftcms:craft_cms:*:*:*:*:*:*:*:*",
        "categories": [
          {
            "id": 1,
            "slug": "cms",
            "name": "CMS"
          }
        ],
        "versions": [
          "3.0.0"
        ],
        "trafficRank": 1000,
        "confirmedAt": 1612824037,
      }
    ]
  },
  {
    "url": "https://example.org",
    "technologies": [], // No results available
    "crawl": true // Crawl initiated
  }
]
</Code></pre>

            <h4 class="mt-8 mb-2">Response (error)</h4>

            <pre><Code>[
  {
    "url": "https://example.com",
    "errors": [
      "Something went wrong"
    ]
  }
]</Code></pre>

            <h4 class="mt-8 mb-2">Callback response</h4>

            <p>
              The callback URL will receive a POST request when results become
              available. The callback URL will be invoked seperately for each
              requested URL.
            </p>

            <pre><Code>{
  "url": "https://example.com",
  "technologies": [
    {
      "slug": "craft-cms",
      "name": "Craft CMS",
      "cpe": "cpe:2.3:a:craftcms:craft_cms:*:*:*:*:*:*:*:*",
      "versions": [
        "3.0.0"
      ],
      "categories": [
        {
          "id": 1,
          "slug": "cms",
          "name": "CMS"
        }
      ]
    }
  ]
}</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Cached results with live fallback (shallow
            scan)</v-expansion-panel-header
          >
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              This method always returns immediate results and doesn't require a
              callback URL. Results are recently verified and cached for speed.
              When no record is found, a shallow scan is performed and results
              are included in the same request.
              <br /><br />
              Supports only one URL per request.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              In this example we request a URL with
              <code>recursive=false</code> and no callback URL.
            </p>

            <p>
              If no record is found, the URL is scanned and results are included
              in the same request. This can take up to 30 seconds, depending on
              the speed of the website.
            </p>

            <pre
              class="mt-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://example.com&amp;recursive=false"</Code></pre>

            <h4 class="mt-8 mb-2">Response</h4>

            <pre><Code>[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "slug": "craft-cms",
        "name": "Craft CMS",
        "cpe": "cpe:2.3:a:craftcms:craft_cms:*:*:*:*:*:*:*:*",
        "categories": [
          {
            "id": 1,
            "slug": "cms",
            "name": "CMS"
          }
        ],
        "versions": [
          "3.0.0"
        ],
        "trafficRank": 1000,
        "confirmedAt": 1612824037,
      }
    ]
  },
]
</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Live results with callback (deep scan)</v-expansion-panel-header
          >
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              This method provides the most up-to-date results. A deep scan is
              performed on every URL and results are sent to your callback URL
              within minutes.
              <br /><br />
              Costs 2 credits per request.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              Here we use <code>live=true</code> to get real-time results.
              Requests will always invoke a crawl and the initial responses are
              empty. When a crawl completes up to 15 minutes later, the callback
              URL receives the results in a <code>POST</code> request.
            </p>

            <pre
              class="my-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://example.com,https://example.org&amp;live=true&amp;callback_url=https://yourdomain.com"</Code></pre>

            <h4 class="mt-8 mb-2">Response</h4>

            <pre><Code>[
  {
    "url": "https://example.com",
    "crawl": true // Crawl initiated
  },
  {
    "url": "https://example.org",
    "crawl": true // Crawl initiated
  }
]</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Live results without callback (shallow
            scan)</v-expansion-panel-header
          >
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              This method provides the most up-to-date results without the need
              for a callback URL. A shallow scan is performed on every URL and
              results are included in the same request.
              <br /><br />
              Supports only one URL per request.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              To get immediate, real-time results, we use
              <code>live=true</code> and <code>recursive=false</code>. Only a
              single page is analysed, resulting in fast but less complete
              results. Requests usually take a few seconds to complete,
              depending on the speed of the website that's being analysed.
            </p>

            <pre
              class="mt-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://example.com&amp;live=true&amp;recursive=false"</Code></pre>

            <h4 class="mt-4 mb-2">Response</h4>

            <pre><Code>[
  {
    "url": "https://example.com",
    "technologies": [
      {
        "slug": "craft-cms",
        "name": "Craft CMS",
        "cpe": "cpe:2.3:a:craftcms:craft_cms:*:*:*:*:*:*:*:*",
        "versions": [
          "3.0.0"
        ],
        "categories": [
          {
            "id": 1,
            "slug": "cms",
            "name": "CMS"
          }
        ]
      }
    ]
  }
]</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Using sets</v-expansion-panel-header
          >
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              Include additional data points in results at no extra cost.
              <br /><br />A PRO plan is required for certain fields.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              In this example we use <code>sets=company,contact</code> to
              include company and contact details in the results. For a list of
              all available fields, see
              <nuxt-link to="/docs/fields/">Fields</nuxt-link>.
            </p>

            <pre
              class="mt-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://www.wappalyzer.com&amp;sets=company,contact"</Code></pre>

            <h4 class="mt-8 mb-2">Response</h4>

            <pre><Code>[
  {
    "url": "https://www.wappalyzer.com",
    "technologies": [
      {
        "slug": "stripe",
        "name": "Stripe",
        "versions": [ "3" ],
        "categories": [
          {
            "id": 1,
            "slug": "payment-processors",
            "name": "Payment processors"
          }
        ],
        "trafficRank": 1000,
        "confirmedAt": 1612824037
      },
      ...
    ],
    "email": [ "hello@wappalyzer.com", "elbert@wappalyzer.com" ],
    "verifiedEmail": [ "hello@wappalyzer.com", "elbert@wappalyzer.com" ],
    "safeEmail": [ "elbert@wappalyzer.com" ],
    "phone": [ "+61 ..." ],
    "companyName": "Wappalyzer",
    "inferredCompanyName": "WAPPALYZER",
    "industry": "Internet",
    "about": "Wappalyzer uncovers the technologies used on websites.",
    "locations": [ "Melbourne, VIC 3000, AU" ],
    "companySize": "2-10 employees",
    "companyType": "Privately Held",
    "companyFounded": 2008,
    "employees": [
      {
        "name": "Elbert Alias",
        "title": "Founder of Wappalyzer"
      },
      ...
    ]
  }
]</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header class="subtitle-1 font-weight-medium"
            >Historic data</v-expansion-panel-header
          >
          <v-expansion-panel-content eager>
            <v-alert :icon="mdiLightbulbOnOutline" type="info" text>
              <div class="subtitle-2">Use case</div>

              Results are grouped by month, allowing you to see changes over
              time.
            </v-alert>

            <h4 class="mt-8 mb-2">Request</h4>

            <p>
              In this example we use <code>squash=false</code> to get results
              grouped by month. This is useful to see changes to the technology
              stack over time. We use <code>max_age=12</code> to get up to a
              year's worth of data (subject to availability).
            </p>

            <pre
              class="mt-6"
            ><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://example.com&amp;callback_url=https://yourdomain.com&amp;squash=false&amp;max_age=12"</Code></pre>

            <h4 class="mt-8 mb-2">Response</h4>

            <pre><Code>[
  {
    "url": "https://example.com",
    "results": [
      {
        "monthYear": "01-2020", // The month in which the technologies were indentified
        "technologies": [
          {
            "slug": "craft-cms",
            "name": "Craft CMS",
            "cpe": "cpe:2.3:a:craftcms:craft_cms:*:*:*:*:*:*:*:*",
            "categories": [
              {
                "id": 1,
                "slug": "cms",
                "name": "CMS"
            ],
            "versions": [
              "3.0.0"
            ],
            "trafficRank": 1000
            "confirmedAt": 1612824037,
          }
        ]
      },
      {
        "monthYear": "02-2020",
        "technologies": [
          ...
        ]
      }
    ]
  }
]</Code></pre>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
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
      title: 'Technology lookup',
      mdiLightbulbOnOutline,
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
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
