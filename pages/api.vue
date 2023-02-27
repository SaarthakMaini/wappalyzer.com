<template>
  <div>
    <Page :title="title" :head="meta" no-heading>
      <div class="mt-8 mb-10">
        <v-btn class="mb-2 mr-2" depressed @click="$refs.faqDialog.open()">
          <v-icon left>
            {{ mdiForum }}
          </v-icon>
          FAQs
        </v-btn>
        <v-btn to="/docs/api/" class="mb-2" depressed>
          <v-icon left>
            {{ mdiBookOpenPageVariant }}
          </v-icon>
          API reference
        </v-btn>
      </div>

      <template #content>
        <v-card>
          <v-tabs v-model="tabs">
            <v-tab><small>Technology lookup</small></v-tab>
            <v-tab><small>Lead lists</small></v-tab>
            <v-tab><small>Subdomain finder</small></v-tab>
            <v-tab><small>Email verification</small></v-tab>
          </v-tabs>

          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-card-text style="max-width: 600px">
                <p>
                  Find out the technology stack of any website, such as the CMS
                  or ecommerce platform. Perform near-instant queries against
                  our comprehensive database of millions of websites or analyse
                  websites live for real-time results.
                </p>

                <p>
                  In addition to technologies, responses optionally include
                  company details, verified email addresses, phone numbers,
                  social media profiles, locale information, keywords, metadata
                  and more.
                </p>

                <v-btn to="/docs/api/v2/lookup/" color="primary" depressed>
                  Get started
                  <v-icon right>
                    {{ mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example request</v-card-title>
              <v-card-text>
                <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lookup/?urls=https://www.wappalyzer.com&amp;sets=all"</Code></pre>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example response</v-card-title>

              <v-card-text>
                <pre><Code>{
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
  "linkedin": [ "company/wappalyzer", "in/elbertalias" ],
  "twitter": [ "Wappalyzer" ],
  "facebook": [ "wappalyzer" ],
  "title": "Find out what websites are built with",
  "description": "Find out the technology stack of any website.",
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
  ],
  "keywords": [ "WAPPALYZER", "TECHNOLOGY", "WEBSITES", ... ],
  "technologySpend": "Medium",
  "schemaOrgTypes": [ "WebPage", "Organization" ],
  "certInfo.issuer": "Amazon",
  "certInfo.validTo": 1633737600,
  "certInfo.protocol": "TLS 1.3"
  "dns.spf": true,
  "dns.dmarc": true,
  "ipCountry": "US",
  "ipRegion": "WA",
  "language": "en",
  "responsive": true
}</Code></pre>
              </v-card-text>
            </v-tab-item>

            <v-tab-item>
              <v-card-text style="max-width: 600px">
                <p class="body-2">
                  Find prospects by the technologies they use. Lead lists
                  contain websites, company and contact details, social media
                  profiles and more. Create and export custom reports for any
                  web technology or keyword based on industry, website traffic
                  and location.
                </p>

                <v-btn to="/docs/api/v2/lists" color="primary" depressed>
                  Get started
                  <v-icon right>
                    {{ mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example request</v-card-title>
              <v-card-text>
                <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/lists/lst_abcdef"</Code></pre>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example response</v-card-title>

              <v-card-text>
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
  "totalCredits": 1000,
  "url": null,
  "sampleUrl": "https://lists.wappalyzer.com/wappalyzer-29ddddaa-4949-4217-86a7-f6a407e5853d-lst_abcdef-5ukjhs-sample.zip",
  "rows": {
    "shopify": 1000
  },
  "setRows": {
    "email": 1000,
  }
}
</Code></pre>
              </v-card-text>
            </v-tab-item>

            <v-tab-item>
              <v-card-text style="max-width: 600px">
                <p class="body-2">Enumerate subdomains for a domain.</p>

                <v-btn to="/docs/api/v2/subdomains" color="primary" depressed>
                  Get started
                  <v-icon right>
                    {{ mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example request</v-card-title>
              <v-card-text>
                <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/subdomains/?domains=example.com"</Code></pre>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example response</v-card-title>

              <v-card-text>
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
              </v-card-text>
            </v-tab-item>
            <v-tab-item>
              <v-card-text style="max-width: 600px">
                <p class="body-2">
                  Verify email addresses before sending to improve delivery. A
                  high bounce rate lowers your sender reputation and you risk
                  getting blocked by email providers.
                </p>

                <v-btn to="/docs/api/v2/verify" color="primary" depressed>
                  Get started
                  <v-icon right>
                    {{ mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example request</v-card-title>
              <v-card-text>
                <pre><Code wrap>curl -H "x-api-key: &lt;your api key&gt;" "https://api.wappalyzer.com/v2/verify/?email=hello@wappalyzer.com"</Code></pre>
              </v-card-text>

              <v-divider />

              <v-card-title class="subtitle-2">Example response</v-card-title>

              <v-card-text>
                <pre><Code>{
  "email": "hello@wappalyzer.com",
  "domain": "wappalyzer.com",
  "reachable": "risky",
  "disposable": false,
  "roleAccount": true,
  "mxValid": true,
  "connection": true,
  "inboxFull": false,
  "catchAll": false,
  "deliverable": true,
  "disabled": false,
  "syntaxValid": true
}
</Code></pre>
              </v-card-text>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </template>

      <FaqDialog ref="faqDialog" topic="api" />

      <template #footer>
        <Logos apps />
      </template>
    </Page>
  </div>
</template>

<script>
import {
  mdiForum,
  mdiBookOpenPageVariant,
  mdiArrowRight,
  mdiCheck,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'
import Matrix from '~/components/Matrix.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import Code from '~/components/Code.vue'
import { apis as meta } from '~/assets/json/meta.json'

export default {
  components: {
    Page,
    Logos,
    Matrix,
    FaqDialog,
    Code,
  },
  data() {
    return {
      title: meta.title,
      faqDialog: false,
      tabs: 0,
      meta,
      mdiForum,
      mdiBookOpenPageVariant,
      mdiArrowRight,
      mdiCheck,
    }
  },
}
</script>
