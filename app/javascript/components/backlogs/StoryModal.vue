<template>
  <b-modal
    id="storyModal"
    modal-class="rb-modal"
    size="lg"
    ref="modal"
    :visible='visible'
    @shown="onShow"
    @hidden="onHide"
    hide-header
    hide-footer
    no-fade>
    <div class="container">
      <div v-if="message.body" class="row">
        <div :class="`w-100 p-2 alert alert-${this.message.type}`">
          {{ this.message.body }}
        </div>
      </div>
      <div class="row">
        <div class="col-9">
          <div class="d-flex mb-2">
            <div>
              <div v-if="story.id != null">
                <button type="button" class="btn rb-btn-s btn-outline-danger shadow-sm" @click="onClickDelete">
                  <i class="fas fa-trash-alt mr-1" /> {{ $t('action.delete') }}
                </button>
              </div>
            </div>
            <div class="d-flex ml-auto">
              <div v-if="!isEdit" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.isEdit = true">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.edit') }}
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
            <h2 class="h5 m-0">
              <span class="badge badge-info mr-2" :style="badgeColor">
                {{story.ticket_number_with_ticket_prefix}}
              </span>
            </h2>
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
          <div class="mb-2">
            <TicketForm
              v-if="isEdit"
              :projectId="projectId"
              :ticket="story"
              ticketType="stories"
              :isLoading="isLoading"
              :afterSubmit="afterSubmit" />
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
                <div class="badge badge-secondary mr-2">
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
            <b-tabs content-class="mt-3">
              <b-tab>
                <template v-slot:title>
                  <i class="fas fa-comment"></i> {{ $t('tab.comment') }}
                </template>
                <CommentFormAndList
                  v-if="story.id"
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
            <SelectCategory :projectId="projectId" :ticket="story" ticketType="stories" :isNew="story.id == null" v-model="story.projectTicketCategory" />
            <SelectAssignee :projectId="projectId" :ticket="story" ticketType="stories" :isNew="story.id == null" v-model="story.assignee" />
            <SelectStatus :projectId="projectId" :ticket="story" ticketType="stories" :isNew="story.id == null" v-model="story.projectTicketStatus" />
            <InputPoint v-if="story.id != null" :projectId="projectId" :ticket="story" ticketType="stories" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import axios from 'axios'
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

export default {
  components: {
    TicketForm,
    TicketPreview,
    SelectCategory,
    SelectAssignee,
    SelectStatus,
    InputPoint,
    CommentFormAndList,
    HistoryList
  },
  name: 'StoryModal',
  props: {
    projectId: String,
    visible: Boolean
  },
  data() {
    return {
      isEdit: false,
      isLoading: false,
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
    badgeColor() {
      let color = '#858796'
      if (this.story.project_ticket_category) {
        color = this.story.project_ticket_category.color
      }

      return {
        "background-color": color
      }
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
        this.isLoading = true
        this.getStory({
            projectId: this.projectId,
            storyId: this.$route.params.storyId
          })
          .then(story => {
            this.isLoading = false
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
.rb-modal {
  font-size: 0.8rem;

  .modal-dialog {
    max-width: 75%
  }
}
</style>