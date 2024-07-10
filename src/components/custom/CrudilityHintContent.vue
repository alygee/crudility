<template>
  <crudility-modal
    v-model="show"
    fullscreen
  >
    <template #activator="{ on }">
      <crudility-button-icon
        v-on="on"
        class="help-button"
        icon-name="help"
      ></crudility-button-icon>
    </template>

    <v-card class="hint">
      <v-card-title
        class="headline grey lighten-2 hint__title"
        primary-title
      >
       {{ $t('title') }}
      </v-card-title>

      <v-card-text class="hint__content">

        <div class="hint__block">
          <h3>{{ $t('search_mode.title') }}</h3>
          {{ $t('search_mode.description_1') }}
          <img class="hint__image" src="../../assets/img/search_entity.png">
          {{ $t('search_mode.description_2') }}
        </div>

        <div class="hint__block">
          <h3>{{ $t('request_format.title') }}</h3>
          <p v-html="$t('request_format.description_1')" />
          <div class="hint__code-block">
            projects: name = TEST
          </div>
          <p v-html="$t('request_format.description_2')" />
          <div class="hint__code-block">
            projects: name = TEST and description ~ 'IT support'
          </div>
          {{ $t('request_format.description_3') }}
          </div>
          <div class="hint__block">
            <h3>{{ $t('rules.title') }}</h3>
            <ul>
              <li>
                  <b>{{ $t('rules.colon.title') }}</b> <br>
                  <p v-html="$t('rules.colon.description')" />
              </li>
              <li>
                  <b v-html="$t('rules.quotes.title')" /><br>
                  {{ $t('rules.quotes.description_1') }}
                  <div class="hint__code-block">
                      projects: description ~ 'IT support'
                  </div>
                  {{ $t('rules.quotes.description_2') }}
              </li>
              <li>
                  <b>{{ $t('rules.edit.title') }}</b>
              </li>
            </ul>
          </div>
          <div class="hint__block">
            <h3>{{ $t('validation.title') }}</h3>
            {{ $t('validation.description') }}<br>
            {{ $t('validation.valid') }}
            <img class="hint__image" src="../../assets/img/search_query_valid.png">
            {{ $t('validation.invalid') }}
            <img class="hint__image" src="../../assets/img/search_query_invalid.png">
          </div>
          <div class="hint__block">
            <h3>{{ $t('hotkeys.title') }}</h3>
            <v-data-table
              :headers="shortKeys.headers"
              :items="shortKeys.items"
              class="elevation-1"
              hide-default-footer
              hide-default-header
            />
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="show = false"
          > OK </v-btn>
        </v-card-actions>
      </v-card>
  </crudility-modal>
</template>

<script>
import CrudilityButtonIcon from '../ui/button/CrudilityButtonIcon'
import hintMessages from '../../locales/hint_messages'
import CrudilityModal from '../ui/CrudilityModal'

export default {
  name: "CrudilityHintContent",
  components: {
    CrudilityModal,
    CrudilityButtonIcon
  },
  i18n: {
    messages: hintMessages
  },
  data () {
    return {
      show: false,
      shortKeys: {
        headers: [
          { text: 'Key', value: 'key' },
          { text: 'Action', value: 'action' }],
        items: this.$t('hotkeys.keys')
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .hint {
    max-height: none;
    &__content {
      padding-top: 20px !important;
    }
    &__image {
      width: 100%;
    }
    &__block {
      padding: 10px 0;
      h3 {
        margin-bottom: 10px;
      }
    }
    &__code-block {
      margin: 6px 0;
      background: #F4F5F7;
      width: 100%;
      border-radius: 3px;
      padding: 10px 5px;
    }
  }
</style>