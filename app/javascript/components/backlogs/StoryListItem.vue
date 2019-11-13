<template>
  <li class="list-group-item p-2" :style="backgroundColor">
    <div v-if="!isEdit">
      <div
        class="d-flex justify-content-between align-items-center rb-story-list-font"
        :style="idealTextColorForItem">
        <router-link :id="`popover-story-${story.id}`" :to="createStoryPath" class="badge badge-secondary bg-white badge-outlined rb-badge-radius p-1 mr-2">
          {{story.ticket_number_with_ticket_prefix}}
        </router-link>
        <div class="d-block text-truncate w-100 mr-2" :title="story.title">
          <s v-if="story.is_done" @click="onClickTitle">{{story.title}}</s>
          <span v-else @click="onClickTitle">{{story.title}}</span>
        </div>
        <span @click="onClickPoint">
          {{ story.point | numeral('0.0') }}
        </span>
      </div>
    </div>
    <div v-else>
      <b-form @submit.stop.prevent="editDone(true)">
        <div class="d-flex justify-content-between align-items-center mb-2 rb-story-list-font">
          <router-link :to="createStoryPath" class="badge badge-secondary bg-white badge-outlined rb-badge-radius p-1 mr-2">
            {{story.ticket_number_with_ticket_prefix}}
          </router-link>
          <span class="text-monospace d-block text-truncate w-100 mr-2">
            <b-form-input size="sm" v-model="story.title" ref="storyTitle" />
          </span>
          <span>
            <b-form-input size="sm" type="number" v-model="story.point" step="0.5" ref="storyPoint" />
          </span>
        </div>
        <div class="d-flex justify-content-end">
          <button type="submit" class="btn rb-btn-xs btn-primary mr-1" key="check-button">
            <i class="fas fa-check"></i> {{ $t('action.save') }}
          </button>
          <a href="#" @click="editDone(false)" class="btn rb-btn-xs btn-secondary" key="ban-button">
            <i class="fas fa-ban"></i> {{ $t('action.cancel') }}
          </a>
        </div>
      </b-form>
    </div>

    <b-popover :target="`popover-story-${story.id}`" triggers="hover" placement="right" delay="500">
      <dl>
        <dt>{{ $t('ticket.title') }}</dt>
        <dd>{{ story.title }}</dd>
        <dt>{{ $t('ticket.body') }}</dt>
        <dd><MarkdownText :content="story.body" /></dd>
      </dl>
    </b-popover>
  </li>
</template>

<script>
import Vue from 'vue'
import vueNumeralFilter from 'vue-numeral-filter'
import MarkdownText from '../MarkdownText'
import { mapMutations, mapActions } from 'vuex';
import ColorUtils from '../../mixins/colorUtils'

Vue.use(vueNumeralFilter)

export default {
  name: 'StoryListItem',
  components: {
    MarkdownText
  },
  mixins: [
    ColorUtils
  ],
  props: {
    story: Object
  },
  data() {
    return {
      isEdit: false
    }
  },
  computed: {
    createStoryPath() {
      return `/stories/${this.story.id}`
    },
    backgroundColor() {
      let color = '#ffffff'
      if (this.story.project_ticket_category) {
        color = this.story.project_ticket_category.color
      }

      return {
        "background-color": color
      }
    },
    idealTextColorForItem() {
      let color = '#ffffff'
      if (this.story.project_ticket_category) {
        color = this.story.project_ticket_category.color;
      }

      return {
        color: this.idealTextColor(color)
      }
    }
  },
  methods: {
    onClickTitle() {
      this.isEdit = true

      this.$nextTick(() => {
        this.$refs.storyTitle.focus()
      })
    },
    onClickPoint() {
      this.isEdit = true

      this.$nextTick(() => {
        this.$refs.storyPoint.focus()
      })
    },
    editDone(isSave) {
      this.isEdit = false
      if (isSave) {
        this.updateStory({
          projectId: this.story.project_id,
          story: this.story
        })
      }
    },
    ...mapActions('Stories', {
      updateStory: 'updateStory'
    })
  }
}
</script>

<style>
.rb-story-list-font {
  font-weight: 500 !important;
}
</style>