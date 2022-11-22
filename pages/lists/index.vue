<template>
  <div>
    <Page :title="title" :head="meta">
      <div class="mt-6 mb-4">
        <v-btn
          class="mb-2 mr-2"
          color="primary lighten-1 primary--text"
          depressed
          :loading="tourActiveStep === -2"
          :disabled="tourActiveStep != -2 && (loading || isLoading)"
          @click="tourStart"
        >
          <v-icon left>
            {{ mdiPlay }}
          </v-icon>
          Take a tour
        </v-btn>

        <v-btn class="mb-2 mr-2" depressed @click="suggestionsDialog = true">
          <v-icon left>
            {{ mdiLightbulbOutline }}
          </v-icon>
          List ideas
        </v-btn>

        <v-btn href="/lists/sample/" class="mb-2 mr-2" depressed>
          <v-icon left>
            {{ mdiFileOutline }}
          </v-icon>
          Sample list
        </v-btn>

        <v-btn class="mb-2 mr-2" depressed @click="$refs.faqDialog.open()">
          <v-icon left>
            {{ mdiForum }}
          </v-icon>
          FAQs
        </v-btn>

        <v-btn to="/api/" class="mb-2 mr-2" depressed>
          <v-icon left>
            {{ mdiConsole }}
          </v-icon>
          API
        </v-btn>
      </div>

      <div class="body-2" style="max-width: 600px">
        <p>
          Get started by selecting one or more technologies or keywords.
          Optionally add filters to get exactly what you need. Within minutes,
          you get a free sample to review. Sign up for a
          <v-chip to="/pro/" color="primary" x-small outlined>PRO</v-chip>
          plan to download the full list.
        </p>
      </div>

      <div class="mt-6 mb-10"></div>

      <template #content>
        <v-form ref="form">
          <v-alert v-if="error" type="error" text>
            {{ error }}
          </v-alert>

          <v-row class="mb-4">
            <v-col class="py-0" cols="12" sm="6">
              <Tour
                :step="tourGetStep('technologies')"
                :steps="Object.keys(tourSteps).length"
                :text="tourGetText('technologies')"
                :active-step="tourActiveStep"
                @nav="tourNav"
              >
                <v-expansion-panels
                  v-model="panelsMain"
                  class="mb-4 body-2"
                  :disabled="loading"
                  multiple
                >
                  <v-expansion-panel ref="technologies" value="technologies">
                    <v-expansion-panel-header class="subtitle-2">
                      Technologies
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Choose one or more technologies (e.g. 'Shopify') or
                        categories (e.g. 'Ecommerce').
                      </p>

                      <Technologies ref="selector" @select="selectItem" />

                      <template v-if="selectedItems.length">
                        <Tour
                          :step="tourGetStep('technologiesSingle')"
                          :steps="Object.keys(tourSteps).length"
                          :text="tourGetText('technologiesSingle')"
                          :active-step="tourActiveStep"
                          @nav="tourNav"
                        >
                          <v-simple-table
                            class="mx-n6 pt-0"
                            style="max-width: none"
                          >
                            <tbody>
                              <tr>
                                <th class="pl-6">Technology</th>
                                <th width="30%">
                                  Version

                                  <v-tooltip max-width="300" top>
                                    <template #activator="{ on }">
                                      <sup>
                                        <v-icon small v-on="on">{{
                                          mdiHelpCircleOutline
                                        }}</v-icon>
                                      </sup>
                                    </template>

                                    Optionaly specify a technology version in
                                    SemVer notation, e.g. '2' or '2.0.0'.<br /><br />
                                    <code>&gt;=</code> Equal to or greater
                                    than<br />
                                    <code>=&nbsp;</code> Exact match<br />
                                    <code>&lt;=</code> Equal to or lower than<br /><br />
                                    Leave blank to include all versions.<br /><br />
                                    Not available on all technologies.
                                  </v-tooltip>
                                </th>
                                <th width="1" />
                              </tr>
                              <tr
                                v-for="item in selectedItems"
                                :key="item.slug"
                              >
                                <td class="pl-6">
                                  <div
                                    v-if="item.type === 'technology'"
                                    class="d-flex align-center py-2"
                                  >
                                    <TechnologyIcon :icon="item.icon" />
                                    <span>{{ item.name }}</span>
                                  </div>
                                  <v-row v-else>
                                    <v-col>
                                      {{ item.name }}
                                    </v-col>
                                    <v-col class="pr-0 text-right">
                                      <small
                                        >(x{{
                                          Math.min(100, item.technologiesCount)
                                        }})</small
                                      >
                                    </v-col>
                                  </v-row>
                                </td>
                                <td>
                                  <v-row v-if="item.type === 'technology'">
                                    <v-col class="py-0 pr-2">
                                      <v-select
                                        v-model="item.operator"
                                        :items="[
                                          { text: '>=', value: '>=' },
                                          { text: '=', value: '=' },
                                          { text: '<=', value: '<=' },
                                        ]"
                                        class="my-0"
                                        hide-details="auto"
                                        dense
                                      />
                                    </v-col>
                                    <v-col class="pa-0">
                                      <v-text-field
                                        v-model="item.version"
                                        placeholder="Any"
                                        class="ma-0"
                                        hide-details="auto"
                                        :rules="[
                                          (v) => !v || /^(\d.?){1,3}$/.test(v),
                                        ]"
                                        dense
                                      />
                                    </v-col>
                                  </v-row>
                                  <span v-else class="text--disabled">-</span>
                                </td>
                                <td class="pl-0 pr-6">
                                  <v-btn icon @click="removeItem(item)">
                                    <v-icon>{{ mdiCloseCircleOutline }}</v-icon>
                                  </v-btn>
                                </td>
                              </tr>
                            </tbody>
                          </v-simple-table>
                        </Tour>
                      </template>

                      <template v-if="selectedItems.length == 2">
                        <v-divider class="mx-n6 mb-6" />

                        <Tour
                          :step="tourGetStep('technologiesMultiple')"
                          :steps="Object.keys(tourSteps).length"
                          :text="tourGetText('technologiesMultiple')"
                          :active-step="tourActiveStep"
                          @nav="tourNav"
                        >
                          Create a list of websites that use...
                          <v-radio-group
                            v-model="matchAllTechnologies"
                            class="mb-2"
                            hide-details
                          >
                            <v-radio class="mt-0" value="or" hide-details>
                              <template #label>
                                <div>
                                  {{ selectedItems[0].name }}
                                  <strong>or</strong>
                                  {{ selectedItems[1].name }}
                                </div>
                              </template>
                            </v-radio>
                            <v-radio
                              v-if="!selected.categories.length"
                              class="mt-0"
                              value="and"
                              hide-details
                            >
                              <template #label>
                                <div>
                                  {{ selectedItems[0].name }}
                                  <strong>and</strong>
                                  {{ selectedItems[1].name }}
                                </div>
                              </template>
                            </v-radio>
                            <v-radio class="mt-0" value="not" hide-details>
                              <template #label>
                                <div>
                                  {{ selectedItems[0].name }} and
                                  <strong>not</strong>
                                  {{ selectedItems[1].name }}
                                </div>
                              </template>
                            </v-radio>
                          </v-radio-group>
                        </Tour>
                      </template>

                      <template v-if="selectedItems.length > 2">
                        <v-divider class="mx-n6 mb-6" />

                        Create a list of websites that use...
                        <v-radio-group
                          v-model="matchAllTechnologies"
                          class="mb-2"
                          hide-details
                        >
                          <v-radio class="mt-0" value="or" hide-details>
                            <template #label>
                              <div>
                                <strong>Any</strong> of the selected
                                technologies
                              </div>
                            </template>
                          </v-radio>
                          <v-radio
                            v-if="selectedItems.length <= 3"
                            class="mt-0"
                            value="and"
                            hide-details
                          >
                            <template #label>
                              <div>
                                <strong>All</strong> of the selected
                                technologies
                              </div>
                            </template>
                          </v-radio>
                          <v-radio class="mt-0" value="not" hide-details>
                            <template #label>
                              <div>
                                {{ selectedItems[0].name }} and
                                <strong>not</strong>
                                any of the other selected technologies
                              </div>
                            </template>
                          </v-radio>
                        </v-radio-group>
                      </template>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="keywords" value="keywords">
                    <Tour
                      :step="tourGetStep('keywords')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('keywords')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Keywords
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>
                          Target websites that use certain keywords, such as a
                          brand, product, profession, or any noun. Use
                          <code>not</code> to exclude keywords, e.g. 'not
                          health'.
                        </p>

                        <v-form
                          ref="formKeyword"
                          @submit.prevent="addKeyword()"
                        >
                          <v-text-field
                            v-model="keyword"
                            :error-messages="keywordErrors"
                            :append-icon="mdiPlus"
                            placeholder="E.g. education"
                            class="pt-0"
                            hide-details="auto"
                            :rules="[
                              (v) =>
                                v.match(/^(not )?[a-z0-9]*$/i) ||
                                'Must be alphanumeric (a-z0-9) or start with \'not \', e.g. \'health\' or \'not health\'.',
                            ]"
                            outlined
                            dense
                            @click:append="addKeyword()"
                          />
                        </v-form>

                        <v-chip-group
                          v-if="selected.keywords.length"
                          class="mb-n4 mt-4"
                          column
                        >
                          <v-chip
                            v-for="_keyword in selected.keywords"
                            :key="_keyword"
                            color="primary lighten-1 primary--text"
                            label
                            close
                            @click:close="removeKeyword(_keyword)"
                          >
                            {{ _keyword }}
                          </v-chip>
                        </v-chip-group>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-8 mb-2"
                          dense
                        >
                          <small>
                            For best results, include multiple variations (e.g.
                            shop, shops and shopping).<br />
                            Use the
                            <nuxt-link to="/websites/"
                              >keyword search</nuxt-link
                            >
                            function to see how many websites we have on record
                            for a given keyword.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>
                </v-expansion-panels>
              </Tour>

              <v-expansion-panels
                v-model="panelsSelection"
                class="body-2"
                :disabled="!selection"
                multiple
              >
                <v-expansion-panel ref="attributes" value="attributes">
                  <Tour
                    :step="tourGetStep('fields')"
                    :steps="Object.keys(tourSteps).length"
                    :text="tourGetText('fields')"
                    :active-step="tourActiveStep"
                    @nav="tourNav"
                  >
                    <v-expansion-panel-header class="subtitle-2">
                      Fields
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="no-x-padding">
                      <v-simple-table>
                        <tbody>
                          <tr>
                            <th />
                            <th width="20%">Exclude</th>
                            <th width="20%">Include</th>
                            <th width="20%">Required (one of)</th>
                          </tr>
                          <tr v-for="(key, name) in setOptions" :key="key">
                            <td>{{ name }}</td>
                            <td class="text-center">
                              <v-radio-group
                                v-model="selected.sets[key]"
                                class="ma-0"
                                hide-details
                                :disabled="
                                  ['phone', 'email'].includes(key) &&
                                  compliance === 'exclude'
                                "
                              >
                                <v-radio value="exclude" class="ma-0" />
                              </v-radio-group>
                            </td>
                            <td class="text-center">
                              <v-radio-group
                                v-model="selected.sets[key]"
                                class="ma-0"
                                hide-details
                                :disabled="
                                  ['phone', 'email'].includes(key) &&
                                  compliance === 'exclude'
                                "
                              >
                                <v-radio value="include" class="ma-0" />
                              </v-radio-group>
                            </td>
                            <td class="text-center">
                              <v-radio-group
                                v-model="selected.sets[key]"
                                class="ma-0"
                                hide-details
                                :disabled="
                                  ['phone', 'email'].includes(key) &&
                                  compliance === 'exclude'
                                "
                              >
                                <v-radio value="required" class="ma-0" />
                              </v-radio-group>
                            </td>
                          </tr>
                        </tbody>
                      </v-simple-table>

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mx-6 mt-4 mb-2"
                        dense
                      >
                        <small>
                          Contact details are obtained from websites' contact
                          pages. When selecting required fields, we only include
                          websites for which we have ANY of the fields
                          available.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </Tour>
                </v-expansion-panel>

                <v-expansion-panel ref="compliance" value="compliance">
                  <v-expansion-panel-header class="subtitle-2">
                    Compliance
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-radio-group v-model="compliance" class="my-0" mandatory>
                      <v-radio
                        value="include"
                        class="mt-0"
                        hide-details
                        :disabled="australia"
                      >
                        <template #label>
                          Include personal and contact details
                        </template>
                      </v-radio>
                      <v-radio
                        value="excludeEU"
                        class="mt-0"
                        hide-details
                        :disabled="australia"
                      >
                        <template #label>
                          Exclude personal and contact details of EU websites
                        </template>
                      </v-radio>
                      <v-radio value="exclude" class="mt-0" hide-details>
                        <template #label>
                          Exclude all personal and contact details
                        </template>
                      </v-radio>
                    </v-radio-group>

                    <v-checkbox
                      v-model="australia"
                      label="I'm in or do business in Australia"
                      class="mt-0"
                      hide-details
                    />

                    <v-alert
                      color="secondary"
                      border="left"
                      class="mt-8 mb-2"
                      dense
                    >
                      <small>
                        We're unable to supply names, email addresses and phone
                        numbers if you're in Australia or carry on business or
                        activities in Australia.
                      </small>
                    </v-alert>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
            <v-col class="py-0" cols="12" sm="6">
              <Tour
                :step="tourGetStep('filters')"
                :steps="Object.keys(tourSteps).length"
                :text="tourGetText('filters')"
                :active-step="tourActiveStep"
                @nav="tourNav"
              >
                <v-expansion-panels
                  v-model="panelsFilters"
                  class="body-2"
                  :disabled="!selection"
                  multiple
                >
                  <v-expansion-panel ref="ipCountries" value="ipCountries">
                    <Tour
                      :step="tourGetStep('filtersCountry')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersCountry')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Countries
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>Target websites in specific countries.</p>

                        <v-select
                          ref="country"
                          :items="geoIps"
                          class="mb-4 pt-0"
                          label="Select a country"
                          hide-details
                          outlined
                          dense
                          eager
                        >
                          <template #prepend-item>
                            <v-list-item
                              ripple
                              @click="toggleGeoIps(countriesEurope)"
                            >
                              <v-list-item-content>Europe</v-list-item-content>
                            </v-list-item>
                            <v-list-item
                              ripple
                              @click="toggleGeoIps(countriesEU)"
                            >
                              <v-list-item-content>
                                European Union
                              </v-list-item-content>
                            </v-list-item>

                            <v-divider class="mt-3 mb-2" />
                          </template>

                          <template #item="{ item }">
                            <v-list-item ripple @click="toggleGeoIp(item)">
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-row class="align-center">
                                  <v-col class="py-0">
                                    {{ item.text }}
                                  </v-col>
                                  <v-col
                                    class="
                                      py-0
                                      nowrap
                                      text-right
                                      body-2
                                      flex-grow-0
                                    "
                                  >
                                    {{ item.value }}
                                  </v-col>
                                </v-row>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-chip-group
                          v-if="selected.geoIps.length"
                          class="mt-n1 mb-2"
                          column
                        >
                          <v-tooltip
                            v-for="(item, i) in selected.geoIps"
                            :key="i"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-chip
                                color="primary lighten-1 primary--text"
                                label
                                close
                                v-on="on"
                                @click:close="toggleGeoIp(item)"
                              >
                                {{ item.value }}
                              </v-chip>
                            </template>

                            {{
                              item.parent && item.parent !== item.text
                                ? `${item.parent} (${item.text})`
                                : item.text
                            }}
                          </v-tooltip>
                        </v-chip-group>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-6 mb-2"
                          dense
                        >
                          <small>
                            When a website's country can't be determined through
                            other means, we perform a lookup on the IP address.
                            This may be different from the country a business
                            operates from.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="languages" value="languages">
                    <Tour
                      :step="tourGetStep('filtersLanguages')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersLanguages')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Languages
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>Target websites using specific languages.</p>

                        <v-select
                          ref="language"
                          v-model="selectedLanguage"
                          :items="languages"
                          class="mb-4 pt-0"
                          label="Select a language"
                          hide-details
                          outlined
                          dense
                          eager
                        >
                          <template #item="{ item }">
                            <v-list-item ripple @click="toggleLanguage(item)">
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    typeof item.value === 'object'
                                      ? mdiDotsHorizontal
                                      : item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-row class="align-center">
                                  <v-col class="py-0">
                                    {{ item.text }}
                                  </v-col>
                                  <v-col
                                    class="
                                      py-0
                                      nowrap
                                      text-right
                                      body-2
                                      flex-grow-0
                                    "
                                  >
                                    {{
                                      typeof item.value === 'object'
                                        ? item.value[Object.keys(item.value)[0]]
                                        : item.value
                                    }}
                                  </v-col>
                                </v-row>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-select
                          v-if="variants"
                          ref="variant"
                          :items="variants"
                          class="mb-4"
                          label="Select a language country"
                          hide-details
                          outlined
                          required
                          dense
                          eager
                        >
                          <template #prepend-item>
                            <v-list-item ripple @click="toggleVariants">
                              <v-list-item-action>
                                <v-icon
                                  :color="
                                    selected.languages.length > 0
                                      ? 'primary'
                                      : ''
                                  "
                                >
                                  {{
                                    variants.every(({ active }) => active)
                                      ? mdiCheckboxMarked
                                      : variants.some(({ active }) => active)
                                      ? mdiMinusBoxOutline
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-list-item-title>
                                  Select All
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-divider class="mt-2" />
                          </template>

                          <template #item="{ item }">
                            <v-list-item ripple @click="toggleVariant(item)">
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-row class="align-center">
                                  <v-col class="py-0">
                                    {{ item.text }}
                                  </v-col>
                                  <v-col
                                    class="
                                      py-0
                                      nowrap
                                      text-right
                                      body-2
                                      flex-grow-0
                                    "
                                  >
                                    {{ item.value }}
                                  </v-col>
                                </v-row>
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-chip-group
                          v-if="selected.languages.length"
                          class="mt-n1"
                          column
                        >
                          <v-tooltip
                            v-for="(item, i) in selected.languages"
                            :key="i"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-chip
                                color="primary lighten-1 primary--text"
                                label
                                close
                                v-on="on"
                                @click:close="toggleVariant(item)"
                              >
                                {{ item.value }}
                              </v-chip>
                            </template>

                            {{
                              item.parent && item.parent !== item.text
                                ? `${item.parent} (${item.text})`
                                : item.text
                            }}
                          </v-tooltip>
                        </v-chip-group>

                        <v-checkbox
                          v-if="
                            selected.geoIps.length && selected.languages.length
                          "
                          v-model="matchAny"
                          class="my-2"
                          label="Filter by country OR language (yields more results)"
                          hide-details
                        />

                        <v-checkbox
                          v-if="selected.languages.length"
                          v-model="excludeMultilingual"
                          class="my-2"
                          label="Exclude multilingual websites"
                          hide-details
                        />

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-8 mb-2"
                          dense
                        >
                          <small>
                            To target websites in specific countries, we
                            recommend filtering by country and not language.
                            Selecting both may result in a much smaller list.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="tlds" value="tlds">
                    <Tour
                      :step="tourGetStep('filtersTlds')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersTlds')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Top-level domains
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>Target countries by top-level domain.</p>

                        <v-row>
                          <v-col>
                            <v-select
                              ref="country"
                              v-model="selectedCountry"
                              :items="countries"
                              class="mb-4 pt-0"
                              label="Select a country"
                              hide-details
                              outlined
                              dense
                              eager
                            />
                          </v-col>
                          <v-col>
                            <v-form ref="form" @submit.prevent="addTld">
                              <v-text-field
                                v-model="tld"
                                :error-messages="tldErrors"
                                :append-icon="mdiPlus"
                                placeholder=".com"
                                class="pt-0"
                                hide-details="auto"
                                outlined
                                dense
                                @click:append="addTld"
                              />
                            </v-form>
                          </v-col>
                        </v-row>

                        <v-select
                          v-if="selectedCountry"
                          ref="tld"
                          :items="tlds"
                          class="mb-8"
                          label="Select a top-level-domain"
                          hide-details
                          outlined
                          dense
                          eager
                        >
                          <template #prepend-item>
                            <v-list-item ripple @click="toggleTlds">
                              <v-list-item-action>
                                <v-icon
                                  :color="
                                    selected.tlds.length > 0 ? 'primary' : ''
                                  "
                                >
                                  {{
                                    tlds.every(({ active }) => active)
                                      ? mdiCheckboxMarked
                                      : tlds.some(({ active }) => active)
                                      ? mdiMinusBoxOutline
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                <v-list-item-title>
                                  Select All
                                </v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>

                            <v-divider class="mt-2" />
                          </template>

                          <template #item="{ item }">
                            <v-list-item ripple @click="toggleTld(item)">
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>

                              <v-list-item-content>
                                {{ item.text }}
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-chip-group
                          v-if="selected.tlds.length"
                          class="mt-n1 mb-4"
                          column
                        >
                          <v-tooltip
                            v-for="(item, i) in selected.tlds"
                            :key="i"
                            bottom
                          >
                            <template #activator="{ on }">
                              <v-chip
                                color="primary lighten-1 primary--text"
                                label
                                close
                                v-on="item.parent ? on : undefined"
                                @click:close="toggleTld(item)"
                              >
                                {{ item.value }}
                              </v-chip>
                            </template>

                            {{ item.parent }}
                          </v-tooltip>
                        </v-chip-group>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-4 mb-2"
                          dense
                        >
                          <small>
                            The top-level domain is the last part of a domain
                            name (e.g. '.com'). This can be used to target
                            websites in specific countries (e.g. '.com.au' for
                            Australia).
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="industries" value="industries">
                    <Tour
                      :step="tourGetStep('filtersIndustries')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersIndustries')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Industry
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>Choose which company industries to include.</p>

                        <v-select
                          v-model="selectedIndustry"
                          :disabled="selected.sets.company === 'exclude'"
                          :items="industries"
                          class="mb-4 pt-0"
                          label="Select an industry"
                          hide-details
                          outlined
                          dense
                          eager
                        >
                          <template #item="{ item }">
                            <v-list-item ripple @click="toggleIndustry(item)">
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                {{ item.text }}
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-chip-group
                          v-if="selected.industries.length"
                          class="mb-n4"
                          column
                        >
                          <v-chip
                            v-for="item in selected.industries"
                            :key="item.value"
                            color="primary lighten-1 primary--text"
                            label
                            close
                            @click:close="toggleIndustry(item)"
                          >
                            {{ item.text }}
                          </v-chip>
                        </v-chip-group>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-8 mb-2"
                          dense
                        >
                          <small>
                            Industry information is available for a portion of
                            the websites we track. To get more results, leave
                            this blank or select multiple.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="companySizes" value="companySizes">
                    <Tour
                      :step="tourGetStep('filtersCompanySizes')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersCompanySizes')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Company size
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>Choose what size companies to include.</p>

                        <v-select
                          v-model="selectedCompanySize"
                          :disabled="selected.sets.company === 'exclude'"
                          :items="companySizes"
                          class="mb-4 pt-0"
                          label="Number of employees"
                          hide-details
                          outlined
                          dense
                          eager
                        >
                          <template #item="{ item }">
                            <v-list-item
                              ripple
                              @click="toggleCompanySize(item)"
                            >
                              <v-list-item-action>
                                <v-icon :color="item.active ? 'primary' : ''">
                                  {{
                                    item.active
                                      ? mdiCheckboxMarked
                                      : mdiCheckboxBlankOutline
                                  }}
                                </v-icon>
                              </v-list-item-action>
                              <v-list-item-content>
                                {{ item.text }}
                              </v-list-item-content>
                            </v-list-item>
                          </template>
                        </v-select>

                        <v-chip-group
                          v-if="selected.companySizes.length"
                          class="mb-n4"
                          column
                        >
                          <v-chip
                            v-for="item in selected.companySizes"
                            :key="item.value"
                            color="primary lighten-1 primary--text"
                            label
                            close
                            @click:close="toggleCompanySize(item)"
                          >
                            {{ item.text }}
                          </v-chip>
                        </v-chip-group>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-8 mb-2"
                          dense
                        >
                          <small>
                            Company size is available for a portion of the
                            websites we track. To get more results, leave this
                            blank or select multiple.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="subset">
                    <Tour
                      :step="tourGetStep('filtersSubset')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersSubset')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        List size &amp; website traffic
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>
                          Optionally limit the size of the list to a number of
                          high or low traffic websites per technology.
                        </p>

                        <v-text-field
                          v-model="subset"
                          label="Max number of websites to include"
                          :rules="[
                            (v) =>
                              !v ||
                              /^[0-9]+$/.test(v) ||
                              'Value must be numeric',
                            (v) =>
                              !v ||
                              (parseInt(v, 10) >= minListSize &&
                                (isAdmin || parseInt(v, 10) <= 1000000)) ||
                              `List size must be between at ${minListSize} and 1M. For larger lists, please contact us.`,
                          ]"
                          class="mt-6 mb-8 pt-0"
                          placeholder="500000"
                          hide-details="auto"
                          outlined
                          dense
                        />

                        <v-slider
                          v-model="subsetSlice"
                          label="Traffic"
                          :tick-labels="['Highest', '', 'Medium', '', 'Lowest']"
                          :disabled="!subset || !selectedItems.length"
                          min="0"
                          max="4"
                          hide-details="auto"
                          class="mb-10"
                        />

                        <v-checkbox
                          v-model="excludeNoTraffic"
                          label="Exclude websites without traffic data"
                          hide-details
                          :disabled="!selectedItems.length"
                        />

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mt-6 mb-2"
                          dense
                        >
                          <small>
                            Set a list size limit to control your budget or to
                            only include less trafficked websites. The default
                            limit is 500,000 most trafficked websites per
                            technology.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel
                    ref="age"
                    value="age"
                    :disabled="!selectedItems.length"
                  >
                    <Tour
                      :step="tourGetStep('filtersAge')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersAge')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Freshness
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>
                          Choose a range in months to only include websites
                          verified within this range. Recommended range is 0-3.
                        </p>

                        <v-row class="mt-6">
                          <v-col>
                            <v-slider
                              v-model="minAge"
                              label="Min"
                              min="0"
                              max="11"
                              thumb-size="20"
                              thumb-label="always"
                              hint="A non-zero minimum returns historical results only"
                              :rules="[
                                (v) =>
                                  v < maxAge || 'Must be lower than max age',
                              ]"
                              :persistent-hint="minAge > 0"
                              hide-details="auto"
                            />
                          </v-col>
                          <v-col>
                            <v-slider
                              v-model="maxAge"
                              label="Max"
                              min="1"
                              max="12"
                              thumb-size="20"
                              thumb-label="always"
                              :rules="[
                                (v) =>
                                  v > minAge || 'Must be greater than min age',
                              ]"
                              hide-details="auto"
                            />
                          </v-col>
                        </v-row>

                        <v-alert
                          color="secondary"
                          border="left"
                          class="my-6"
                          dense
                        >
                          <small>
                            We attempt to analyse every website at least once a
                            month. A range of 0-3 means we include websites that
                            have been verified at least once in the last three
                            months.<br /><br />
                            A lower maximum yields fresher but fewer results.<br />
                            A higher maximum yields more but possibly outdated
                            results.<br />
                            A higher minimum yields historic data.
                          </small>
                        </v-alert>

                        <p>
                          Optionally only include websites that we discovered
                          after a specific date. Useful if you purchased this
                          list in the past and want only new results.
                        </p>

                        <v-switch
                          v-model="enableFromDate"
                          label="Enable date filter"
                        />

                        <v-card v-if="enableFromDate" class="mb-2" outlined>
                          <v-date-picker v-model="fromDate" full-width />
                        </v-card>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>

                  <v-expansion-panel ref="exclusions" value="exclusions">
                    <Tour
                      :step="tourGetStep('filtersExclusions')"
                      :steps="Object.keys(tourSteps).length"
                      :text="tourGetText('filtersExclusions')"
                      :active-step="tourActiveStep"
                      @nav="tourNav"
                    >
                      <v-expansion-panel-header class="subtitle-2">
                        Exclusions
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <p>
                          Upload a .txt file with domain names to exclude, each
                          on a new line. Or, upload the CSV file from a previous
                          purchase.
                        </p>

                        <v-file-input
                          :error-messages="fileErrors"
                          :hint="
                            file
                              ? `${file
                                  .split('\n')
                                  .length.toLocaleString()} URLs`
                              : ''
                          "
                          persistent-hint
                          placeholder="Select a file..."
                          accept="text/plain,text/csv"
                          class="mb-0 pt-0"
                          outlined
                          dense
                          small-chips
                          multiple
                          clearable
                          @change="fileChange"
                        />

                        <v-checkbox
                          v-model="removeInvalid"
                          v-if="removeInvalid || fileErrors.length"
                          label="Remove invalid URLs"
                          class="mt-0 mb-6"
                          hide-details="auto"
                        />

                        <v-alert
                          color="secondary"
                          border="left"
                          class="mb-2"
                          dense
                        >
                          <small>
                            If you purchased a similar list before and want to
                            avoid duplicates, upload a list of websites to
                            exclude. This way you only pay for results you don't
                            already have.
                          </small>
                        </v-alert>
                      </v-expansion-panel-content>
                    </Tour>
                  </v-expansion-panel>
                </v-expansion-panels>
              </Tour>
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col>
              <Tour
                :step="tourGetStep('createList')"
                :steps="Object.keys(tourSteps).length"
                :text="tourGetText('createList')"
                :active-step="tourActiveStep"
                @nav="tourNav"
              >
                <v-btn
                  :disabled="!selection"
                  :loading="creating"
                  color="primary"
                  large
                  depressed
                  @click="submit()"
                >
                  Create list
                  <v-icon right>
                    {{ mdiArrowRight }}
                  </v-icon>
                </v-btn>
              </Tour>
            </v-col>

            <v-col v-if="selection" class="align-center">
              <v-tooltip max-width="300" top>
                <template #activator="{ on }">
                  <div v-on="on">
                    <Bar
                      :total="100"
                      :max="100"
                      :value="listSizeEstimate"
                      class="mt-3 mb-2"
                      dense
                    />
                    <div class="d-flex">
                      <small>Smaller, more targeted list</small>
                      <v-spacer />
                      <small>Larger, less targeted list</small>
                    </div>
                  </div>
                </template>

                Estimated effect of selected filters on list size. The more
                filters you apply, the smaller your list will be.
              </v-tooltip>
            </v-col>
          </v-row>
        </v-form>
      </template>

      <v-dialog v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title>No filters specified</v-card-title>
          <v-card-text class="pb-0">
            This list could be very large. Set a list size limit or add a filter
            to narrow down the results.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="accent"
              text
              @click="
                confirmDialog = false
                creating = false
              "
            >
              Go back
            </v-btn>
            <v-btn color="error" text @click="submit(true)">
              Continue anyway
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="maxTechnologiesDialog" max-width="500px">
        <v-card>
          <v-card-title>Selection limit reached</v-card-title>
          <v-card-text class="pb-0">
            Please select no more than 100 technologies.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="maxTechnologiesDialog = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="categoryTruncatedDialog" max-width="500px">
        <v-card>
          <v-card-title>Selection limit reached</v-card-title>
          <v-card-text class="pb-0">
            The selected category is too large will be limited to the top 100
            technologies.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="categoryTruncatedDialog = false">
              Ok
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <FaqDialog ref="faqDialog" topic="lists" />

      <v-dialog v-model="suggestionsDialog" max-width="600px">
        <v-card>
          <v-card-title>List ideas</v-card-title>
          <v-card-text>
            These are some examples of lists you can create. Click on a link to
            pre-fill the form and use it as a starting point for your own list.
          </v-card-text>
          <v-card-text class="px-0 pb-0">
            <v-simple-table>
              <tbody>
                <tr
                  v-for="({ text, query }, index) in suggestions"
                  :key="index"
                >
                  <td class="px-6">
                    <!-- eslint-disable-next-line vue/no-v-html -->
                    <a @click="fillForm(query)" v-html="text" />
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="suggestionsDialog = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiCalculator,
  mdiFileOutline,
  mdiForum,
  mdiFormatListChecks,
  mdiLightbulbOutline,
  mdiPlay,
  mdiCloseCircleOutline,
  mdiHelpCircleOutline,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBoxOutline,
  mdiDotsHorizontal,
  mdiPlus,
  mdiArrowRight,
  mdiFilterOutline,
  mdiArrowCollapseVertical,
  mdiFilterVariant,
  mdiLockOpenVariantOutline,
  mdiLockOutline,
  mdiPhone,
  mdiConsole,
} from '@mdi/js'
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import FaqDialog from '~/components/FaqDialog.vue'
import Tour from '~/components/Tour.vue'
import Bar from '~/components/Bar.vue'
import { lists as meta } from '~/assets/json/meta.json'
import languages from '~/assets/json/languages.json'
import tlds from '~/assets/json/tlds.json'
import countries from '~/assets/json/countries.json'
import countriesEU from '~/assets/json/countriesEU.json'
import countriesEurope from '~/assets/json/countriesEurope.json'
import industries from '~/assets/json/companyIndustries.json'
import companySizes from '~/assets/json/companySizes.json'

export default {
  components: {
    Page,
    Technologies,
    TechnologyIcon,
    Logos,
    SignIn,
    FaqDialog,
    Tour,
    Bar,
  },
  data() {
    return {
      title: meta.title,
      australia: false,
      setOptions: {
        'Company details': 'company',
        'Email addresses': 'email',
        'Phone numbers': 'phone',
        'Social media profiles': 'social',
      },
      compliance: 'include',
      countries: Object.keys(tlds),
      countriesEU,
      countriesEurope,
      confirmDialog: false,
      error: false,
      fromDate: '',
      enableFromDate: false,
      createDialog: false,
      file: '',
      fileErrors: [],
      inputFile: null,
      keyword: '',
      keywordErrors: [],
      listSizeEstimate: 100,
      matchAny: false,
      matchAllTechnologies: 'or',
      mdiCalculator,
      mdiFileOutline,
      mdiForum,
      mdiFormatListChecks,
      mdiLightbulbOutline,
      mdiPlay,
      mdiCloseCircleOutline,
      mdiHelpCircleOutline,
      mdiCheckboxMarked,
      mdiCheckboxBlankOutline,
      mdiMinusBoxOutline,
      mdiDotsHorizontal,
      mdiPlus,
      mdiArrowRight,
      mdiFilterOutline,
      mdiArrowCollapseVertical,
      mdiFilterVariant,
      mdiLockOpenVariantOutline,
      mdiLockOutline,
      mdiPhone,
      mdiConsole,
      minAge: 0,
      maxAge: 3,
      meta,
      maxTechnologiesDialog: false,
      categoryTruncatedDialog: false,
      panelsMain: [],
      panelsSelection: [],
      panelsFilters: [],
      loading: false,
      removeInvalid: false,
      signInDialog: false,
      selectedCountry: '',
      selectedLanguage: {},
      selectedIndustry: '',
      selectedCompanySize: '',
      selected: {
        categories: [],
        technologies: [],
        geoIps: [],
        tlds: [],
        languages: [],
        keywords: [],
        industries: [],
        companySizes: [],
        sets: {
          company: 'include',
          email: 'include',
          phone: 'include',
          social: 'include',
        },
      },
      subset: null,
      subsetSlice: 0,
      suggestionsDialog: false,
      tourActiveStep: -1,
      tourSteps: {
        technologies: {
          text: 'To create a list of websites, start by selecting a technology, keywords, or both.',
          before: () => this.fillForm({}),
        },
        technologiesSingle: {
          text: "You can select one or more technologies, like 'Shopify', or even an entire category, like 'ecommerce'.",
          before: async () => {
            await this.fillForm({ technologies: 'shopify' })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        technologiesMultiple: {
          text: 'When selecting multiple technologies, you can combine them in different ways.',
          before: async () => {
            await this.fillForm({ technologies: 'shopify,paypal' })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        keywords: {
          text: 'Find or exclude websites that mention specific words. Enter multiple words and variations for more results.',
          before: async () => {
            await this.fillForm({
              keywords: 'shoe,shoes,sneaker,sneakers,not sandals',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filters: {
          text: 'Apply filters to narrow down your search and get more relevant results. All filters are optional. The more filters you select, the fewer results you get.',
          before: () => this.fillForm({ technologies: 'shopify' }),
        },
        filtersCountry: {
          text: "Find websites by country, e.g. 'Australia'. Usually this will be where the company operates from or where the website is hosted.",
          before: async () => {
            await this.fillForm({ technologies: 'shopify', countries: 'au' })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersLanguages: {
          text: 'If filtering by country is not enough, narrow results down to one or more languages.',
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
              languages: 'en,en-US',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersTlds: {
          text: 'Filter by top-level domain to only get .com or .co.uk websites, for instance.',
          before: async () => {
            await this.fillForm({ technologies: 'shopify', tlds: '.co.uk' })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersIndustries: {
          text: 'Industry information comes from LinkedIn and is available for a portion of the websites in our database. Filtering by industry will result in a much smaller list. Select more industries for more results.',
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
              industries: 'Apparel & Fashion',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersCompanySizes: {
          text: 'Filter by employee count to target larger or smaller companies. As with industries, this information is not always available and will result in a smaller list.',
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
              sizes: '200',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersSubset: {
          text: 'Limit results to a number of the most or least trafficked websites, e.g. the top 1,000. Traffic estimates are based on visits by users of our browser extension.',
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
              subset: '1000',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersAge: {
          text: "Choose between more or fewer but fresher results. By default we include results that we've verified at least once in the last three months.",
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
            })

            this.$refs.age.toggle()

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        filtersExclusions: {
          text: 'Upload a list of websites to exclude. This is useful if you created a list with us before and only want new results.',
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
            })

            this.$refs.exclusions.toggle()

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        fields: {
          text: "If certain information like email addresses are essential for your use case, you can make them required. Any results that we don't have this information for will be excluded.",
          before: async () => {
            await this.fillForm({
              technologies: 'shopify',
              attributes: 'email',
            })

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
        createList: {
          text: "When ready, click 'create list' to get a free sample to review. You can create multiple lists to find what you need before making a purchase. If you still need help, reach out and we'll walk you through it.",
          before: async () => {
            await this.fillForm({})

            await new Promise((resolve) => setTimeout(resolve, 700))
          },
        },
      },
      excludeNoTraffic: false,
      excludeMultilingual: false,
      updateQueryTimeout: null,
      list: false,
      creating: false,
      tld: '',
      tldErrors: [],
      languages: Object.keys(languages).reduce(
        (list, text) => [...list, { text, value: languages[text] }],
        []
      ),
      suggestions: [
        {
          text: 'Websites using Klarna <strong>in United States</strong>',
          query: { technologies: 'klarna-checkout', countries: 'us' },
        },
        {
          text: 'Websites mentioning <strong>Education</strong> related keywords',
          query: { keywords: 'education,learning,school,university' },
        },
        {
          text: 'Websites using Shopify <strong>and</strong> Klaviyo',
          query: { technologies: 'shopify,klaviyo', selection: 'and' },
        },
        {
          text: 'Websites using PayPal <strong>and not</strong> Stripe',
          query: { technologies: 'paypal,stripe', selection: 'not' },
        },
        {
          text: '<strong>High traffic</strong> websites using OpenCart',
          query: {
            technologies: 'opencart',
            subset: '5000',
            notraffic: 'exclude',
          },
        },
        {
          text: '<strong>Low traffic</strong> websites using WooCommerce <strong>in Australia</strong>',
          query: {
            technologies: 'woocommerce',
            countries: 'au',
            subset: '5000',
            traffic: '4',
            notraffic: 'exclude',
          },
        },
        {
          text: 'Websites using Magento <strong>version 2</strong>',
          query: { technologies: 'magento=2', traffic: '4' },
        },
        {
          text: 'Websites using an <strong>old version</strong> of WordPress',
          query: { technologies: 'wordpress<=4.9', traffic: '4' },
        },
      ],
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
    selection() {
      return (
        !this.loading &&
        (this.selectedItems.length || this.selected.keywords.length)
      )
    },
    selectedItems() {
      return [...this.selected.technologies, ...this.selected.categories]
    },
    variants() {
      if (typeof this.selectedLanguage.value === 'object') {
        return Object.keys(this.selectedLanguage.value).reduce(
          (list, text) => [
            ...list,
            {
              text,
              parent: this.selectedLanguage.text,
              value: this.selectedLanguage.value[text],
            },
          ],
          []
        )
      } else {
        return false
      }
    },
    tlds() {
      return tlds[this.selectedCountry].map((tld) => ({
        text: tld,
        active: this.selected.tlds.some(({ value }) => value === tld),
        parent: this.selectedCountry,
        value: tld,
      }))
    },
    geoIps() {
      return countries.map(({ value, text }) => ({
        text,
        active: this.selected.geoIps.some(
          ({ value: _value }) => _value === value
        ),
        value,
      }))
    },
    industries() {
      return industries.map(({ value, text }) => ({
        text,
        active: this.selected.industries.some(
          ({ value: _value }) => _value === value
        ),
        value,
      }))
    },
    companySizes() {
      return companySizes.map(({ value, text }) => ({
        text,
        active: this.selected.companySizes.some(
          ({ value: _value }) => _value === value
        ),
        value,
      }))
    },
    minListSize() {
      return 50
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        this.signInDialog = false

        if (
          this.user.billingCountry &&
          this.user.billingCountry.toLowerCase() === 'au'
        ) {
          this.australia = true
        }

        if (this.creating) {
          this.submit()
        }
      }
    },
    async isLoading() {
      if (!this.isLoading) {
        await this.fillForm()
      }
    },
    australia() {
      if (this.australia) {
        this.compliance = 'exclude'
      }
    },
    removeInvalid() {
      this.fileChange()
    },
    signInDialog() {
      if (!this.signInDialog) {
        this.creating = false
      }
    },
    selectedCountry() {
      this.$nextTick(() => {
        this.$watch('$refs.tld.isMenuActive', (active) => {
          if (!active) {
            this.selectedCountry = ''

            this.$refs.country && this.$refs.country.blur()
          }
        })
      })
    },
    selected: {
      handler() {
        this.updateQuery()
      },
      deep: true,
    },
    subset() {
      this.updateQuery()
    },
    subsetSlice() {
      this.updateQuery()
    },
    excludeNoTraffic() {
      this.updateQuery()
    },
    excludeMultilingual() {
      this.updateQuery()
    },
    minAge() {
      this.updateQuery()
    },
    maxAge() {
      this.updateQuery()
    },
    enableFromDate() {
      this.updateQuery()
    },
    fromDate() {
      this.updateQuery()
    },
    matchAny() {
      this.updateQuery()
    },
    matchAllTechnologies() {
      this.updateQuery()
    },
    compliance() {
      if (this.compliance === 'exclude') {
        this.selected.sets.email = 'exclude'
        this.selected.sets.phone = 'exclude'
      } else {
        this.selected.sets.email =
          this.selected.sets.email === 'required' ? 'required' : 'include'
        this.selected.sets.phone =
          this.selected.sets.phone === 'required' ? 'required' : 'include'
      }

      this.updateQuery()
    },
  },
  created() {
    this.getCredits()
  },
  async mounted() {
    if (!this.isLoading) {
      await this.fillForm()

      this.tourStart()
    }
  },
  methods: {
    ...mapActions({
      getCredits: 'credits/get',
    }),
    async submit(confirmed = false) {
      this.error = ''
      this.creating = true

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      const totalHostnames = this.selected.technologies.reduce(
        (sum, { hostnames }) => sum + hostnames,
        0
      )

      if (
        !confirmed &&
        (totalHostnames > 100000 || this.selected.categories.length) &&
        !this.selected.languages.length &&
        !this.selected.geoIps.length &&
        !this.selected.tlds.length &&
        parseInt(this.subset || 500000, 10) >= 500000
      ) {
        this.confirmDialog = true

        return
      } else {
        this.confirmDialog = false
      }

      this.createDialog = true

      try {
        const list = (
          await this.$axios.put('lists-site', {
            query: {
              technologies: this.selected.technologies.map(
                ({ slug, name, icon, categories, operator, version }) => ({
                  slug,
                  name,
                  icon,
                  categories,
                  operator,
                  version,
                })
              ),
              categories: this.selected.categories.map(({ slug, name }) => ({
                slug,
                name,
              })),
              keywords: this.selected.keywords,
              languages: this.selected.languages.map(
                ({ text, parent, value }) => ({
                  text:
                    parent && parent !== text ? `${parent} (${text})` : text,
                  value,
                })
              ),
              geoIps: this.selected.geoIps.map(({ value, text }) => ({
                value,
                text,
              })),
              tlds: this.selected.tlds.map(({ value }) => value),
              matchAll: !this.matchAny,
              matchAllTechnologies:
                ((this.selected.technologies.length === 2 ||
                  this.selected.technologies.length === 3) &&
                  this.matchAllTechnologies === 'and') ||
                (this.selectedItems.length >= 2 &&
                  this.matchAllTechnologies === 'not')
                  ? this.matchAllTechnologies
                  : 'or',
              subset: this.subset || 500000,
              subsetSlice: this.subsetSlice || 0,
              excludeNoTraffic: this.excludeNoTraffic,
              excludeMultilingual: this.excludeMultilingual,
              minAge: this.minAge,
              maxAge: this.maxAge,
              fromDate:
                this.fromDate && this.enableFromDate
                  ? (new Date(this.fromDate).getTime() / 1000).toString()
                  : undefined,
              industries: this.selected.industries.map(({ value }) => value),
              companySizes: this.selected.companySizes.map(
                ({ value, text }) => ({ value, text })
              ),
              compliance: this.compliance,
              requiredSets: Object.keys(this.selected.sets).filter(
                (set) => this.selected.sets[set] === 'required'
              ),
            },
            sets: Object.keys(this.selected.sets).filter(
              (key) => this.selected.sets[key] !== 'excluded'
            ),
            exclusions: this.file,
          })
        ).data

        this.$router.push(`/lists/${list.id}/`)
      } catch (error) {
        this.error = this.getErrorMessage(error)

        this.scrollTo('h1')

        this.creating = false
      }
    },
    selectItem(item) {
      item = {
        operator: '=',
        version: '',
        ...item,
        active: true,
      }

      const totalTechnologies =
        this.selected.technologies.length +
        this.selected.categories.reduce(
          (total, { technologiesCount }) => total + technologiesCount,
          0
        )

      if (item.type === 'technology') {
        if (totalTechnologies > 101) {
          this.maxTechnologiesDialog = true
        } else {
          this.selected.technologies.push(item)
        }
      } else {
        if (totalTechnologies + Math.min(100, item.technologiesCount) > 101) {
          this.maxTechnologiesDialog = true
        } else {
          if (item.technologiesCount > 100) {
            this.categoryTruncatedDialog = true
          }

          this.selected.categories.push(item)
        }
      }

      this.categories = this.selected.categories.filter(
        ({ slug }, index) =>
          this.selected.categories.findIndex(
            (category) => slug === category.slug
          ) === index
      )

      this.selected.technologies = this.selected.technologies.filter(
        ({ slug }, index) =>
          this.selected.technologies.findIndex(
            (technology) => slug === technology.slug
          ) === index
      )

      this.$refs.selector && this.$refs.selector.clear()
    },
    removeItem(item) {
      item.active = false

      if (item.type === 'technology') {
        this.selected.technologies = this.selected.technologies.filter(
          ({ slug }) => slug !== item.slug
        )
      } else {
        this.selected.categories = this.selected.categories.filter(
          ({ slug }) => slug !== item.slug
        )
      }
    },
    toggleLanguage(item) {
      if (typeof item.value !== 'object') {
        this.toggleVariant(item)

        this.$nextTick(() => {
          this.selectedLanguage = ''

          this.$refs.language && this.$refs.language.blur()
        })
      } else {
        this.selectedLanguage = item

        this.$nextTick(() => {
          this.$watch('$refs.variant.isMenuActive', (active) => {
            if (!active) {
              this.selectedLanguage = ''

              this.$refs.language && this.$refs.language.blur()
            }
          })

          this.$refs.language && this.$refs.language.blur()
        })
      }
    },
    toggleVariants() {
      const active = this.variants.every(({ active }) => active)

      this.variants.forEach((item) => this.toggleVariant(item, active))
    },
    toggleVariant(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.languages = this.selected.languages.filter(
          (language) => language.value !== item.value
        )
      } else {
        item.active = true

        this.selected.languages.push(item)
      }
    },
    toggleTlds() {
      const active = this.tlds.every(({ active }) => active)

      this.tlds.forEach((item) => this.toggleTld(item, active))
    },
    toggleTld(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.tlds = this.selected.tlds.filter(
          (tld) => tld.value !== item.value
        )
      } else {
        item.active = true

        this.selected.tlds.push(item)
      }

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )
    },
    toggleGeoIp(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.geoIps = this.selected.geoIps.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true

        this.selected.geoIps.push(item)
      }

      this.selected.geoIps = this.selected.geoIps.filter(
        ({ value }, index) =>
          this.selected.geoIps.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )
    },
    toggleGeoIps(ipCountries) {
      ipCountries.forEach((ipCountry) => {
        const item = this.geoIps.find(
          ({ value }) => value === ipCountry.trim().toUpperCase()
        )

        this.toggleGeoIp(item)
      })
    },
    toggleIndustry(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.industries = this.selected.industries.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true

        this.selected.industries.push(item)
      }

      this.selected.industries = this.selected.industries.filter(
        ({ value }, index) =>
          this.selected.industries.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )
    },
    toggleCompanySize(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.companySizes = this.selected.companySizes.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true
        this.selected.companySizes.push(item)
      }

      this.selected.companySizes = this.selected.companySizes.filter(
        ({ value }, index) =>
          this.selected.companySizes.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )
    },
    addTld() {
      const value = this.tld.toLowerCase()

      if (!/^.[a-z0-9.]*[a-z0-9]+$/.test(value)) {
        this.tldErrors = ['E.g. .com.au']

        return
      }

      const tld = {
        text: value,
        active: true,
        parent: '',
        value,
      }

      Object.keys(tlds).forEach((country) => {
        if (tlds[country].includes(tld.value)) {
          tld.parent = country
        }
      })

      this.selected.tlds.push(tld)

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )

      this.tld = ''
      this.tldErrors = []
    },
    addKeyword(keyword = this.keyword) {
      keyword = keyword
        .trim()
        .toLowerCase()
        .replace(/[\u{0080}-\u{FFFF}]/gu, '')

      if (keyword.length < 3) {
        this.keywordErrors = ['Must be at least 3 characters']

        return
      }

      if (!this.$refs.formKeyword || this.$refs.formKeyword.validate()) {
        if (!this.selected.keywords.includes(keyword)) {
          this.selected.keywords.push(keyword)
        }

        this.keyword = ''
        this.keywordErrors = []
      }
    },
    removeKeyword(keyword) {
      const index = this.selected.keywords.findIndex(
        (_keyword) => _keyword === keyword
      )

      if (index !== -1) {
        this.selected.keywords.splice(index, 1)
      }
    },
    async fileChange(file = this.inputFile) {
      this.inputFile = file

      this.file = ''
      this.fileErrors = []

      if (!file) {
        return
      }

      const files = Array.isArray(file) ? file : [file]

      const lines = []

      for (const _file of files) {
        const _lines = (await _file.text()).trim().split('\n')

        if (_lines[0].startsWith('"url"')) {
          _lines.shift()
        }

        lines.push(..._lines)
      }

      this.file = [...new Set(lines)]
        .map((line, i) => {
          line = line.trim().replace(/^"([^"]+)".*$/, '$1')

          const url = !/^https?:\/\//.test(line) ? `https://${line}` : line

          try {
            new URL(url) // eslint-disable-line no-new
          } catch (error) {
            if (this.removeInvalid) {
              return null
            } else {
              this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
            }
          }

          return url
        })
        .filter((line) => line)

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 250000) {
        this.fileErrors.push('Limit of 250,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
    updateQuery() {
      clearTimeout(this.updateQueryTimeout)

      this.updateQueryTimeout = setTimeout(() => {
        if (this.loading || this.isLoading) {
          return
        }

        const query = {
          technologies: this.selected.technologies
            .map(
              ({ slug, operator, version }) =>
                `${slug}${version ? `${operator}${version}` : ''}`
            )
            .join(','),
          categories: this.selected.categories
            .map(({ slug }) => slug)
            .join(','),
          tlds: this.selected.tlds.map(({ value }) => value).join(','),
          countries: this.selected.geoIps
            .map(({ value }) => value)
            .join(',')
            .toLowerCase(),
          languages: this.selected.languages
            .map(({ value }) => value)
            .join(','),
          subset:
            this.subset && this.subset !== 500000
              ? this.subset.toString()
              : undefined,
          traffic: this.subsetSlice ? this.subsetSlice.toString() : undefined,
          notraffic: this.excludeNoTraffic ? 'exclude' : undefined,
          multilingual: this.excludeMultilingual ? 'exclude' : undefined,
          min: this.minAge !== 0 ? this.minAge.toString() : undefined,
          max: this.maxAge !== 3 ? this.maxAge.toString() : undefined,
          from:
            this.fromDate && this.enableFromDate
              ? (new Date(this.fromDate).getTime() / 1000).toString()
              : undefined,
          filters: this.matchAny ? 'or' : undefined,
          selection:
            this.matchAllTechnologies === 'and' ||
            this.matchAllTechnologies === 'not'
              ? this.matchAllTechnologies
              : undefined,
          contacts:
            this.compliance === 'exclude' || this.compliance === 'excludeEU'
              ? this.compliance
              : undefined,
          keywords: this.selected.keywords.join(','),
          industries: this.selected.industries
            .map(({ value }) => value)
            .join(','),
          sizes: this.selected.companySizes.map(({ value }) => value).join(','),
          attributes: Object.keys(this.selected.sets)
            .filter((set) => this.selected.sets[set] === 'required')
            .join(','),
        }

        this.$router.replace({
          path: '/lists/',
          query: Object.keys(query).reduce((filtered, key) => {
            if (
              typeof query[key] !== 'undefined' &&
              query[key] !== '' &&
              query[key] !== null &&
              query[key].length <= 100
            ) {
              filtered[key] = query[key]
            }

            return filtered
          }, {}),
        })
      }, 100)

      // Estimate list size
      this.listSizeEstimate = 100

      //
      ;['geoIps', 'languages', 'tlds', 'industries', 'companySizes'].forEach(
        (key) => {
          const count = this.selected[key].length

          this.listSizeEstimate /= count ? 8 - Math.min(15, count) * 0.5 : 1
        }
      )

      const required = Object.keys(this.selected.sets).filter(
        (key) => this.selected.sets[key] === 'required'
      ).length

      this.listSizeEstimate /= required ? 1 + required * 1 : 1

      const keywords = this.selected.keywords.length

      if (this.selected.technologies.length && keywords) {
        this.listSizeEstimate /= keywords ? 8 - Math.min(15, keywords) * 0.5 : 1
      }

      const age = Math.max(0, 3 - Math.min(3, this.maxAge - this.minAge))

      this.listSizeEstimate /= age ? 1 + age * 0.5 : 1

      this.listSizeEstimate /= this.excludeNoTraffic ? 1.8 : 1

      this.listSizeEstimate /= this.matchAllTechnologies === 'or' ? 1 : 8
    },
    async fillForm(query) {
      if (query) {
        this.$router.replace({ path: '/lists/', query })

        this.suggestionsDialog = false
      }

      this.loading = true

      const {
        categories,
        technologies,
        attributes,
        min,
        max,
        from,
        subset,
        traffic,
        notraffic,
        multilingual,
        countries,
        tlds,
        languages,
        filters,
        selection,
        contacts,
        keywords,
        industries,
        sizes,
      } = query || this.$route.query

      if (Object.keys(query || this.$route.query).length) {
        this.scrollTo('h1')
      }

      this.panelsMain = []
      this.panelsSelection = []
      this.panelsFilters = []

      this.minAge = Math.max(0, Math.min(11, parseInt(min || 0, 10)))

      this.maxAge = Math.max(
        1,
        Math.min(12, parseInt(typeof max === 'undefined' ? 3 : max || 0, 10))
      )

      this.fromDate = from
        ? new Date(parseInt(from, 10) * 1000).toISOString().split('T')[0]
        : ''

      if (this.fromDate) {
        this.enableFromDate = true
      }

      this.subset =
        typeof subset === 'undefined'
          ? null
          : Math.min(
              1000000,
              Math.max(this.minListSize, parseInt(subset || 0, 10))
            ) || null

      this.subsetSlice = Math.max(0, Math.min(4, parseInt(traffic || 0, 10)))

      this.excludeNoTraffic = notraffic === 'exclude'

      this.excludeMultilingual = multilingual === 'exclude'

      this.matchAny = filters === 'or'

      this.compliance = ['exclude', 'excludeEu'].includes(contacts)
        ? contacts
        : 'include'

      if (this.compliance !== 'exclude') {
        const _attributes = String(attributes).split(',')

        ;['email', 'phone', 'social', 'company'].forEach((set) => {
          if (_attributes.includes(set)) {
            this.selected.sets[set] = 'required'
          }
        })
      }

      this.matchAllTechnologies =
        selection === 'and' || selection === 'not' ? selection : 'or'

      this.selected.geoIps = []

      if (countries) {
        countries.split(',').forEach((ipCountry) => {
          const item = this.geoIps.find(
            ({ value }) => value === ipCountry.trim().toUpperCase()
          )

          this.toggleGeoIp(item)
        })
      }

      this.selected.tlds = []

      if (tlds) {
        tlds
          .toString()
          .split(',')
          .filter((tld) => tld)
          .forEach((tld) => {
            this.tld = tld

            this.addTld()
          })
      }

      this.selected.languages = []

      if (languages) {
        languages.split(',').forEach((language) => {
          language = language.trim().toLowerCase()

          let selected

          this.languages.forEach((item) => {
            if (typeof item.value === 'object') {
              Object.keys(item.value).forEach((name) => {
                if (item.value[name].toLowerCase() === language) {
                  selected = {
                    parent: item.text,
                    text: name,
                    value: item.value[name],
                    active: true,
                  }
                }
              })
            } else if (item.value.toLowerCase() === language) {
              item.active = true

              selected = item
            }
          })

          if (selected) {
            this.selected.languages.push(selected)
          }
        })
      }

      this.selected.technologies = []
      this.selected.categories = []

      try {
        if (technologies) {
          for (let technologySlug of technologies.toString().split(',')) {
            let operator = '='
            let version = ''

            if (technologySlug.includes('=')) {
              operator = '='
            }

            if (technologySlug.includes('>=')) {
              operator = '>='
            }

            if (technologySlug.includes('<=')) {
              operator = '<='
            }

            if (operator) {
              ;[technologySlug, version] = technologySlug.split(operator)
            }

            const { slug, name, icon, categories } = (
              await this.$axios.get(`technologies/${technologySlug}`)
            ).data

            this.selectItem({
              type: 'technology',
              slug,
              name,
              categories,
              icon,
              operator,
              version,
            })
          }
        }

        if (categories) {
          for (const categorySlug of categories.toString().split(',')) {
            const { slug, name, technologies } = (
              await this.$axios.get(`categories/${categorySlug}`)
            ).data

            this.selectItem({
              type: 'category',
              slug,
              name,
              technologiesCount: Object.keys(technologies).length,
            })
          }
        }
      } catch (error) {
        this.error = this.getErrorMessage(error)

        this.scrollTo('h1')
      }

      this.selected.keywords = []

      if (keywords) {
        keywords
          .split(',')
          .forEach((keyword) =>
            this.addKeyword(keyword.toLowerCase().replace(/[^a-z ]/g, ''))
          )
      }

      this.selected.industries = []

      if (industries) {
        industries.split(',').forEach((_industry) => {
          const industry = this.industries.find(
            ({ value }) => value === _industry
          )

          if (industry) {
            this.toggleIndustry(industry)
          }
        })
      }

      this.selected.companySizes = []

      if (sizes) {
        sizes.split(',').forEach((_companySize) => {
          const companySize = this.companySizes.find(
            ({ value }) => value === parseInt(_companySize, 10)
          )

          if (companySize) {
            this.toggleCompanySize(companySize)
          }
        })
      }

      if (
        this.isSignedIn &&
        this.user.billingCountry &&
        this.user.billingCountry.toLowerCase() === 'au'
      ) {
        this.australia = true
      }

      if (attributes) {
        this.$refs.attributes.toggle()
      }

      if (this.minAge || this.maxAge !== 3 || this.fromDate) {
        this.$refs.age.toggle()
      }

      if (this.subset) {
        this.$refs.subset.toggle()
      }

      if (this.selected.geoIps.length) {
        this.$refs.ipCountries.toggle()
      }

      if (this.selected.tlds.length) {
        this.$refs.tlds.toggle()
      }

      if (this.selected.languages.length) {
        this.$refs.languages.toggle()
      }

      if (this.selected.keywords.length) {
        this.$refs.keywords.toggle()
      }

      if (this.selectedItems.length || !this.selected.keywords.length) {
        this.$refs.technologies.toggle()
      }

      if (this.compliance === 'exclude' || this.australia) {
        this.$refs.compliance.toggle()
      }

      if (this.selected.industries.length) {
        this.$refs.industries.toggle()
      }

      if (this.selected.companySizes.length) {
        this.$refs.companySizes.toggle()
      }

      this.loading = false
    },
    async tourStart() {
      if (this.tourActiveStep > 0) {
        return
      }

      const step = 0

      await Object.values(this.tourSteps)[step].before()

      this.tourActiveStep = step
    },
    async tourNav(action) {
      let step = -1

      if (action === 'previous') {
        step = Math.max(0, this.tourActiveStep - 1)
      }

      if (action === 'next') {
        step = Math.min(
          Object.keys(this.tourSteps).length - 1,
          this.tourActiveStep + 1
        )
      }

      this.tourActiveStep = -2

      if (step >= 0) {
        await Object.values(this.tourSteps)[step].before()
      } else {
        this.fillForm({})
      }

      this.tourActiveStep = step
    },
    tourGetStep(key) {
      return Object.keys(this.tourSteps).indexOf(key)
    },
    tourGetText(key) {
      return this.tourSteps[key].text
    },
  },
}
</script>

<style>
.nowrap {
  white-space: nowrap;
}
</style>
