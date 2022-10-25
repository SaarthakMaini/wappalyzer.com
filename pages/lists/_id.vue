<template>
  <Page
    :title="title"
    :head="{ title, subtitle: list && list.name }"
    :crumbs="[{ title: 'Lead lists', to: '/lists/all/' }]"
    :loading="!list && !error"
    secure
    no-side-bar
  >
    <div v-if="list && list.name" class="mb-2"></div>

    <v-alert v-if="error" type="error" class="mb-8" text>
      {{ error }}
    </v-alert>

    <template v-if="list">
      <v-row>
        <v-col cols="12" md="8" class="py-0">
          <v-alert
            v-if="list.status === 'Calculating'"
            :icon="mdiTimerSandEmpty"
            color="accent"
            border="left"
            text
            prominent
          >
            Your list is being created. You can wait here or close this page,
            we'll send you an email when it's ready.
          </v-alert>

          <v-alert
            v-if="list.status === 'Failed'"
            :icon="mdiAlertOctagonOutline"
            type="error"
            border="left"
            text
            prominent
          >
            Sorry, something went wrong during the processing of your list.
            Please contact us.
          </v-alert>

          <v-alert
            v-if="list.status === 'Insufficient'"
            :icon="mdiEmoticonSadOutline"
            color="warning"
            border="left"
            text
            prominent
          >
            <p>
              Sorry, we don't have results available matching your requirements.
              Please try it again with different or no filters.
            </p>

            <v-btn :to="`/lists/${queryParams}`" color="warning" exact outlined>
              <v-icon left>
                {{ mdiArrowLeft }}
              </v-icon>
              Create a new list
            </v-btn>
          </v-alert>

          <v-alert
            v-if="list.status === 'Ready'"
            type="success"
            color="accent"
            border="left"
            text
            prominent
          >
            Your list is ready. Please find a sample below.
          </v-alert>

          <v-alert
            v-if="list.status === 'Complete' && list.repeatListId"
            :icon="mdiUpdate"
            type="success"
            color="accent"
            border="left"
            text
            prominent
          >
            This is an automatically created weekly update for the list
            <nuxt-link :to="`/lists/${list.repeatListId}`">{{
              list.repeatListId
            }}</nuxt-link
            >.
          </v-alert>

          <v-alert
            v-else-if="list.status === 'Complete'"
            type="success"
            border="left"
            text
            prominent
          >
            Your list is ready.
          </v-alert>

          <div
            v-if="list.status === 'Calculating'"
            class="text-center mb-n6"
            style="padding: 100px 0"
          >
            <div v-if="playGame">
              <TicTacToe class="mt-6" />

              <div class="mt-6">
                <small
                  ><a
                    class="text--disabled text-decoration-underline"
                    @click="playGame = false"
                    >Close</a
                  ></small
                >
              </div>
            </div>
            <template v-else>
              <v-progress-circular
                color="accent"
                size="150"
                width="5"
                :value="list.calculatingProgress % 100"
                :indeterminate="
                  !(list.calculatingProgress % 100) ||
                  list.calculatingProgress === 200
                "
              >
                <small>
                  <span class="text--disabled">
                    Step {{ Math.ceil(list.calculatingProgress / 100) + 1 }} of
                    3
                  </span>
                  <br />
                  <span class="font-weight-bold">
                    {{
                      list.calculatingProgress === 200
                        ? 'Finalising...'
                        : list.calculatingProgress
                        ? Math.ceil(list.calculatingProgress / 100) === 1
                          ? 'Filtering data'
                          : 'Enriching data'
                        : 'Extracting data'
                    }}
                  </span>
                  <template
                    v-if="
                      list.calculatingProgress % 100 &&
                      list.calculatingProgress < 200
                    "
                  >
                    <br />
                    {{ list.calculatingProgress % 100 }}%
                  </template>
                </small>
              </v-progress-circular>

              <div class="mt-6">
                <small
                  ><a
                    class="text--disabled text-decoration-underline"
                    @click="playGame = true"
                    >Play a game?</a
                  ></small
                >
              </div>
            </template>
          </div>

          <template v-if="['Ready', 'Complete'].includes(list.status)">
            <v-expansion-panels
              v-if="
                list.query.technologies.length &&
                list.query.technologies.some(
                  ({ sample }) => sample && sample.length
                )
              "
              v-model="panelIndex"
              class="mb-6"
            >
              <v-expansion-panel
                v-for="technology in list.query.technologies.filter(
                  ({ sample }) => sample && sample.length
                )"
                :key="technology.slug"
              >
                <v-expansion-panel-header class="subtitle-1 font-weight-medium">
                  <template v-if="list.query.matchAllTechnologies === 'and'">
                    <div class="d-flex align-center">
                      <div
                        v-for="_technology in list.query.technologies"
                        :key="`${_technology.slug}_1`"
                      >
                        <TechnologyIcon :icon="_technology.icon" />
                      </div>
                      <div
                        v-for="(_technology, index) in list.query.technologies"
                        :key="`${_technology.slug}_2`"
                      >
                        <span v-if="index" class="ml-1">
                          <template
                            v-if="list.query.matchAllTechnologies === 'and'"
                            >+</template
                          >
                          <template
                            v-if="list.query.matchAllTechnologies === 'not'"
                            >-</template
                          >
                        </span>
                        {{ _technology.name }}
                      </div>
                      <v-chip class="ml-2" small label outlined>sample</v-chip>
                    </div>
                  </template>
                  <div v-else class="d-flex align-center">
                    <TechnologyIcon :icon="technology.icon" />
                    {{ technology.name }}
                    <v-spacer />
                    <v-chip class="mr-2" small label outlined>sample</v-chip>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="no-x-padding no-b-padding">
                  <ListSample :sample="technology.sample" />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-card v-else-if="list.query.keywords.length" class="mb-6">
              <v-card-title>Sample</v-card-title>
              <v-card-text class="px-0 pb-0">
                <ListSample :sample="list.query.sample" />
              </v-card-text>
            </v-card>

            <v-alert v-else color="secondary" class="mb-4 py-6 text--disabled">
              Preview not available.
            </v-alert>
          </template>

          <v-btn
            v-if="list.status === 'Ready' && list.sampleFilename"
            :href="`${datasetsBaseUrl}${list.sampleFilename}`"
            class="mb-4"
            depressed
          >
            <v-icon left>
              {{ mdiDownload }}
            </v-icon>
            Download samples
          </v-btn>
        </v-col>

        <v-col cols="12" md="4" class="py-0">
          <v-card class="mb-4">
            <v-card-title
              class="
                subtitle-1
                font-weight-medium
                px-6
                d-flex
                justify-space-between
              "
            >
              <span>Get the full list</span>
              <v-chip
                to="/pro/"
                class="font-weight-regular"
                color="primary"
                x-small
                outlined
                >PRO</v-chip
              >
            </v-card-title>
            <v-card-text class="pb-2 px-0">
              <v-simple-table class="mb-4">
                <tbody>
                  <tr>
                    <th width="40%" class="pl-6">Websites</th>
                    <td
                      v-if="['Ready', 'Complete'].includes(list.status)"
                      class="text-right pr-6"
                    >
                      {{
                        formatNumber(
                          totalRows(
                            list.rows || 0,
                            list.query.matchAllTechnologies
                          )
                        )
                      }}
                    </td>
                    <td
                      v-else-if="
                        ['Failed', 'Insufficient'].includes(list.status)
                      "
                      class="text-right"
                    >
                      -
                    </td>
                    <td
                      v-else-if="list.status === 'Calculating'"
                      class="text-right"
                    >
                      <Spinner />
                    </td>
                    <td v-else class="text-right">-</td>
                  </tr>
                  <tr
                    v-if="
                      !isPro &&
                      !['Failed', 'Insufficient'].includes(list.status)
                    "
                  >
                    <th class="pl-6">Price</th>
                    <td
                      v-if="list.status !== 'Calculating'"
                      class="text-right pr-6"
                    >
                      {{ formatNumber(list.totalCredits) }} credits
                    </td>
                    <td v-else class="text-right">
                      <Spinner />
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>

              <div
                v-if="list.status === 'Complete'"
                class="d-flex flex-column align-stretch mb-4"
              >
                <v-btn
                  color="success"
                  class="mx-6"
                  :href="`${datasetsBaseUrl}${list.filename}`"
                  x-large
                  depressed
                >
                  <v-icon left size="20">
                    {{ mdiDownload }}
                  </v-icon>
                  Download list
                </v-btn>
              </div>

              <div v-if="list.status === 'Ready'" class="mb-4">
                <div class="d-flex flex-column align-stretch">
                  <template v-if="isPro">
                    <v-alert
                      v-if="credits < list.totalCredits"
                      color="warning"
                      class="mb-6 px-6"
                      text
                    >
                      <p>
                        You have
                        <strong>{{ formatNumber(credits) }}</strong> credits.
                        Please
                        <nuxt-link class="warning--text" to="/credits/"
                          >top up your credits</nuxt-link
                        >
                        or create a smaller list.
                      </p>

                      <p>
                        <small>
                          You can set a limit under the 'list size &amp; website
                          traffic' tab when creating a list.
                        </small>
                      </p>
                    </v-alert>

                    <v-btn
                      color="primary"
                      class="mx-6"
                      x-large
                      depressed
                      :loading="paying"
                      :disabled="
                        !list.totalCredits || credits < list.totalCredits
                      "
                      @click="pay"
                    >
                      <v-icon left size="20">
                        {{ mdiAlphaCCircle }}
                      </v-icon>
                      Spend {{ formatNumber(list.totalCredits) }} credits
                    </v-btn>

                    <template v-if="freeLists.remaining">
                      <v-row class="my-4 mx-6 align-center"
                        ><v-divider />
                        <div class="px-2">Or</div>
                        <v-divider
                      /></v-row>

                      <v-btn
                        x-large
                        depressed
                        class="mx-6"
                        color="primary lighten-1 primary--text"
                        :loading="claiming"
                        @click="claim"
                      >
                        <v-icon left size="20">
                          {{ mdiGift }}
                        </v-icon>
                        Claim free list
                      </v-btn>
                    </template>
                  </template>

                  <template v-else>
                    <v-card
                      color="primary lighten-1 primary--text"
                      class="mb-n2 pb-2"
                      flat
                      tile
                    >
                      <v-card-title class="subtitle-2 px-6">
                        <v-icon color="primary" size="20" left>
                          {{ mdiLockOpenVariantOutline }}
                        </v-icon>
                        Unlock PRO features
                      </v-card-title>
                      <v-card-text class="primary--text px-6">
                        <p>
                          Sign up for a
                          <v-chip to="/pro/" color="primary" x-small outlined>
                            PRO
                          </v-chip>
                          plan to download the full list.
                        </p>

                        <v-btn
                          to="/pricing/"
                          color="primary"
                          x-large
                          depressed
                          block
                        >
                          Compare plans
                          <v-icon right size="20">
                            {{ mdiArrowRight }}
                          </v-icon>
                        </v-btn>
                      </v-card-text>
                    </v-card>
                  </template>
                </div>
              </div>
            </v-card-text>

            <template
              v-if="
                !list.repeatListId &&
                ['Ready', 'Complete'].includes(list.status)
              "
            >
              <v-divider />

              <v-card-text class="px-6">
                <v-switch
                  v-model="repeat"
                  :loading="repeating"
                  :disabled="!isPro || pauseToggleRepeat"
                  class="my-0 pt-0"
                  inset
                  hide-details
                >
                  <template #label>
                    Recreate weekly with new websites
                    <v-tooltip max-width="300" left>
                      <template #activator="{ on }">
                        <v-icon class="ml-1" small v-on="on">{{
                          mdiHelpCircleOutline
                        }}</v-icon>
                      </template>

                      Automatically recreate this list every week, with only
                      newly discovered websites.<br /><br />

                      We'll send you an email when a new list is available.
                    </v-tooltip>
                  </template>
                </v-switch>

                <template v-if="repeat && !repeating">
                  <p class="mt-4">
                    <small>
                      Optionally add a
                      <nuxt-link to="/docs/api/v2/lists/#create-callback"
                        >callback URL</nuxt-link
                      >
                      to notify your endpoint about new lists (replaces email
                      notifications).
                    </small>
                  </p>

                  <v-row class="px-3 my-1">
                    <v-text-field
                      v-model="list.callbackUrl"
                      label="Callback URL"
                      placeholder="https://yourdomain.com/wappalyzer"
                      hide-details="auto"
                      :rules="callbackUrlRules"
                      outlined
                      dense
                    />

                    <v-btn
                      color="primary lighten-1 primary--text"
                      class="ml-2"
                      style="height: 40px"
                      depressed
                      @click="saveCallbackUrl"
                      :loading="savingCallbackUrl"
                      >Save</v-btn
                    >
                  </v-row>
                </template>
              </v-card-text>
            </template>

            <v-divider />

            <v-expansion-panels v-model="sidePanelIndex" accordion flat>
              <v-expansion-panel v-if="technologies.length">
                <v-expansion-panel-header class="subtitle-1 font-weight-medium">
                  Technologies
                </v-expansion-panel-header>
                <v-expansion-panel-content class="no-x-padding no-b-padding">
                  <v-simple-table>
                    <tbody>
                      <tr>
                        <th>Technology</th>
                        <th class="text-right">Websites</th>
                      </tr>
                      <tr
                        v-for="technology in technologies"
                        :key="technology.slug"
                        outlined
                        small
                      >
                        <td>
                          <div class="d-flex align-center">
                            <TechnologyIcon :icon="technology.icon" />
                            <nuxt-link
                              :to="`/technologies${
                                technology.categories.length
                                  ? `/${technology.categories[0].slug}`
                                  : ''
                              }/${technology.slug}`"
                            >
                              {{ technology.name }}
                            </nuxt-link>
                            <v-chip
                              v-if="technology.operator && technology.version"
                              class="ml-2"
                              small
                              label
                              outlined
                            >
                              {{ technology.operator }} v{{
                                technology.version
                              }}
                            </v-chip>
                          </div>
                        </td>
                        <td
                          v-if="
                            ['Insufficient', 'Failed'].includes(list.status)
                          "
                          class="text-right"
                        >
                          -
                        </td>
                        <td
                          v-else-if="list.status !== 'Calculating'"
                          class="text-right"
                        >
                          {{ formatNumber(list.rows[technology.slug]) }}
                        </td>
                        <td v-else class="text-right">
                          <Spinner />
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>

                  <div class="text-right">
                    <v-btn
                      v-if="
                        list.query.technologies.length > 20 ||
                        (list.query.technologies.length > 1 &&
                          list.query.matchAllTechnologies === 'not')
                      "
                      class="mt-2 mr-3"
                      small
                      depressed
                      @click="technologiesViewAll = !technologiesViewAll"
                    >
                      <v-icon small left text>
                        {{ technologiesViewAll ? mdiMinus : mdiPlus }}
                      </v-icon>
                      {{
                        technologiesViewAll
                          ? 'View less'
                          : `View all ${list.query.technologies.length}`
                      }}
                    </v-btn>
                  </div>

                  <v-card-text
                    v-if="list.query.technologies.length >= 2"
                    class="px-6"
                  >
                    <small>
                      <template
                        v-if="list.query.matchAllTechnologies === 'and'"
                      >
                        Matching <strong>all</strong> of the above.
                      </template>
                      <template
                        v-else-if="list.query.matchAllTechnologies === 'not'"
                      >
                        Matching
                        <nuxt-link
                          :to="`/technologies${
                            list.query.technologies[0].categories[0]
                              ? `/${list.query.technologies[0].categories[0].slug}`
                              : ''
                          }/${list.query.technologies[0].slug}/`"
                          >{{ list.query.technologies[0].name }}</nuxt-link
                        >
                        and excluding all others.
                      </template>
                      <template v-else
                        >Matching <strong>any</strong> of the above.</template
                      >
                    </small>
                  </v-card-text>

                  <v-divider />
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel v-if="list.query.keywords.length">
                <v-expansion-panel-header class="subtitle-1 font-weight-medium">
                  Keywords
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-chip-group column>
                    <v-chip
                      v-for="keyword in list.query.keywords"
                      :key="keyword"
                      color="primary lighten-1 primary--text"
                      label
                    >
                      {{ keyword }}
                    </v-chip>
                  </v-chip-group>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1 font-weight-medium">
                  Filters
                </v-expansion-panel-header>
                <v-expansion-panel-content class="no-x-padding no-b-padding">
                  <v-simple-table>
                    <tbody>
                      <tr
                        v-if="
                          list.query.industries && list.query.industries.length
                        "
                      >
                        <th width="40%">Industries</th>
                        <td>
                          <v-chip-group class="my-2" column>
                            <v-chip
                              v-for="industry in list.query.industries"
                              :key="industry"
                              outlined
                              small
                              label
                            >
                              {{ industry }}
                            </v-chip>
                          </v-chip-group>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          list.query.companySizes &&
                          list.query.companySizes.length
                        "
                      >
                        <th width="40%">Company sizes</th>
                        <td>
                          <v-chip-group class="my-2" column>
                            <v-chip
                              v-for="{ value, text } in list.query.companySizes"
                              :key="value"
                              outlined
                              small
                              label
                            >
                              {{ text }}
                            </v-chip>
                          </v-chip-group>
                        </td>
                      </tr>
                      <tr v-if="list.query.subset">
                        <th width="40%">List size limit</th>
                        <td>
                          {{ formatNumber(list.query.subset) }}
                          <template v-if="list.query.technologies.length">
                            ({{
                              list.query.subsetSlice === 1
                                ? 'high'
                                : list.query.subsetSlice === 2
                                ? 'medium'
                                : list.query.subsetSlice === 3
                                ? 'low'
                                : list.query.subsetSlice === 4
                                ? 'lowest'
                                : 'highest'
                            }}
                            traffic)
                          </template>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          list.query.technologies.length &&
                          list.query.excludeNoTraffic
                        "
                      >
                        <th width="40%">
                          Exclude websites without traffic data
                        </th>
                        <td>
                          <v-icon color="primary">
                            {{ mdiCheckboxMarked }}
                          </v-icon>
                        </td>
                      </tr>
                      <tr v-if="list.query.geoIps.length">
                        <th width="40%">IP countries</th>
                        <td>
                          <v-chip-group class="my-2" column>
                            <v-tooltip
                              v-for="{ text, value } in list.query.geoIps"
                              :key="value"
                              bottom
                            >
                              <template #activator="{ on }">
                                <v-chip outlined small label v-on="on">
                                  {{ value }}
                                </v-chip>
                              </template>

                              {{ text }}
                            </v-tooltip>
                          </v-chip-group>
                        </td>
                      </tr>
                      <tr v-if="list.query.tlds.length">
                        <th width="40%">TLDs</th>
                        <td>
                          <v-chip-group class="my-2" column>
                            <v-chip
                              v-for="tld in list.query.tlds"
                              :key="tld"
                              outlined
                              small
                              label
                            >
                              {{ tld }}
                            </v-chip>
                          </v-chip-group>
                        </td>
                      </tr>
                      <tr v-if="list.query.languages.length">
                        <th width="40%">Languages</th>
                        <td>
                          <v-chip-group class="my-2" column>
                            <v-tooltip
                              v-for="{ text, value } in list.query.languages"
                              :key="value"
                              bottom
                            >
                              <template #activator="{ on }">
                                <v-chip outlined small label v-on="on">
                                  {{ value }}
                                </v-chip>
                              </template>

                              {{ text }}
                            </v-tooltip>
                          </v-chip-group>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          list.query.languages.length &&
                          list.query.excludeMultilingual
                        "
                      >
                        <th width="40%">Exclude multilingual</th>
                        <td>
                          <v-icon color="primary">
                            {{ mdiCheckboxMarked }}
                          </v-icon>
                        </td>
                      </tr>
                      <tr
                        v-if="
                          !list.query.matchAll &&
                          list.query.geoIps.length &&
                          list.query.languages.length
                        "
                      >
                        <th width="40%">Match country or language</th>
                        <td>
                          <v-icon color="primary">
                            {{ mdiCheckboxMarked }}
                          </v-icon>
                        </td>
                      </tr>
                      <tr v-if="list.query.technologies.length">
                        <th width="40%">Freshness</th>
                        <td>
                          {{ list.query.minAge || 0 }}-{{
                            list.query.maxAge || 3
                          }}
                          months
                        </td>
                      </tr>
                      <tr v-if="list.query.fromDate">
                        <th width="40%">Websites discovered from</th>
                        <td>
                          {{ formatDate(new Date(list.query.fromDate * 1000)) }}
                        </td>
                      </tr>
                      <tr v-if="list.exclusionsFilename">
                        <th width="40%">Exclusions</th>
                        <td>
                          <v-btn
                            :href="`${datasetsBaseUrl}${list.exclusionsFilename}`"
                            color="accent"
                            icon
                          >
                            <v-icon>{{ mdiDownload }}</v-icon>
                          </v-btn>
                        </td>
                      </tr>
                      <tr v-if="list.query.requiredSets.length">
                        <th width="40%">Required</th>
                        <td>
                          <div
                            v-for="key in list.query.requiredSets"
                            :key="key"
                          >
                            {{
                              (set =
                                sets.find(({ key: _key }) => _key === key) ||
                                {}) && null
                            }}
                            {{
                              (set.name || key).charAt(0).toUpperCase() +
                              (set.name || key).substring(1)
                            }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>

              <v-expansion-panel>
                <v-expansion-panel-header class="subtitle-1 font-weight-medium">
                  Fields
                </v-expansion-panel-header>
                <v-expansion-panel-content class="no-x-padding">
                  <v-alert
                    v-if="
                      list.query.compliance === 'exclude' ||
                      list.query.compliance === 'excludeEU'
                    "
                    color="warning"
                    class="mx-6 pb-3"
                    border="left"
                    dense
                    text
                  >
                    <small v-if="list.query.compliance === 'exclude'">
                      Contact details are excluded.
                    </small>
                    <small v-else-if="list.query.compliance === 'excludeEU'">
                      Contact details are excluded for EU websites.
                    </small>
                  </v-alert>

                  <v-simple-table dense>
                    <tbody>
                      <tr>
                        <th>Field set</th>
                        <th class="text-right">Results</th>
                      </tr>
                      <v-tooltip
                        v-for="set in sets.filter(
                          ({ key }) =>
                            key === 'base-list' || list.sets.includes(key)
                        )"
                        :key="set.key"
                        max-width="200"
                        left
                      >
                        <template #activator="{ on }">
                          <tr v-on="on">
                            <td>
                              <small>
                                {{ set.name }}
                              </small>
                            </td>
                            <td
                              v-if="list.status === 'Insufficient'"
                              class="text-right"
                            >
                              -
                            </td>
                            <td
                              v-else-if="list.status !== 'Calculating'"
                              class="text-right"
                            >
                              <small>
                                {{
                                  formatNumber(
                                    set.key === 'base-list'
                                      ? totalRows(
                                          list.rows || 0,
                                          list.query.matchAllTechnologies
                                        )
                                      : list.setRows
                                      ? list.setRows[set.key] || 0
                                      : 0
                                  )
                                }}
                              </small>
                            </td>
                            <td v-else class="text-right">
                              <Spinner />
                            </td>
                          </tr>
                        </template>

                        {{
                          set.attributes
                            .map(
                              ({ name, key }) =>
                                (name || key).charAt(0).toUpperCase() +
                                (name || key).substring(1)
                            )
                            .join(', ')
                        }}
                      </v-tooltip>
                    </tbody>
                  </v-simple-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <template v-if="isAdmin">
              <v-divider />
              <v-card-title class="px-6 subtitle-1 font-weight-medium"
                >Administration</v-card-title
              >
              <v-card-text class="px-0">
                <v-simple-table>
                  <tbody>
                    <tr>
                      <th class="px-6 pb-4" width="30%">User ID</th>
                      <td class="px-6 pb-4">
                        <code class="small">{{ list.userId }}</code>
                      </td>
                    </tr>
                    <tr>
                      <th class="px-6">Timestamp</th>
                      <td class="px-6">
                        <code class="small">{{ list.createdAt }}</code>
                      </td>
                    </tr>
                    <tr v-if="list.filename">
                      <th class="px-6">File</th>
                      <td v-if="list.filename.endsWith('.zip')" class="px-6">
                        <v-btn
                          :href="`https://lists.wappalyzer.com/${list.filename}`"
                          small
                          depressed
                        >
                          <v-icon left small>
                            {{ mdiDownload }}
                          </v-icon>
                          Download
                        </v-btn>
                      </td>
                      <td v-else class="px-6">
                        <code class="small">{{ list.filename }}</code>
                      </td>
                    </tr>
                    <tr v-if="list.calculatingDuration">
                      <th class="px-6">Duration</th>
                      <td
                        v-if="list.calculatingDuration / 3600 >= 2"
                        class="px-6"
                      >
                        {{
                          formatNumber(
                            Math.round(list.calculatingDuration / 3600)
                          )
                        }}
                        hours
                      </td>
                      <td
                        v-else-if="list.calculatingDuration / 60 >= 1"
                        class="px-6"
                      >
                        {{
                          formatNumber(
                            Math.round(list.calculatingDuration / 60)
                          )
                        }}
                        minutes
                      </td>
                      <td v-else class="px-6">
                        {{ formatNumber(Math.round(list.calculatingDuration)) }}
                        seconds
                      </td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </template>
          </v-card>

          <v-card-actions class="mb-4 pa-0 d-flex">
            <v-btn small depressed @click="$refs.faqDialog.open()">
              <v-icon left>
                {{ mdiForum }}
              </v-icon>
              FAQs
            </v-btn>
            <v-spacer />
            <v-btn
              v-if="isAdmin"
              :loading="calculating"
              color="success"
              text
              small
              @click="calculate"
            >
              <v-icon left>
                {{ mdiReload }}
              </v-icon>
              Recalc
            </v-btn>
            <v-btn :to="`/lists/${queryParams}`" color="accent" text small>
              <v-icon left>
                {{ mdiPencil }}
              </v-icon>
              Edit
            </v-btn>
            <v-btn
              v-if="list.status !== 'Complete'"
              color="error"
              class="ml-2"
              text
              small
              @click="cancelDialog = true"
            >
              <v-icon left>
                {{ mdiDelete }}
              </v-icon>
              Delete
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </template>

    <template #footer>
      <Logos />
    </template>

    <FaqDialog ref="faqDialog" topic="lists" />

    <v-dialog v-model="cancelDialog" max-width="400px" eager>
      <v-card>
        <v-card-title>Delete list</v-card-title>
        <v-card-text>
          <v-alert v-if="cancelError" type="error" text>
            {{ cancelError }}
          </v-alert>

          <div>The list will be deleted.</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="cancelDialog = false">
            Cancel
          </v-btn>
          <v-btn :loading="cancelling" color="error" text @click="cancel">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="repeatDialog" max-width="600px" eager>
      <v-card>
        <v-card-title>Weekly updates enabled</v-card-title>
        <v-card-text>
          <p>
            This list will be recreated with newly discovered domains every
            week. We'll send you an email when a new list is available.
          </p>

          <v-alert
            :icon="mdiLightbulbOnOutline"
            type="info"
            class="mt-6 mb-0"
            text
          >
            You can optionally add a callback URL and purchase new lists
            automatically using the
            <nuxt-link to="/docs/api/v2/lists/">lead list API</nuxt-link>.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="accent" text @click="repeatDialog = false">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiArrowLeft,
  mdiDownload,
  mdiCreditCard,
  mdiPlus,
  mdiMinus,
  mdiCheckboxMarked,
  mdiPencil,
  mdiReload,
  mdiAlphaCCircle,
  mdiDelete,
  mdiForum,
  mdiHelpCircleOutline,
  mdiUpdate,
  mdiLockOpenVariantOutline,
  mdiArrowRight,
  mdiEmoticonSadOutline,
  mdiAlertOctagonOutline,
  mdiTimerSandEmpty,
  mdiGift,
  mdiLightbulbOnOutline,
} from '@mdi/js'

import Page from '~/components/Page.vue'
import Spinner from '~/components/Spinner.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import ListSample from '~/components/ListSample.vue'
import TicTacToe from '~/components/TicTacToe.vue'
import sets from '~/assets/json/sets.json'

export default {
  components: {
    Page,
    Spinner,
    TechnologyIcon,
    Logos,
    FaqDialog,
    ListSample,
    TicTacToe,
  },
  async asyncData({
    route,
    $axios,
    store: {
      state: {
        user: { isSignedIn },
      },
    },
  }) {
    if (isSignedIn) {
      const { id } = route.params

      const list = (await $axios.get(`lists-site/${id}`)).data

      return { list }
    }
  },
  data() {
    return {
      title: 'Lead list',
      checks: 0,
      callbackUrlRules: [
        (v) => {
          if (v) {
            try {
              new URL(v)
            } catch (error) {
              return 'Invalid URL'
            }
          }

          return true
        },
      ],
      datasetsBaseUrl: this.$config.DATASETS_BASE_URL,
      cancelDialog: false,
      cancelError: false,
      cancelling: false,
      calculating: false,
      error: false,
      mdiArrowLeft,
      mdiDownload,
      mdiCreditCard,
      mdiPlus,
      mdiMinus,
      mdiCheckboxMarked,
      mdiPencil,
      mdiReload,
      mdiAlphaCCircle,
      mdiDelete,
      mdiForum,
      mdiHelpCircleOutline,
      mdiUpdate,
      mdiLockOpenVariantOutline,
      mdiArrowRight,
      mdiEmoticonSadOutline,
      mdiTimerSandEmpty,
      mdiAlertOctagonOutline,
      mdiGift,
      mdiLightbulbOnOutline,
      panelIndex: 0,
      playGame: false,
      repeatDialog: false,
      repeating: false,
      savingCallbackUrl: false,
      sidePanelIndex: 0,
      paying: false,
      pauseToggleRepeat: false,
      repeat: false,
      claiming: false,
      list: null,
      sets,
      technologiesViewAll: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isPro: ({ credits }) => credits.pro,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
      isMember: ({ user }) =>
        !user.attrs.admin && user.impersonator && !user.impersonator.admin,
      credits: ({ credits: { credits } }) => credits,
      freeLists: ({ credits: { freeLists } }) => freeLists,
    }),
    technologies() {
      return this.technologiesViewAll
        ? this.list.query.technologies
        : this.list.query.matchAllTechnologies === 'not'
        ? this.list.query.technologies.slice(0, 1)
        : this.list.query.technologies.slice(0, 10)
    },
    queryParams() {
      if (!this.list) {
        return ''
      }

      const params = {
        attributes: this.list.query.requiredSets.length
          ? this.list.query.requiredSets
          : undefined,
        technologies: this.list.query.technologies.length
          ? this.list.query.technologies.map(
              ({ slug, operator, version }) =>
                `${slug}${version ? `${operator}${version}` : ''}`
            )
          : undefined,
        keywords: this.list.query.keywords.length
          ? this.list.query.keywords
          : undefined,
        tlds: this.list.query.tlds.length ? this.list.query.tlds : undefined,
        countries: this.list.query.geoIps.length
          ? this.list.query.geoIps.map(({ value }) => value)
          : undefined,
        languages: this.list.query.languages.length
          ? this.list.query.languages.map(({ value }) => value)
          : undefined,
        industries: this.list.query.industries.length
          ? this.list.query.industries.map((industry) =>
              encodeURIComponent(industry)
            )
          : undefined,
        sizes: this.list.query.companySizes.length
          ? this.list.query.companySizes.map(({ value }) => value)
          : undefined,
        subset:
          this.list.query.subset && this.list.query.subset !== 500000
            ? this.list.query.subset.toString()
            : undefined,
        traffic: this.list.query.subsetSlice
          ? this.list.query.subsetSlice.toString()
          : undefined,
        notraffic: this.list.query.excludeNoTraffic ? 'exclude' : undefined,
        multilingual: this.list.query.excludeMultilingual
          ? 'exclude'
          : undefined,
        min:
          this.list.query.minAge !== null && this.list.query.minAge !== 0
            ? this.list.query.minAge.toString()
            : undefined,
        max:
          this.list.query.maxAge !== null && this.list.query.maxAge !== 3
            ? this.list.query.maxAge.toString()
            : undefined,
        from: this.list.query.fromDate
          ? this.list.query.fromDate.toString()
          : undefined,
        filters: this.list.query.matchAll ? undefined : 'or',
        selection:
          this.list.query.matchAllTechnologies === 'and' ||
          this.list.query.matchAllTechnologies === 'not'
            ? this.list.query.matchAllTechnologies
            : undefined,
        contacts:
          this.list.query.compliance === 'exclude' ||
          this.list.query.compliance === 'excludeEU'
            ? this.list.query.compliance
            : undefined,
      }

      const string = Object.keys(params)
        .filter(
          (param) =>
            typeof params[param] !== 'undefined' &&
            params[param] !== '' &&
            params[param] !== null &&
            params[param].length <= 100
        )
        .map(
          (param) =>
            `${param}=${
              Array.isArray(params[param])
                ? params[param].join(',')
                : params[param]
            }`
        )
        .join('&')

      return string ? `?${string}` : ''
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        const { id } = this.$route.params

        try {
          this.getCredits()

          this.list = (await this.$axios.get(`lists-site/${id}`)).data
        } catch (error) {
          this.error = this.getErrorMessage(error)
        }
      }
    },
    list({ id, status, repeat }) {
      if (status === 'Calculating') {
        setTimeout(async () => {
          this.checks += 1

          this.list = (await this.$axios.get(`lists-site/${id}`)).data
        }, Math.min(5000, 2000 + 100 * this.checks * this.checks))
      }

      if (this.repeat !== repeat) {
        this.pauseToggleRepeat = true

        this.repeat = repeat
      }
    },
    repeat() {
      if (this.pauseToggleRepeat) {
        this.pauseToggleRepeat = false
      } else {
        this.toggleRepeat()
      }
    },
  },
  mounted() {
    if (this.list) {
      this.list = { ...this.list }
    }
  },
  created() {
    if (this.isSignedIn) {
      this.getCredits()
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    totalRows(rows, matchAllTechnologies) {
      return matchAllTechnologies === 'and'
        ? Object.values(rows)[0]
        : Object.values(rows).reduce((total, rows) => total + rows, 0)
    },
    async pay() {
      this.error = false
      this.paying = true
      this.success = false

      try {
        await this.$axios.patch(`lists-site/${this.list.id}`, {
          paymentMethod: 'credits',
        })

        this.list = (await this.$axios.get(`lists-site/${this.list.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.paying = false

      this.getCredits()

      this.scrollToTop()
    },
    async claim() {
      this.error = false
      this.claiming = true
      this.success = false

      try {
        await this.$axios.patch(`lists-site/${this.list.id}`, {
          paymentMethod: 'free',
        })

        this.list = (await this.$axios.get(`lists-site/${this.list.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.claiming = false

      this.getCredits()

      this.scrollToTop()
    },
    async invoice() {
      this.error = false
      this.invoicing = true
      this.success = false

      try {
        await this.$axios.patch(`orders/${this.order.id}`, {
          paymentMethod: this.paymentMethod,
          stripePaymentMethod:
            this.paymentMethod === 'stripe' ? this.stripePaymentMethod : null,
        })

        this.order = (await this.$axios.get(`orders/${this.order.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.invoicing = false

      this.scrollToTop()
    },

    async cancel() {
      this.cancelError = false
      this.cancelling = true

      try {
        const { id } = this.$route.params

        await this.$axios.delete(`lists-site/${id}`)

        this.$router.push({ path: '/lists/all/' })
      } catch (error) {
        this.cancelError = this.getErrorMessage(error)
      }

      this.cancelling = false
    },
    async toggleRepeat() {
      this.error = false
      this.repeating = true

      try {
        await this.$axios.patch(`lists-site/${this.list.id}`, {
          repeat: this.repeat,
        })

        if (this.repeat) {
          this.repeatDialog = true
        }
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.repeating = false
    },
    async saveCallbackUrl() {
      this.error = false
      this.savingCallbackUrl = true

      try {
        await this.$axios.patch(`lists-site/${this.list.id}`, {
          callbackUrl: this.list.callbackUrl,
        })
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.savingCallbackUrl = false
    },
    async calculate() {
      this.error = false
      this.calculating = true

      try {
        await this.$axios.patch(`lists-site/${this.list.id}`, {
          calculate: true,
        })

        this.list = (await this.$axios.get(`lists-site/${this.list.id}`)).data
      } catch (error) {
        this.error = this.getErrorMessage(error)
      }

      this.calculating = false
    },
  },
}
</script>
