<template>
  <div>
    <Page :title="title" narrow>
      <template v-for="(article, index) in articles">
        <nuxt-link :to="article.to" class="text-decoration-none text--primary">
          <div :key="index">
            <v-divider v-if="index" class="mt-12 mb-10" />

            <h2 class="text-h2 mt-8 mb-2 text-decoration-underline">
              {{ article.title }}
            </h2>

            <p>
              {{ article.intro }}
            </p>
          </div>
        </nuxt-link>
      </template>
    </Page>
  </div>
</template>

<script>
import Page from '~/components/Page.vue'

export default {
  components: {
    Page,
  },
  data() {
    return {
      title: 'Articles',
      articles: [
        {
          title:
            'Five ways to use Wappalyzer and HubSpot to amplify sales activities and find new marketing channels',
          intro:
            "Using the Wappalyzer integration with HubSpot, you can automatically enrich data for leads and access sales intelligence. If you're a sales and marketing professional, a SaaS company team member, or an agency, see how Wappalyzer and HubSpot can speed up your sales process and help remove manual research from your workflows.",
          to: '/articles/how-to-use-wappalyzer-and-hubspot/',
        },
        {
          title:
            'Email deliverability: how to prepare your inbox & build a lead list',
          intro:
            'Preparing your inbox for good email deliverability can be a daunting task. To make the process as easy as possible, we are going to break down the steps for you. Here are some of the most important factors to keep in mind when preparing your inbox for email deliverability.',
          to: '/articles/email-deliverability/',
        },
        {
          title:
            'Get the technology stack of new leads to your Slack instantly',
          intro:
            "Lead qualification can be a long process with many steps. Save time by automating research into your clients' current technical stack. So when a client wants your help in updating their website, you'll instantly know what CMS or framework they are using without having to ask the client first.",
          to: '/articles/get-the-technology-stack-of-new-leads-in-slack/',
        },
        {
          title: 'HTTP Archive uses Wappalyzer to track the state of the web',
          intro:
            'The HTTP Archive tracks how the web is built. It provides historical data to quantitatively illustrate how the web is evolving over time. The project is open-source and backed by technology giants such as Google, Mozilla and Akamai.',
          to: '/articles/http-archive-uses-wappalyzer-to-track-the-state-of-the-web/',
        },
        {
          title: 'What is technographics?',
          intro:
            'Technographics is a market research methodology used to profile target accounts based on their technology stack. For many companies, especially those offering a SaaS product, the technology a prospect uses can be a strong qualifying factor.',
          to: '/articles/what-is-technographics/',
        },
        {
          title: 'Find out what CMS or framework a website is using',
          intro:
            "Whether you're a developer, online marketer, security researcher or SEO consultant, you've likely looked at a website and wondered 'what CMS is this website using'? There are several ways to check the technology of a website, which we'll explore in detail.",
          to: '/articles/find-out-what-cms-or-framework-a-website-is-using/',
        },
        {
          title: 'How to hide technologies from Wappalyzer',
          intro:
            "Most web technologies, including server-side software such as CMSs, leave trails of evidence of their presence in websites' HTML code. This code is publicly accessible, which is necessary for browsers to render and display the page. Wappalyzer is known to be very proficient exposing these technologies through various fingerprinting methods.",
          to: '/articles/how-to-hide-technologies-from-wappalyzer/',
        },
        {
          title: 'Wappalyzer vs. BuiltWith',
          intro:
            "Wappalyzer and BuiltWith are technology profilers that provide tools for lead generation, market research and business intelligence. Looking for a comparison between Wappalyzer and BuiltWith? Here's a full review.",
          to: '/articles/builtwith-alternative/',
        },
      ],
    }
  },
}
</script>
