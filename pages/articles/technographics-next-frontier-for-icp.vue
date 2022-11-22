<template>
  <Page :crumbs="crumbs" :title="title" :head="{ meta }" no-head narrow>
    <article>
      <h1 class="text-h1 mb-8">
        {{ title }}
      </h1>

      <h2 class="text-h2 mt-8 mb-2">What are technographics and your ICP</h2>

      <p>
        If you're part of a mature go-to-market organization, you likely have a
        good handle on your ideal customer profile (ICP), as it's traditionally
        defined. You appreciate how much a well-defined ICP affects sales
        efficiency. However, there's a blind spot in the ICP development process
        that many orgs have yet to build out. Most go-to-market (GTM) teams have
        some intuition as to what technology stacks are predictive of
        successfully closed deals or leads that are unlikely to close, but they
        don't have data to support these intuitions and have no way of acquiring
        or analyzing this data at any real scale.
      </p>

      <v-card class="mt-8" :max-width="1600">
        <v-img
          src="/images/articles/technographics-next-frontier-for-icp/sales-icp-example.png"
          alt="Sales ICP example"
        />
      </v-card>

      <p class="mb-6">
        <small>
          <em>Credit: Gong</em>
        </small>
      </p>

      <p>
        If a GTM organization knew exactly which technologies were in the "sweet
        spot" in terms of making a closed deal likely and which would make a
        deal impossible, would it improve their efficiency through better
        prioritization of leads? Would augmenting their ICP with this data
        improve the efficiency of marketing? We think so.
      </p>

      <p>
        In order to close a greater number of deals more efficiently, sales and
        marketing teams ought to refine their ICP in this way. This is where
        Wappalyzer's technographics can help.
      </p>

      <h2 class="text-h2 mt-8 mb-2">
        Refined ICP &rarr; more accurate lead scoring &rarr; more sales in less
        time
      </h2>

      <p>
        By integrating Wappalyzer with a CRM or marketing automation platform
        (MAP), teams will be able enrich all account data (customers, prospects,
        lost deals) with technographics. From there, teams can create reports
        directly in their CRMs or MAPs to identify patterns in the tech stacks
        of both their customers and their lost deals. They would also be able
        see how these answers might differ across other ICP variables like
        scale, industry, etc.
      </p>

      <v-card class="my-8" :max-width="1600">
        <v-img
          src="/images/articles/technographics-next-frontier-for-icp/wappalyzer-hubpot.jpg"
          alt="Wappalyzer on HubSpot"
        />
      </v-card>

      <p>
        Almost every software company will find meaningful signal in these
        reports. What can be done with this information?
      </p>

      <ol class="mb-4">
        <li>Enhanced view of ICP will refine lead scoring algorithms.</li>
        <li>
          Salespeople will have leads that are easier to prioritize with a
          higher probability of success.
        </li>
        <li>
          Teams can avoid the dreaded time-wasting interactions that drag on for
          months only to end up with an implementation engineer saying "this is
          not going to work".
        </li>
        <li>Marketing content can be more targeted and relevant.</li>
        <li>
          Salespeople will have the ability to deliver personalized,
          differentiated messages, e.g. "We see that you're using technology
          ABC; we have a great integration with lots of customers that also use
          it and here are two relevant case studies".
        </li>
      </ol>

      <p>
        Leveraging tech stack data to inform outreach will save time and money.
        For example, teams can use this information to tailor marketing
        campaigns specifically to the technology their prospects are using,
        improving interaction rates with outbound messages and ads.
      </p>

      <p>Using this approach will allow teams to:</p>

      <ul class="mb-4">
        <li>
          Personalize their emails more effectively &mdash; send out emails that
          go beyond "hey, here's what we do" by referencing specific
          technologies used by their leads and customers.
        </li>
        <li>
          Save time on manual research &mdash; no need for tedious one-by-one
          research into prospect companies' systems or software platforms.
        </li>
      </ul>

      <h2 class="text-h2 mt-8 mb-2">
        Tech stack data can help you build better prospecting lists
      </h2>

      <p>
        After establishing technographics as part of ICP development, and
        successfully using that data to improve the efficiency of an existing
        sales pipeline, technographics can also be used to improve lead
        generation and expand the top of the funnel.
      </p>

      <p>
        For example, SDRs can create lists of companies that use the
        technologies of their company’s top integration partners. They can
        create lists of prospects that are already using a top competitor and
        avoid reaching out to them (if they are in a low-churn,
        high-switching-cost market). Account executives at Mixpanel, for
        example, may choose to avoid reaching out to companies that they already
        know are using Amplitude, and vice versa.
      </p>

      <h2 class="text-h2 mt-8 mb-2">Conclusion</h2>

      <p>
        If you're reading this, chances are that you already know how important
        tech stack data can be for your GTM organization. However, the fact
        remains that most businesses have not yet found a way to generate these
        insights at scale. We hope we've given you a better understanding of why
        tech stack data is so valuable and how it can help improve your GTM
        organization's velocity and efficiency. If nothing else, we hope this
        post has given some food for thought! Please feel free to
        <nuxt-link to="/contact/">reach out</nuxt-link> with any questions.
      </p>
    </article>

    <template #footer>
      <Logos apps use-cases />
    </template>
  </Page>
</template>

<script>
import { mdiLightbulbOnOutline } from '@mdi/js'

import Page from '~/components/Page.vue'
import Logos from '~/components/Logos.vue'

export default {
  components: {
    Page,
    Logos,
  },
  data() {
    return {
      title:
        'Technographics, the next frontier for the ideal customer profile (ICP)',
      crumbs: [{ title: 'Articles', to: '/articles/' }],
      meta: "In order to close a greater number of deals more efficiently, sales and marketing teams ought to refine their ICP in this way. This is where Wappalyzer's technographics can help.",
      mdiLightbulbOnOutline,
    }
  },
}
</script>
