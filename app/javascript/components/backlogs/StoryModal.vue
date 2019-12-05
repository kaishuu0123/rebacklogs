<template>
  <b-modal
    id="storyModal"
    modal-class="rb-modal"
    size="lg"
    ref="modal"
    @shown="onShow"
    @hidden="onHide"
    hide-header
    hide-footer
    no-fade>
    <div id="rb-story-modal" class="container-fluid" ref="container">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="false"
        color="#4e73df"
        background-color="#f8f9fc"
        loader="dots"></loading>

      <div v-if="message.body" class="row">
        <div :class="`w-100 p-2 alert alert-${this.message.type}`">
          {{ this.message.body }}
        </div>
      </div>
      <div class="row">
        <div class="col-9">
          <div class="d-flex mb-2">
            <div>
              <div v-if="!isNew">
                <button type="button" class="btn rb-btn-s btn-outline-danger shadow-sm" @click="onClickDelete">
                  <i class="fas fa-trash-alt mr-1" /> {{ $t('action.delete') }}
                </button>
              </div>
            </div>
            <div class="d-flex ml-auto">
              <div class="mr-2" v-if="!isNew">
                <div class="dropdown">
                  <button class="btn rb-btn-s btn-outline-secondary shadow-sm dropdown-toggle" type="button" id="clickboardMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-paperclip mr-1" /> {{ $t('action.copyToClipboard') }}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="clickboardMenuButton">
                    <a class="dropdown-item" @click="onClickCopyTitle">
                      <div class="text-gray-600 font-weight-bold">Title</div>
                      <pre class="text-gray-500 small mb-0">{{ storyTitle }}</pre>
                    </a>
                    <a class="dropdown-item" @click="onClickCopyURL">
                      <div class="text-gray-600 font-weight-bold">URL</div>
                      <pre class="text-gray-500 mb-0">{{ storyURL }}</pre>
                    </a>
                    <a class="dropdown-item" @click="onClickCopyURLWithTitle">
                      <div class="text-gray-600 font-weight-bold">URL with Title</div>
                      <pre class="text-gray-500 small mb-0">{{ storyURLWithTitle }}</pre>
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="!isEdit" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.isEdit = true">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.edit') }}
                </button>
              </div>
              <div v-else-if="isEdit && !isNew" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.$refs.ticketForm.handleSubmit()">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.submit') }}
                </button>
              </div>
              <div>
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.$refs.modal.hide()">
                  <i class="fas fa-times mr-1" /> {{ $t('action.close') }}
                </button>
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center mb-2" v-if="story.id">
            <h2 class="h6 m-0 mr-2">
              <span class="badge badge-secondary badge-outlined rb-badge-radius mr-1">
                {{story.ticket_number_with_ticket_prefix}}
              </span>
              <span v-if="story.projectTicketCategory" class="badge badge-secondary rb-badge-radius" :style="categoryBadgeStyle">
                {{ story.projectTicketCategory.title }}
              </span>
            </h2>
            <div class="d-flex ml-auto">
              <div class="mr-2">
                <span v-if="story.created_user">
                  {{ $t('ticket.createdBy') }} {{ story.created_user.username }} <span :title="toMoment(story.created_at)">{{ fromNow(story.created_at) }}</span>
                </span>
              </div>
              <div>
                <span v-if="story.last_updated_user">
                  {{ $t('ticket.lastUpdatedBy') }} {{ story.last_updated_user.username }} <span :title="toMoment(story.updated_at)">{{ fromNow(story.updated_at) }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <TicketForm
              v-if="isEdit"
              :projectId="projectId"
              :ticket="story"
              ticketType="stories"
              :isLoading="isLoading"
              :afterSubmit="afterSubmit"
              :isNew="isNew"
              ref="ticketForm" />
            <TicketPreview
              v-else
              :projectId="projectId"
              :ticket="story"
              ticketType="stories"
              :isLoading="isLoading" />
          </div>
          <hr />
          <div v-if="story.tasks && story.tasks.length > 0">
            <div>
              <p class="text-gray-600 mb-2">{{ $t('title.relatedTasks')}}</p>
              <div class="d-flex w-100 align-items-center ml-1 mb-1" v-for="task in story.tasks" :key="task.id">
                <div class="badge badge-secondary badge-outlined rb-badge-radius mr-2">
                  {{ task.ticket_number_with_ticket_prefix }}
                </div>
                <div>
                  {{ task.title }}
                </div>
                <div class="ml-auto mr-2">
                  {{ task.project_ticket_status }}
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div>
            <b-tabs content-class="mt-3" v-if="!isNew">
              <b-tab>
                <template v-slot:title>
                  <i class="fas fa-comment"></i> {{ $t('tab.comment') }}
                </template>
                <CommentFormAndList
                  :projectId="projectId"
                  :ticket="selectedStory"
                  ticketType="stories"
                  :isLoading="isLoading"
                />
              </b-tab>
              <b-tab>
                <template v-slot:title>
                  <i class="fas fa-clock"></i> {{ $t('tab.history') }}
                </template>
                <HistoryList
                  :histories="story.histories"
                />
              </b-tab>
            </b-tabs>
          </div>
        </div>
        <div class="col-3 p-0">
          <div class="p-3 bg-gray-100">
            <SelectCategory :projectId="projectId" :ticket="story" ticketType="stories" :isNew="isNew" v-model="story.projectTicketCategory" />
            <SelectAssignee :projectId="projectId" :ticket="story" ticketType="stories" :isNew="isNew" v-model="story.assignee" />
            <SelectStatus :projectId="projectId" :ticket="story" ticketType="stories" :isNew="isNew" v-model="story.projectTicketStatus" />
            <InputPoint v-if="story.id != null" :projectId="projectId" :ticket="story" ticketType="stories" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import MarkdownText from '../MarkdownText'
import TicketForm from '../commons/TicketForm'
import TicketPreview from '../commons/TicketPreview'
import SelectCategory from '../commons/SelectCategory'
import SelectAssignee from '../commons/SelectAssignee'
import SelectStatus from '../commons/SelectStatus'
import InputPoint from '../commons/InputPoint'
import CommentFormAndList from '../commons/CommentFormAndList'
import HistoryList from '../commons/HistoryList'
import CustomMoment from '../../commons/custom-moment'
import urlparse from 'url-parse'
import VueClipboard2 from 'vue-clipboard2'
import ColorUtils from '../../mixins/colorUtils'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(VueClipboard2)

export default {
  components: {
    TicketForm,
    TicketPreview,
    SelectCategory,
    SelectAssignee,
    SelectStatus,
    InputPoint,
    CommentFormAndList,
    HistoryList,
    VueClipboard2,
    Loading
  },
  mixins: [
    ColorUtils
  ],
  name: 'StoryModal',
  props: {
    projectId: String,
    isLoading: Boolean,
  },
  data() {
    return {
      isEdit: false,
      story: {
        id: null,
        title: '',
        body: '',
        projectTicketStatus: null,
        projectTicketCategory: null,
        assignee: null
      },
      message: {
        type: null,
        body: null
      }
    }
  },
  computed: {
    storyTitle() {
      return `${this.story.ticket_number_with_ticket_prefix} ${this.story.title}`
    },
    storyURL() {
      return `${urlparse().origin + '/' + this.story.ticket_number_with_ticket_prefix}`
    },
    storyURLWithTitle() {
      return `${this.storyTitle}\n` +
             `${this.storyURL}`
    },
    categoryBadgeStyle() {
      let Color = require('color');

      let color = '#E2E3E5'
      if (this.story.projectTicketCategory) {
        color = this.story.projectTicketCategory.color
      }

      return {
        "background-color": color,
        color: this.idealTextColor(color),
        border: `1px solid ${Color(color).darken(0.1)}`
      }
    },
    isNew() {
      return this.story.id == null
    },
    ...mapState('Stories', {
      selectedStory: 'selectedStory'
    })
  },
  watch: {
    selectedStory: function (story, oldStory) {
      this.story = story

      if (story.assignee) {
        this.SET_ASSIGNEE({
          id: story.assignee.id,
          username: story.assignee.username,
          image: story.assignee.image,
        });
      }

      if (story.project_ticket_status) {
        story.projectTicketStatus = story.project_ticket_status
        this.SET_PROJECT_TICKET_STATUS({
          id: story.project_ticket_status.id,
          title: story.project_ticket_status.title,
        })
      }

      if (story.project_ticket_category) {
        story.projectTicketCategory = story.project_ticket_category
        this.SET_PROJECT_TICKET_CATEGORY({
          id: story.project_ticket_category.id,
          title: story.project_ticket_category.title,
          color: story.project_ticket_category.color
        })
      }
    }
  },
  methods: {
    onShow() {
      this.resetData()
      if (this.$route.query) {
        if (this.$route.query.message_type && this.$route.query.message) {
          this.message.type = this.$route.query.message_type
          this.message.body = this.$route.query.message
        }
      }

      if (this.$route.params.storyId) {
        this.getStory({
            projectId: this.projectId,
            storyId: this.$route.params.storyId
          })
      } else {
        this.isEdit = true
      }
    },
    onHide() {
      this.resetData()
      this.$router.push('/')
    },
    resetData() {
      this.story = {
        id: null,
        title: '',
        body: '',
        projectTicketStatus: null,
        projectTicketCategory: null,
        assignee: null
      }
      this.message = {
        type: null,
        body: null
      }
      this.isEdit = false
      this.SET_SELECTED_STORY(this.story)
      this.RESET_TICKET_ATTRIBUTES()
    },
    afterSubmit() {
      if (this.story.id) {
        this.isEdit = false
      } else {
        this.$refs.modal.hide()
      }
    },
    onClickCopyTitle () {
      const textBody = this.storyTitle
      this.copyText(textBody)
    },
    onClickCopyURL () {
      const textBody = this.storyURL
      this.copyText(textBody)
    },
    onClickCopyURLWithTitle() {
      const textBody = this.storyURLWithTitle
      this.copyText(textBody)
    },
    copyText(textBody) {
      const container = this.$refs.container
      this.$copyText(textBody, container).then((e) => {
        this.$bvToast.toast(this.$t('action.copiedToClipboard'), {
          noCloseButton: true,
          variant: 'success',
          autoHideDelay: 2000
        })
      }, (e) => {
        this.$bvToast.toast(this.$t('action.cannotCopiedToClipboard'), {
          noCloseButton: true,
          variant: 'danger',
          autoHideDelay: 3000
        })
      })
    },
    onClickDelete() {
      if (confirm('Are you sure?')) {
        this.deleteStory({
          projectId: this.projectId,
          storyId: this.story.id
        })

        this.$refs.modal.hide()
      }
    },
    fromNow(datetime) {
      return CustomMoment(datetime).fromNow()
    },
    toMoment(datetime) {
      return CustomMoment(datetime).format('LLLL')
    },
    ...mapActions('Stories', {
      getStory: 'getStory',
      deleteStory: 'deleteStory'
    }),
    ...mapMutations('Stories', [
      'SET_SELECTED_STORY'
    ]),
    ...mapMutations('Tickets', [
      'SET_ASSIGNEE',
      'SET_PROJECT_TICKET_STATUS',
      'SET_PROJECT_TICKET_CATEGORY',
      'RESET_TICKET_ATTRIBUTES'
    ])
  }
}
</script>

<style lang="scss">
#rb-story-modal {
  /* for vue-loading-overlay */
  position: relative;
}

.rb-modal {
  font-size: 0.8rem;

  .modal-dialog {
    max-width: 75%k
  }
}

/**
* Bootstrap Modal
*/
.modal {
    z-index: 1101 !important;
}

/**
* Vue Loading
*/
.vld-overlay.is-full-page {
    z-index: 1103 !important;
}
</style>