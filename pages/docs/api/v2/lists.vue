<template>
  <div>
    <Page :title="title" :side="side" :crumbs="crumbs" no-hero no-head>
      <h1 class="mb-4">{{ title }}</h1>

      <p>
        Find prospects by the technologies they use. Lead lists contain
        websites, company and contact details, social media profiles and more.
        Create and export custom reports for any web technology or keyword based
        on industry, website traffic and location.
      </p>

      <Heading id="list" size="2" class="mt-8 mb-2">List all lists</Heading>

      <p>Returns an array of your lead lists.</p>

      <Heading id="list-endpoint" size="3" class="mt-8 mb-2">Endpoint</Heading>

      <p>
        <code>GET</code>
        <code>https://api.wappalyzer.com/v2/lists/</code>
      </p>

      <Heading id="list-properties" size="3" class="mt-8 mb-2"
        >Properties</Heading
      >

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
              <td>20 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>Free</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="list-response" size="3" class="mt-8 mb-4"
        >Response body</Heading
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
                <code>id</code>
              </td>
              <td class="pt-4"><p>The list's unique identifier.</p></td>
            </tr>
            <tr>
              <td>
                <code>createdAt</code>
              </td>
              <td class="pt-4">
                <p>List creation date as a UNIX timestamp.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>status</code>
              </td>
              <td class="pt-4">
                <p>
                  List status. One of <code>Calculating</code>,
                  <code>Ready</code>, <code>Failed</code>,
                  <code>Insufficient</code> or <code>Complete</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>totalCredits</code>
              </td>
              <td class="pt-4"><p>The price of the list in credits.</p></td>
            </tr>
            <tr>
              <td>
                <code>technologies</code>
              </td>
              <td class="pt-4"><p>Array of technologies.</p></td>
            </tr>
            <tr>
              <td>
                <code>keywords</code>
              </td>
              <td class="pt-4"><p>Array of keywords.</p></td>
            </tr>
            <tr>
              <td>
                <code>rows</code>
              </td>
              <td class="pt-4">
                <p>The total number of results in the list per technology.</p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="list-example" size="3" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/"</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>
      <pre><Code>[
  {
    "id": "lst_abcdef",
    "createdAt": 1620687647,
    "status": "Ready",
    "totalCredits": 1000,
    "technologies": [
      {
        "slug": "shopify",
        "name": "Shopify",
        "categories": [
          {
            "slug": "ecommerce",
            "name": "Ecommerce"
          }
        ],
        "operator": "=",
        "version": null
      },
    ],
    "keywords": [],
    "rows": 1000
  }
]</Code></pre>

      <v-divider class="mt-12 mb-8" />

      <Heading id="fetch" size="2" class="mt-8 mb-2">Fetch a list</Heading>

      <p>Returns the full details of a list by its ID.</p>

      <Heading id="fetch-endpoint" size="3" class="mt-8 mb-2">Endpoint</Heading>

      <p>
        <code>GET</code>
        <code>https://api.wappalyzer.com/v2/lists/{id}</code>
      </p>

      <Heading id="fetch-properties" size="3" class="mt-8 mb-2"
        >Properties</Heading
      >

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
              <td>20 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>Free</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="fetch-parameters" size="3" class="mt-8 mb-2"
        >Path parameters</Heading
      >

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Parameter</th>
              <th>Description</th>
            </tr>
            <tr>
              <td width="30%"><code>id</code></td>
              <td>
                The list's unique identifier, e.g. <code>lst_abcdef</code>.
              </td>
            </tr>
          </thead>
        </v-simple-table>
      </v-card>

      <Heading id="fetch-response" size="3" class="mt-8 mb-2"
        >Response body</Heading
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
                <code>id</code>
              </td>
              <td class="pt-4">
                <p>
                  The list's unique identifier, e.g. <code>lst_abcdef</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>createdAt</code>
              </td>
              <td class="pt-4">
                <p>List creation date as a UNIX timestamp.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>status</code>
              </td>
              <td class="pt-4">
                <p>
                  List status. One of <code>Calculating</code>,
                  <code>Ready</code>, <code>Failed</code>,
                  <code>Insufficient</code> or <code>Complete</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>technologies</code>
              </td>
              <td class="pt-4">
                <p>Array of technologies.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>keywords</code>
              </td>
              <td class="pt-4">
                <p>Array of keywords.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>languages</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of language codes (ISO 639-1), e.g. <code>en-us</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>countries</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of two-letter country codes (ISO 3166-2), e.g.
                  <code>US</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>industries</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of industries, e.g. <code>Fashion &amp; Apparel</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>companySizes</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of company sizes, e.g.
                  <code>1,001-5,000 employees</code>
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>tlds</code>
              </td>
              <td class="pt-4">
                <p>Array of top-level domains, e.g. <code>.com</code>.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>matchCountryLanguage</code>
              </td>
              <td class="pt-4">
                <p>
                  Filtering by both country and language (<code>true</code>) or
                  either (<code>false</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>matchTechnologies</code>
              </td>
              <td class="pt-4">
                <p>
                  Operator for the technology filter, one of <code>or</code>,
                  <code>and</code> or <code>not</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>rootPath</code>
              </td>
              <td class="pt-4">
                <p>
                  Only include websites that have the selected technology on the
                  root path (typically the homepage).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>subset</code>
              </td>
              <td class="pt-4">
                <p>
                  Limits the number of results in the list per technology. Use
                  <code>subsetSlice</code> to target higher or lesser trafficked
                  websites.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>subsetSlice</code>
              </td>
              <td class="pt-4">
                <p>
                  Websites in the list are sorted in order of traffic. When a
                  <code>subset</code> is specified,
                  <code>subsetSlice</code> determines which section of the list
                  the results should be taken from (i.e. top or bottom). Set to
                  <code>0</code>-<code>4</code> for highest, high, medium, low
                  and lowest traffic, respectively. Default is
                  <code>0</code> for highest traffic.
                </p>

                <p>
                  This option has no effect when <code>subset</code> is equal to
                  or larger than the total number of available results.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>minAge</code>
              </td>
              <td class="pt-4">
                <p>
                  Include results that were verified at least
                  <code>minAge</code> months ago
                  (<code>0</code>-<code>11</code>, default is <code>0</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>maxAge</code>
              </td>
              <td class="pt-4">
                <p>
                  Include results that were verified at most
                  <code>maxAge</code> months ago
                  (<code>1</code>-<code>12</code>, default <code>3</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>fromDate</code>
              </td>
              <td class="pt-4">
                <p>
                  Only include websites that were discovered after a date (UNIX
                  timestamp).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>requiredSets</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of required field sets, see
                  <nuxt-link to="/docs/fields">Fields</nuxt-link>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>excludeNoTraffic</code>
              </td>
              <td class="pt-4">
                <p>Exclude websites that don't include traffic data.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>excludeMultilingual</code>
              </td>
              <td class="pt-4">
                <p>Exclude websites with content in more than one language.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>sets</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of
                  <nuxt-link to="/docs/fields">field sets</nuxt-link> to include
                  in the results.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>callbackUrl</code>
              </td>
              <td class="pt-4">
                <p>Callback URL that's notified when the list is ready.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>totalCredits</code>
              </td>
              <td class="pt-4">
                <p>The price of the list in credits.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>url</code>
              </td>
              <td class="pt-4">
                <p>URL of a ZIP file with the list.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>sampleUrl</code>
              </td>
              <td class="pt-4">
                <p>URL of a ZIP file with a sample taken from the list.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>rows</code>
              </td>
              <td class="pt-4">
                <p>Number of results in the list per technology.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>setRows</code>
              </td>
              <td class="pt-4">
                <p>
                  Number of values included in the list per
                  <nuxt-link to="/docs/fields">field set</nuxt-link>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>baseListId</code>
              </td>
              <td class="pt-4">
                <p>
                  ID of the list that was used as a base for this list, if any.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>baseList</code>
              </td>
              <td class="pt-4">
                <p>
                  Details of the list that was used as a base for this list, if
                  any.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="fetch-example" size="3" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/lst_abcdef"</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>

      <pre><Code>{
  "id": "lst_abcdef",
  "createdAt": 1620687647,
  "status": "Ready",
  "technologies": [
    {
      "slug": "shopify",
      "name": "Shopify",
      "categories": [
        {
          "slug": "ecommerce",
          "name": "Ecommerce"
        }
      ],
      "operator": "=",
      "version": null
    },
  ],
  "keywords": [ "FASHION" ],
  "languages": [ "en-us" ],
  "countries": [ "US" ],
  "industries": [ "Fashion &amp; Apparel" ],
  "companySizes": [ "1,001-5,000 employees" ],
  "tlds": [ ".com" ],
  "matchCountryLanguage": false,
  "matchTechnologies": "or",
  "rootPath": false,
  "subset": 1000,
  "subsetSlice": 0,
  "minAge": 0,
  "maxAge": 3,
  "fromDate": null,
  "requiredSets": [ "email" ],
  "excludeNoTraffic": false,
  "excludeMultilingual": false,
  "sets": [
    "email",
  ],
  "callbackUrl": "https://yourdomain/wappalyzer",
  "format": "csv",
  "totalCredits": 1000,
  "url": null,
  "sampleUrl": "https://lists.wappalyzer.com/wappalyzer-29ddddaa-4949-4217-86a7-f6a407e5853d-lst_abcdef-5ukjhs-sample.zip",
  "rows": {
    "shopify": 1000
  },
  "setRows": {
    "email": 1000,
  },
  "baseListId": "lst_abcdef"
}</Code></pre>

      <v-divider class="mt-12 mb-8" />

      <Heading id="create" size="2" class="mt-8 mb-2">Create a list</Heading>

      <Heading id="create-endpoint" size="3" class="mt-8 mb-2"
        >Endpoint</Heading
      >

      <p>
        <code>POST</code>
        <code>https://api.wappalyzer.com/v2/lists</code>
      </p>

      <Heading id="create-properties" size="3" class="mt-8 mb-2"
        >Properties</Heading
      >

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
              <td>Asynchronous</td>
            </tr>
            <tr>
              <td>Request timeout</td>
              <td>20 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>
                5 requests per second<br />
                50 requests per day<br />
                10 concurrent requests (lists with
                <code>Calculating</code> status)
              </td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>Free</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="create-request" size="3" class="mt-8 mb-2"
        >Request body</Heading
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
                <code>technologies</code>
              </td>
              <td class="pt-4">
                <p>Array of technologies to filter by.</p>

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
                          <code>slug</code>&nbsp;<em class="text--disabled"
                            >(required)</em
                          >
                        </td>
                        <td class="pt-4">
                          <p>
                            Technology slug, e.g. <code>hubspot-chat</code>.
                            Refer to the full
                            <a
                              href="https://api.wappalyzer.com/v2/technologies/"
                              target="_blank"
                              >list of technologies</a
                            >
                            (JSON).
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code>version</code>
                        </td>
                        <td class="pt-4">
                          <p>
                            Optional version number to target, e.g.
                            <code>1.0.0</code>.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <code>operator</code>
                        </td>
                        <td class="pt-4">
                          <p>
                            Version number operator, one of
                            <code>=</code> (exact match),
                            <code>&gt;=</code> (great than or equal to) or
                            <code>&lt;=</code> (lower than or equal to).
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-card>
              </td>
            </tr>
            <tr>
              <td>
                <code>keywords</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of keywords to filter by, e.g.
                  <code>fashion</code>. Keywords must be alphanumeric
                  (<code>a-z0-9</code>) and work best with English nouns. Prefix
                  with <code>not </code>&nbsp;to exclude, e.g.
                  <code>not fashion</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>languages</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of language codes (<a
                    href="https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
                    rel="noopener"
                    >ISO 639-1</a
                  >) to filter, e.g. <code>en-us</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>countries</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of two-letter country codes (<a
                    href="https://en.wikipedia.org/wiki/ISO_3166-2"
                    rel="noopener"
                    >ISO 3166-2</a
                  >) to filter, e.g. <code>US</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>industries</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of industries, e.g. <code>Fashion &amp; Apparel</code>.
                </p>

                <v-expansion-panels class="mb-4">
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      >List of industries
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="no-x-padding">
                      <v-simple-table dense>
                        <tbody>
                          <tr v-for="industry in industries" :key="industry">
                            <td>
                              <small>{{ industry }}</small>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </td>
            </tr>
            <tr>
              <td>
                <code>companySizes</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of company sizes to filter, e.g.
                  <code>5000</code> for 1,001-5,000 employees.
                </p>

                <v-expansion-panels class="mb-4">
                  <v-expansion-panel>
                    <v-expansion-panel-header
                      >List of company sizes
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="no-x-padding">
                      <v-simple-table dense>
                        <thead>
                          <tr>
                            <th width="50%">
                              <small>Value</small>
                            </th>
                            <th width="50%">
                              <small>Description</small>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="{ value, text } in companySizes"
                            :key="value"
                          >
                            <td>
                              <code>{{ value }}</code>
                            </td>
                            <td>
                              <small>{{ text }} employees</small>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </td>
            </tr>
            <tr>
              <td>
                <code>tlds</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of top-level domains to filter, e.g. <code>.com</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>matchCountryLanguage</code>
              </td>
              <td class="pt-4">
                <p>
                  Filter by both country and language (<code>true</code>) or
                  either (<code>false</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>matchTechnologies</code>
              </td>
              <td class="pt-4">
                <p>
                  Operator for the technology filter, one of
                  <code>or</code> (match any), <code>and</code> (match all) or
                  <code>not</code> (match the first technology, exclude all
                  others).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>rootPath</code>
              </td>
              <td class="pt-4">
                <p>
                  Only include websites that have the selected technology on the
                  root path (typically the homepage).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>subset</code>
              </td>
              <td class="pt-4">
                <p>
                  Limit the number of results in the list per technology. Use
                  <code>subsetSlice</code> to target high or low traffic
                  websites.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>subsetSlice</code>
              </td>
              <td class="pt-4">
                <p>
                  Websites in the list are sorted in order of traffic. When a
                  <code>subset</code> is specified,
                  <code>subsetSlice</code> determines which section of the list
                  the results should be taken from (i.e. top or bottom). Set to
                  <code>0</code>-<code>4</code> for highest, high, medium, low
                  and lowest traffic, respectively. Default is
                  <code>0</code> for highest traffic.
                </p>

                <p>
                  This option has no effect when <code>subset</code> is equal to
                  or larger than the total number of available results.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>minAge</code>
              </td>
              <td class="pt-4">
                <p>
                  Include results that were verified at least
                  <code>minAge</code> months ago
                  (<code>0</code>-<code>11</code>, default is <code>0</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>maxAge</code>
              </td>
              <td class="pt-4">
                <p>
                  Include results that were verified at most
                  <code>maxAge</code> months ago
                  (<code>1</code>-<code>12</code>, default is <code>3</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>fromDate</code>
              </td>
              <td class="pt-4">
                <p>
                  Only include websites that were discovered after a date (UNIX
                  timestamp, e.g. <code>1620687647</code>).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>requiredSets</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of required field sets, e.g. <code>email</code>. See
                  <nuxt-link to="/docs/fields">Fields</nuxt-link>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>excludeNoTraffic</code>
              </td>
              <td class="pt-4">
                <p>
                  Exclude websites that don't include traffic data (<code
                    >true</code
                  >
                  or <code>false</code> (default)).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>excludeMultilingual</code>
              </td>
              <td class="pt-4">
                <p>
                  Exclude websites with content in more than one language (<code
                    >true</code
                  >
                  or <code>false</code> (default)).
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>baseListId</code>
              </td>
              <td class="pt-4">
                <p>
                  ID of a list to use as a base, e.g. <code>lst_abcdef</code>.
                  The results will be filtered to only include websites that are
                  also in the base list.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>sets</code>
              </td>
              <td class="pt-4">
                <p>
                  Array of
                  <nuxt-link to="/docs/fields">field sets</nuxt-link> to include
                  in the results, e.g. <code>email</code>. See
                  <nuxt-link to="/docs/fields">Fields</nuxt-link>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>callbackUrl</code>
              </td>
              <td class="pt-4">
                <p>
                  Callback URL that's notified when the list is ready, e.g.
                  <code>https://yourdomain.com/wappalyzer</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>format</code>
              </td>
              <td class="pt-4">
                <p>
                  Output file format, one of <code>csv</code> (default) or
                  <code>json</code>.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="create-response" size="3" class="mt-8 mb-4"
        >Response body</Heading
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
                <code>id</code>
              </td>
              <td class="pt-4"><p>The list's unique identifier.</p></td>
            </tr>
            <tr>
              <td>
                <code>status</code>
              </td>
              <td class="pt-4">
                <p>
                  List status. One of <code>Calculating</code>,
                  <code>Ready</code>, <code>Failed</code>,
                  <code>Insufficient</code> or <code>Complete</code>.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <code>totalCredits</code>
              </td>
              <td class="pt-4"><p>The price of the list in credits.</p></td>
            </tr>
            <tr>
              <td>
                <code>sampleUrl</code>
              </td>
              <td class="pt-4">
                <p>URL of a ZIP file with a sample taken from the list.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>rows</code>
              </td>
              <td class="pt-4">
                <p>Number of results in the list per technology.</p>
              </td>
            </tr>
            <tr>
              <td>
                <code>setRows</code>
              </td>
              <td class="pt-4">
                <p>
                  Number of values included in the list per
                  <nuxt-link to="/docs/fields">field set</nuxt-link>.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="create-callback" size="3" class="mt-8 mb-4"
        >Callback response</Heading
      >

      <p>
        A callback URL is a public endpoint hosted on your own server. Creating
        a list can take anywhere from a few seconds to a couple of hours
        depending on the technology and complexity of the query. Instead of
        periodically checking if a list is ready, use a callback URL to be
        notified immediately.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        To verify that the request was made by Wappalyzer, enable
        <nuxt-link :to="{ path: '/docs/api/v2/basics', hash: 'signatures' }">
          callback signatures </nuxt-link
        >.
      </v-alert>

      <Heading id="create-example" size="3" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code wrap>curl -X POST -H "Content-Type: application/json" -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/" -d '{ "technologies": [ { "slug": "shopify" } ] }'</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>

      <pre><Code>{
  "id": "lst_abcdef",
  "status": "Calculating"
}</Code></pre>

      <h4 class="mt-8 mb-2">Callback response</h4>

      <p>
        Your callback URL will receive a POST request when the list is ready.
      </p>

      <pre><Code>{
  "id": "lst_abcdef",
  "status": "Ready",
  "rows": 1000,
  "setRows": [
    "email": 1000
  ],
  "totalCredits": 1000,
  "sampleUrl": "https://lists.wappalyzer.com/wappalyzer-29ddddaa-4949-4217-86a7-f6a407e5853d-lst_abcdef-5ukjhs-sample.zip"
}</Code></pre>

      <v-divider class="mt-12 mb-8" />

      <Heading id="finalise" size="2" class="mt-8 mb-2"
        >Finalise a list</Heading
      >

      <p>
        When a list is ready, it must be finalised before you can download the
        results. Finalising involves making a payment using your credit balance,
        after which the list status changes to <code>Complete</code>.
      </p>

      <v-alert :icon="mdiLightbulbOnOutline" type="info" class="my-8" text>
        To ensure you always have enough credits to purchase a list, enable
        <nuxt-link to="/credits/">auto top-up</nuxt-link>.
      </v-alert>

      <Heading id="finalise-endpoint" size="3" class="mt-8 mb-2"
        >Endpoint</Heading
      >

      <p>
        <code>POST</code>
        <code>https://api.wappalyzer.com/v2/lists/{id}</code>
      </p>

      <Heading id="finalise-properties" size="3" class="mt-8 mb-2"
        >Properties</Heading
      >

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
              <td>20 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>1 Credit per website</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="finalise-parameters" size="3" class="mt-8 mb-2"
        >Path parameters</Heading
      >

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Parameter</th>
              <th>Description</th>
            </tr>
            <tr>
              <td width="30%"><code>id</code></td>
              <td>
                The list's unique identifier, e.g. <code>lst_abcdef</code>.
              </td>
            </tr>
          </thead>
        </v-simple-table>
      </v-card>

      <Heading id="finalise-request" size="3" class="mt-8 mb-2"
        >Request body</Heading
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
                <code>spendCredits</code>
              </td>
              <td class="pt-4">
                <p>
                  The number of credits to spend. This value must exactly match
                  the list's
                  <code>totalCredits</code>, obtained from either the
                  <a href="#create-callback">callback response</a> or
                  <a href="#fetch">fetch endpoint</a>.
                </p>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="finalise-example" size="3" class="mt-8 mb-4"
        >Example</Heading
      >

      <h4 class="mb-2">Request</h4>

      <pre><Code wrap>curl -X POST -H "Content-Type: application/json" -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/lst_abcdef" -d '{ "spendCredits": 1000 }'</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>

      <pre><Code>{
  "id": "lst_abcdef",
  "status": "Complete",
  "url": "https://lists.wappalyzer.com/wappalyzer-29ddddaa-4949-4217-86a7-f6a407e5853d-lst_abcdef-5ukjhs.zip",
}</Code></pre>

      <v-divider class="mt-12 mb-8" />

      <Heading id="delete" size="2" class="mt-8 mb-2">Delete a list</Heading>

      <p>Permanently delete a list.</p>

      <Heading id="delete-endpoint" size="3" class="mt-8 mb-2"
        >Endpoint</Heading
      >

      <p>
        <code>DELETE</code>
        <code>https://api.wappalyzer.com/v2/lists/{id}</code>
      </p>

      <Heading id="delete-properties" size="3" class="mt-8 mb-2"
        >Properties</Heading
      >

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
              <td>20 seconds</td>
            </tr>
            <tr>
              <td>Rate limit</td>
              <td>5 requests per second</td>
            </tr>
            <tr>
              <td>Pricing</td>
              <td>Free</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card>

      <Heading id="delete-parameters" size="3" class="mt-8 mb-2"
        >Path parameters</Heading
      >

      <v-card class="my-4" flat outlined>
        <v-simple-table>
          <thead>
            <tr>
              <th width="30%">Parameter</th>
              <th>Description</th>
            </tr>
            <tr>
              <td width="30%"><code>id</code></td>
              <td>
                The list's unique identifier, e.g. <code>lst_abcdef</code>.
              </td>
            </tr>
          </thead>
        </v-simple-table>
      </v-card>

      <Heading id="delete-example" size="3" class="mt-8 mb-4">Example</Heading>

      <h4 class="mb-2">Request</h4>

      <pre><Code wrap>curl -X DELETE -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/lst_abcdef"</Code></pre>

      <h4 class="mt-8 mb-2">Response</h4>

      <pre><Code>{}</Code></pre>
    </Page>
  </div>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import Heading from '~/components/Heading.vue'
import Code from '~/components/Code.vue'
import side from '~/assets/json/nav/docs.json'
import industries from '~/assets/json/companyIndustries.json'
import companySizes from '~/assets/json/companySizes.json'

export default {
  components: {
    Page,
    Heading,
    Code,
  },
  data() {
    return {
      title: 'Lead lists',
      mdiLightbulbOnOutline,
      side,
      crumbs: [
        { title: 'Developer documentation', to: '/docs/' },
        { title: 'APIs', to: '/docs/api/' },
      ],
      industries: industries.map(({ value }) => value),
      companySizes,
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
